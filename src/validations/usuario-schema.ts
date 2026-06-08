import { z } from "zod"

export const createUsuarioSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido"),
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["ADMIN", "PARTICIPANTE"]),
})

export const updateUsuarioSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido").optional(),
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres").optional(),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres").optional(),
  rol: z.enum(["ADMIN", "PARTICIPANTE"]).optional(),
})

export type CreateUsuarioSchema = z.infer<typeof createUsuarioSchema>
export type UpdateUsuarioSchema = z.infer<typeof updateUsuarioSchema>
