import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { prediccionSchema } from "@/validations/prediccion-schema"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const usuarioId = searchParams.get("usuarioId")
  const partidoId = searchParams.get("partidoId")

  try {
    const where: Record<string, unknown> = {}
    if (usuarioId) where.usuarioId = usuarioId
    if (partidoId) where.partidoId = partidoId

    const predicciones = await prisma.prediccion.findMany({
      where,
      include: {
        partido: true,
        usuario: { select: { id: true, nombre: true, username: true } },
      },
      orderBy: { fechaPrediccion: "desc" },
    })

    return NextResponse.json(predicciones)
  } catch {
    return NextResponse.json({ error: "Error al obtener predicciones" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = prediccionSchema.parse(body)

    const partido = await prisma.partido.findUnique({
      where: { id: validated.partidoId },
    })

    if (!partido) {
      return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 })
    }

    if (new Date() >= new Date(partido.fechaHora)) {
      return NextResponse.json({ error: "Partido bloqueado" }, { status: 403 })
    }

    const prediccion = await prisma.prediccion.upsert({
      where: {
        usuarioId_partidoId: {
          usuarioId: session.user.id,
          partidoId: validated.partidoId,
        },
      },
      update: {
        golesLocalPredicho: validated.golesLocal,
        golesVisitantePredicho: validated.golesVisitante,
      },
      create: {
        usuarioId: session.user.id,
        partidoId: validated.partidoId,
        golesLocalPredicho: validated.golesLocal,
        golesVisitantePredicho: validated.golesVisitante,
      },
    })

    return NextResponse.json(prediccion, { status: 201 })
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al guardar predicción" }, { status: 500 })
  }
}
