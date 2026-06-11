import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { respuestaClaveSchema } from "@/validations/pregunta-clave-schema"

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

  const body = await req.json()
  const parsed = respuestaClaveSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const pregunta = await prisma.preguntaClave.findUnique({
    where: { id: parsed.data.preguntaClaveId },
  })

  if (!pregunta) {
    return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 })
  }

  if (pregunta.bloqueada && session.user.rol !== "ADMIN") {
    return NextResponse.json(
      { error: "Esta pregunta está bloqueada por el administrador" },
      { status: 400 }
    )
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
    if (pregunta.bloqueada && session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "Esta pregunta está bloqueada por el administrador" },
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
