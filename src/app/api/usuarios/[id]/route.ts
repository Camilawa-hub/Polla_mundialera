import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { updateUsuarioSchema } from "@/validations/usuario-schema"
import { hashPassword } from "@/services/auth-service"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await req.json()
    const validated = updateUsuarioSchema.parse(body)

    const data: Record<string, unknown> = {}
    if (validated.nombre) data.nombre = validated.nombre
    if (validated.username) data.username = validated.username
    if (validated.password) data.passwordHash = await hashPassword(validated.password)
    if (validated.rol) data.rol = validated.rol

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        username: true,
        rol: true,
        fechaCreacion: true,
      },
    })

    return NextResponse.json(usuario)
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  if (id === session.user.id) {
    return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 })
  }

  try {
    await prisma.usuario.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
