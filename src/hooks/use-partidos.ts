"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Partido } from "@/types"

async function fetchPartidos(): Promise<Partido[]> {
  const res = await fetch("/api/partidos")
  if (!res.ok) throw new Error("Error al cargar partidos")
  return res.json()
}

export function usePartidos() {
  return useQuery({
    queryKey: ["partidos"],
    queryFn: fetchPartidos,
  })
}

export function useCrearPartido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Partido>) => {
      const res = await fetch("/api/partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error al crear partido")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partidos"] }),
  })
}

export function useActualizarPartido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Partido> }) => {
      const res = await fetch(`/api/partidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error al actualizar partido")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partidos"] }),
  })
}

export function useEliminarPartido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/partidos/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar partido")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partidos"] }),
  })
}
