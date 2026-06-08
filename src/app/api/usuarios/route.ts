import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createUsuarioSchema } from "@/validations/usuario-schema"
import { hashPassword } from "@/services/auth-service"

export async function GET() {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        username: true,
        rol: true,
        fechaCreacion: true,
      },
      orderBy: { fechaCreacion: "asc" },
    })
    return NextResponse.json(usuarios)
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = createUsuarioSchema.parse(body)

    const existente = await prisma.usuario.findUnique({
      where: { username: validated.username },
    })

    if (existente) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    const passwordHash = await hashPassword(validated.password)

    const usuario = await prisma.usuario.create({
      data: {
        nombre: validated.nombre,
        username: validated.username,
        passwordHash,
        rol: validated.rol,
      },
      select: {
        id: true,
        nombre: true,
        username: true,
        rol: true,
        fechaCreacion: true,
      },
    })

    await prisma.puntaje.create({
      data: { usuarioId: usuario.id },
    })

    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
