import { z } from "zod"

export const partidoSchema = z.object({
  equipoLocal: z.string().min(1, "Equipo local es requerido"),
  equipoVisitante: z.string().min(1, "Equipo visitante es requerido"),
  fechaHora: z.string().min(1, "Fecha y hora son requeridas"),
  fase: z.string().min(1, "Fase es requerida"),
  grupo: z.string().optional(),
})

export const resultadoSchema = z.object({
  golesLocal: z.number().int().min(0, "Debe ser un número válido"),
  golesVisitante: z.number().int().min(0, "Debe ser un número válido"),
})

export type PartidoSchema = z.infer<typeof partidoSchema>
export type ResultadoSchema = z.infer<typeof resultadoSchema>
