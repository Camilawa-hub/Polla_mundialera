import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { recalcularPuntajes } from "@/services/puntaje-service"

export async function POST() {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    await recalcularPuntajes()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al recalcular puntajes" }, { status: 500 })
  }
}
