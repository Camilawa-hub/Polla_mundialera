"use client"

import { useQuery } from "@tanstack/react-query"
import type { Estadisticas } from "@/types"

async function fetchEstadisticas(): Promise<Estadisticas> {
  const [puntajesRes, prediccionesRes] = await Promise.all([
    fetch("/api/puntajes"),
    fetch("/api/predicciones"),
  ])

  if (!puntajesRes.ok || !prediccionesRes.ok) throw new Error("Error al cargar estadísticas")

  const puntajes = await puntajesRes.json()
  const predicciones = await prediccionesRes.json()

  const aciertosPorUsuario = puntajes.map((p: { usuario: { nombre: string; id: string }; puntosTotales: number; resultadosExactos: number }) => ({
    usuarioId: p.usuario.id,
    nombre: p.usuario.nombre,
    total: p.puntosTotales,
    exactos: p.resultadosExactos,
  }))

  const partidosMap = new Map<string, { aciertos: number; fallos: number; total: number }>()
  for (const pred of predicciones) {
    if (pred.puntosObtenidos === null) continue
    const key = pred.partidoId
    const entry = partidosMap.get(key) || { aciertos: 0, fallos: 0, total: 0 }
    entry.total++
    if (pred.puntosObtenidos >= 3) entry.aciertos++
    else entry.fallos++
    partidosMap.set(key, entry)
  }

  const partidosInfo = await fetch("/api/partidos").then((r) => r.json())

  const partidosMasAcertados = Array.from(partidosMap.entries())
    .sort((a, b) => b[1].aciertos - a[1].aciertos)
    .slice(0, 5)
    .map(([partidoId, stats]) => {
      const p = partidosInfo.find((pi: { id: string }) => pi.id === partidoId)
      return {
        partidoId,
        equipos: p ? `${p.equipoLocal} vs ${p.equipoVisitante}` : "Desconocido",
        aciertos: stats.aciertos,
      }
    })

  const partidosMasFallados = Array.from(partidosMap.entries())
    .sort((a, b) => b[1].fallos - a[1].fallos)
    .slice(0, 5)
    .map(([partidoId, stats]) => {
      const p = partidosInfo.find((pi: { id: string }) => pi.id === partidoId)
      return {
        partidoId,
        equipos: p ? `${p.equipoLocal} vs ${p.equipoVisitante}` : "Desconocido",
        fallos: stats.fallos,
      }
    })

  return {
    ranking: puntajes,
    aciertosPorUsuario,
    partidosMasAcertados,
    partidosMasFallados,
  }
}

export function useEstadisticas() {
  return useQuery({
    queryKey: ["estadisticas"],
    queryFn: fetchEstadisticas,
  })
}
