import { useQuery } from "@tanstack/react-query"
import type { PreguntaClave } from "@/types"

async function fetchPreguntasClaves(): Promise<PreguntaClave[]> {
  const res = await fetch("/api/preguntas-claves")
  if (!res.ok) throw new Error("Error al cargar preguntas claves")
  return res.json()
}

export function usePreguntasClaves() {
  return useQuery({
    queryKey: ["preguntas-claves"],
    queryFn: fetchPreguntasClaves,
  })
}
