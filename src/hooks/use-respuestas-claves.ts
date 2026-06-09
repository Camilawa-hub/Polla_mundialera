import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { RespuestaClave } from "@/types"

async function fetchRespuestasClaves(): Promise<RespuestaClave[]> {
  const res = await fetch("/api/respuestas-claves")
  if (!res.ok) throw new Error("Error al cargar respuestas")
  return res.json()
}

async function guardarRespuesta(data: { preguntaClaveId: string; respuesta: string }) {
  const res = await fetch("/api/respuestas-claves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Error al guardar respuesta")
  }
  return res.json()
}

export function useRespuestasClaves() {
  return useQuery({
    queryKey: ["respuestas-claves"],
    queryFn: fetchRespuestasClaves,
  })
}

export function useGuardarRespuesta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: guardarRespuesta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respuestas-claves"] })
    },
  })
}
