import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { partidoSchema, resultadoSchema } from "@/validations/partido-schema"
import { recalcularPuntajesPartido } from "@/services/puntaje-service"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const partido = await prisma.partido.findUnique({
      where: { id },
      include: { predicciones: true },
    })
    if (!partido) {
      return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 })
    }
    return NextResponse.json(partido)
  } catch {
    return NextResponse.json({ error: "Error al obtener partido" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await req.json()

    if (body.golesLocal !== undefined || body.golesVisitante !== undefined) {
      const validated = resultadoSchema.parse(body)
      const partido = await prisma.partido.update({
        where: { id },
        data: {
          golesLocal: validated.golesLocal,
          golesVisitante: validated.golesVisitante,
          estado: "FINALIZADO",
        },
      })

      await recalcularPuntajesPartido(id)

      return NextResponse.json(partido)
    }

    const validated = partidoSchema.parse(body)
    const partido = await prisma.partido.update({
      where: { id },
      data: {
        equipoLocal: validated.equipoLocal,
        equipoVisitante: validated.equipoVisitante,
        fechaHora: new Date(validated.fechaHora),
        fase: validated.fase,
        grupo: validated.grupo || null,
      },
    })

    return NextResponse.json(partido)
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: "Datos inválidos", details: error }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al actualizar partido" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  try {
    await prisma.partido.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar partido" }, { status: 500 })
  }
}
