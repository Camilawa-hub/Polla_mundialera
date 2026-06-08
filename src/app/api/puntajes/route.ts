import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const puntajes = await prisma.puntaje.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            username: true,
            rol: true,
          },
        },
      },
      orderBy: [{ puntosTotales: "desc" }, { resultadosExactos: "desc" }, { ganadoresAcertados: "desc" }],
    })

    return NextResponse.json(puntajes)
  } catch {
    return NextResponse.json({ error: "Error al obtener puntajes" }, { status: 500 })
  }
}
