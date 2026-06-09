import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { respuestaCorrectaSchema } from "@/validations/pregunta-clave-schema"
import { recalcularPreguntasClaves } from "@/services/puntaje-service"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  if (body.respuestaCorrecta !== undefined) {
    const parsed = respuestaCorrectaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const pregunta = await prisma.preguntaClave.update({
      where: { id },
      data: { respuestaCorrecta: parsed.data.respuestaCorrecta },
    })

    await recalcularPreguntasClaves(id)

    return NextResponse.json(pregunta)
  }

  const pregunta = await prisma.preguntaClave.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(pregunta)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  await prisma.preguntaClave.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
