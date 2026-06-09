import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { preguntaClaveSchema } from "@/validations/pregunta-clave-schema"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const preguntas = await prisma.preguntaClave.findMany({
    orderBy: { orden: "asc" },
  })

  return NextResponse.json(preguntas)
}

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = preguntaClaveSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const pregunta = await prisma.preguntaClave.create({
    data: parsed.data,
  })

  return NextResponse.json(pregunta)
}
