import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function verificarCredenciales(username: string, password: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { username },
  })

  if (!usuario) return null

  const passwordMatch = await bcrypt.compare(password, usuario.passwordHash)
  if (!passwordMatch) return null

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    username: usuario.username,
    rol: usuario.rol,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
