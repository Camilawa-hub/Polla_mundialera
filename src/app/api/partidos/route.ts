import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { partidoSchema } from "@/validations/partido-schema"

export async function GET() {
  try {
    const partidos = await prisma.partido.findMany({
      orderBy: { fechaHora: "asc" },
    })
    return NextResponse.json(partidos)
  } catch {
    return NextResponse.json({ error: "Error al obtener partidos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = partidoSchema.parse(body)

    const partido = await prisma.partido.create({
      data: {
        equipoLocal: validated.equipoLocal,
        equipoVisitante: validated.equipoVisitante,
        fechaHora: new Date(validated.fechaHora),
        fase: validated.fase,
        grupo: validated.grupo || null,
      },
    })

    return NextResponse.json(partido, { status: 201 })
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: "Datos inválidos", details: error }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al crear partido" }, { status: 500 })
  }
}
