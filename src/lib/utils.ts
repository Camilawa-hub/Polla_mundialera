import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFecha(fecha: Date | string): string {
  const d = new Date(fecha)
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatFechaCorta(fecha: Date | string): string {
  const d = new Date(fecha)
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function partidoBloqueado(fechaHora: Date | string): boolean {
  return new Date() >= new Date(fechaHora)
}

export function getEstadoPuntaje(
  puntos: number | null | undefined
): { label: string; color: string } {
  if (puntos === null || puntos === undefined) {
    return { label: "Sin jugar", color: "text-gray-400" }
  }
  if (puntos === 3) return { label: "Resultado exacto", color: "text-green-500" }
  if (puntos === 1) return { label: "Ganador/empate acertado", color: "text-yellow-500" }
  return { label: "Incorrecto", color: "text-red-500" }
}
