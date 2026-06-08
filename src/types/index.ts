export type Rol = "ADMIN" | "PARTICIPANTE"
export type EstadoPartido = "PENDIENTE" | "EN_VIVO" | "FINALIZADO"

export interface Usuario {
  id: string
  nombre: string
  username: string
  rol: Rol
  fechaCreacion: string
}

export interface Partido {
  id: string
  fechaHora: string
  equipoLocal: string
  equipoVisitante: string
  fase: string
  grupo: string | null
  estado: EstadoPartido
  golesLocal: number | null
  golesVisitante: number | null
}

export interface Prediccion {
  id: string
  usuarioId: string
  partidoId: string
  golesLocalPredicho: number
  golesVisitantePredicho: number
  fechaPrediccion: string
  puntosObtenidos: number | null
  partido?: Partido
  usuario?: Usuario
}

export interface Puntaje {
  id: string
  usuarioId: string
  puntosTotales: number
  resultadosExactos: number
  ganadoresAcertados: number
  usuario?: Usuario
}

export interface Estadisticas {
  ranking: (Puntaje & { usuario: Usuario })[]
  aciertosPorUsuario: { usuarioId: string; nombre: string; total: number; exactos: number }[]
  partidosMasAcertados: { partidoId: string; equipos: string; aciertos: number }[]
  partidosMasFallados: { partidoId: string; equipos: string; fallos: number }[]
}
