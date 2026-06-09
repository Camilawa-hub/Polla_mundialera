import { z } from "zod"

export const preguntaClaveSchema = z.object({
  pregunta: z.string().min(1, "La pregunta es requerida"),
  tipo: z.enum(["SELECCION", "TEXTO", "NUMERO"]),
  opciones: z.string().nullable().optional(),
  puntosMaximos: z.number().int().min(1).default(2),
  activa: z.boolean().default(true),
  orden: z.number().int().min(0).default(0),
})

export const respuestaClaveSchema = z.object({
  preguntaClaveId: z.string(),
  respuesta: z.string().min(1, "La respuesta es requerida"),
})

export const respuestaCorrectaSchema = z.object({
  respuestaCorrecta: z.string().min(1, "La respuesta correcta es requerida"),
})

export type PreguntaClaveSchema = z.infer<typeof preguntaClaveSchema>
export type RespuestaClaveSchema = z.infer<typeof respuestaClaveSchema>
