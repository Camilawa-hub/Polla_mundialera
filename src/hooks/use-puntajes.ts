"use client"

import { useQuery } from "@tanstack/react-query"
import type { Puntaje } from "@/types"

async function fetchPuntajes(): Promise<(Puntaje & { usuario: { id: string; nombre: string; username: string; rol: string } })[]> {
  const res = await fetch("/api/puntajes")
  if (!res.ok) throw new Error("Error al cargar puntajes")
  return res.json()
}

export function usePuntajes() {
  return useQuery({
    queryKey: ["puntajes"],
    queryFn: fetchPuntajes,
    refetchInterval: 30000,
  })
}
