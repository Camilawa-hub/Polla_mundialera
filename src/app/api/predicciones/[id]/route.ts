import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  try {
    const prediccion = await prisma.prediccion.findUnique({ where: { id } })
    if (!prediccion) {
      return NextResponse.json({ error: "Predicción no encontrada" }, { status: 404 })
    }

    if (prediccion.usuarioId !== session.user.id && session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await prisma.prediccion.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar predicción" }, { status: 500 })
  }
}
