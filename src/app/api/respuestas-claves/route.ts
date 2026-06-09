import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { respuestaClaveSchema } from "@/validations/pregunta-clave-schema"

const PRIMER_PARTIDO = new Date("2026-06-11T15:00:00-04:00")

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const preguntaClaveId = searchParams.get("preguntaClaveId")

  if (session.user.rol === "ADMIN" && preguntaClaveId) {
    const respuestas = await prisma.respuestaClave.findMany({
      where: { preguntaClaveId },
      include: {
        pregunta: true,
        usuario: { select: { id: true, nombre: true, username: true } },
      },
    })
    return NextResponse.json(respuestas)
  }

  const respuestas = await prisma.respuestaClave.findMany({
    where: { usuarioId: session.user.id },
    include: { pregunta: true },
  })

  return NextResponse.json(respuestas)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  if (session.user.rol !== "ADMIN" && new Date() >= PRIMER_PARTIDO) {
    return NextResponse.json(
      { error: "El periodo de respuestas ha terminado (primer partido ya comenzó)" },
      { status: 400 }
    )
  }

  const body = await req.json()
  const parsed = respuestaClaveSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existente = await prisma.respuestaClave.findUnique({
    where: {
      usuarioId_preguntaClaveId: {
        usuarioId: session.user.id,
        preguntaClaveId: parsed.data.preguntaClaveId,
      },
    },
  })

  if (existente) {
    if (new Date() >= PRIMER_PARTIDO) {
      return NextResponse.json(
        { error: "Ya respondiste esta pregunta y el periodo terminó" },
        { status: 400 }
      )
    }

    const respuesta = await prisma.respuestaClave.update({
      where: { id: existente.id },
      data: { respuesta: parsed.data.respuesta },
    })

    return NextResponse.json(respuesta)
  }

  const respuesta = await prisma.respuestaClave.create({
    data: {
      usuarioId: session.user.id,
      preguntaClaveId: parsed.data.preguntaClaveId,
      respuesta: parsed.data.respuesta,
    },
  })

  return NextResponse.json(respuesta)
}
