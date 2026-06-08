"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Usuario } from "@/types"
import type { CreateUsuarioSchema, UpdateUsuarioSchema } from "@/validations/usuario-schema"

async function fetchUsuarios(): Promise<Usuario[]> {
  const res = await fetch("/api/usuarios")
  if (!res.ok) throw new Error("Error al cargar usuarios")
  return res.json()
}

export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
  })
}

export function useCrearUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateUsuarioSchema) => {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  })
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUsuarioSchema }) => {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error al actualizar usuario")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  })
}

export function useEliminarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar usuario")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  })
}
