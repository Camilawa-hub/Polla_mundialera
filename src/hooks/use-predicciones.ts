"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Prediccion } from "@/types"

interface FetchPrediccionesParams {
  usuarioId?: string
  partidoId?: string
}

async function fetchPredicciones(params?: FetchPrediccionesParams): Promise<Prediccion[]> {
  const searchParams = new URLSearchParams()
  if (params?.usuarioId) searchParams.set("usuarioId", params.usuarioId)
  if (params?.partidoId) searchParams.set("partidoId", params.partidoId)
  const qs = searchParams.toString()
  const res = await fetch(`/api/predicciones${qs ? `?${qs}` : ""}`)
  if (!res.ok) throw new Error("Error al cargar predicciones")
  return res.json()
}

export function usePredicciones(params?: FetchPrediccionesParams) {
  return useQuery({
    queryKey: ["predicciones", params],
    queryFn: () => fetchPredicciones(params),
  })
}

export function useGuardarPrediccion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { partidoId: string; golesLocal: number; golesVisitante: number }) => {
      const res = await fetch("/api/predicciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al guardar predicción")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predicciones"] })
    },
  })
}

export function useEliminarPrediccion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/predicciones/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar predicción")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["predicciones"] }),
  })
}
