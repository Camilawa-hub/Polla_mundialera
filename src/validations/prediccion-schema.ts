import { z } from "zod"

export const prediccionSchema = z.object({
  partidoId: z.string(),
  golesLocal: z.number().int().min(0, "Debe ser 0 o más"),
  golesVisitante: z.number().int().min(0, "Debe ser 0 o más"),
})

export type PrediccionSchema = z.infer<typeof prediccionSchema>
