"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarcadorInput } from "./marcador-input"
import { formatFechaCorta, partidoBloqueado, getEstadoPuntaje } from "@/lib/utils"
import { getBandera } from "@/lib/flags"
import { useGuardarPrediccion } from "@/hooks/use-predicciones"
import { Save, Lock, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"
import type { Partido, Prediccion } from "@/types"

interface PrediccionCardProps {
  partido: Partido
  prediccion?: Prediccion
}

export function PrediccionCard({ partido, prediccion }: PrediccionCardProps) {
  const { data: session } = useSession()
  const guardarMutation = useGuardarPrediccion()
  const bloqueado = partidoBloqueado(partido.fechaHora)
  const finalizado = partido.estado === "FINALIZADO"

  const [golesLocal, setGolesLocal] = useState(
    prediccion?.golesLocalPredicho ?? 0
  )
  const [golesVisitante, setGolesVisitante] = useState(
    prediccion?.golesVisitantePredicho ?? 0
  )

  const tienePrediccion = !!prediccion
  const esModificado =
    !tienePrediccion ||
    golesLocal !== prediccion.golesLocalPredicho ||
    golesVisitante !== prediccion.golesVisitantePredicho

  async function handleGuardar() {
    if (!session?.user?.id) return

    try {
      await guardarMutation.mutateAsync({
        partidoId: partido.id,
        golesLocal,
        golesVisitante,
      })
      toast.success("Predicción guardada")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar")
    }
  }

  const estadoPuntaje = prediccion?.puntosObtenidos !== null
    ? getEstadoPuntaje(prediccion?.puntosObtenidos)
    : null

  return (
    <Card className={bloqueado ? "opacity-80" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {partido.fase} {partido.grupo ? `· Grupo ${partido.grupo}` : ""}
          </Badge>
          <div className="flex items-center gap-1">
            {bloqueado ? (
              <Badge variant="secondary" className="text-xs">
                <Lock className="h-3 w-3 mr-1" /> Bloqueado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" /> Editable
              </Badge>
            )}
            {finalizado && estadoPuntaje && (
              <Badge variant="outline" className={estadoPuntaje.color}>
                {prediccion?.puntosObtenidos === 3 && "🟢 "}
                {prediccion?.puntosObtenidos === 1 && "🟡 "}
                {prediccion?.puntosObtenidos === 0 && "🔴 "}
                {prediccion?.puntosObtenidos} pts
              </Badge>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          {formatFechaCorta(partido.fechaHora)}
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex-1 text-right">
            <span className="font-semibold text-sm">{getBandera(partido.equipoLocal)} {partido.equipoLocal}</span>
          </div>

          <div className="flex items-center gap-2">
            <MarcadorInput
              value={golesLocal}
              onChange={setGolesLocal}
              disabled={bloqueado || finalizado}
              label="Local"
            />
            <span className="text-lg font-bold text-muted-foreground">:</span>
            <MarcadorInput
              value={golesVisitante}
              onChange={setGolesVisitante}
              disabled={bloqueado || finalizado}
              label="Visit."
            />
          </div>

          <div className="flex-1 text-left">
            <span className="font-semibold text-sm">{getBandera(partido.equipoVisitante)} {partido.equipoVisitante}</span>
          </div>
        </div>

        {finalizado && partido.golesLocal !== null && (
          <div className="text-center text-sm text-muted-foreground mb-3">
            Resultado real:{" "}
            <span className="font-bold text-foreground">
              {getBandera(partido.equipoLocal)} {partido.equipoLocal} {partido.golesLocal} - {partido.golesVisitante}{" "}
              {getBandera(partido.equipoVisitante)} {partido.equipoVisitante}
            </span>
          </div>
        )}

        {!bloqueado && !finalizado && (
          <div className="flex justify-center">
            <Button
              size="sm"
              onClick={handleGuardar}
              disabled={!esModificado || guardarMutation.isPending}
            >
              {guardarMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {tienePrediccion ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        )}

        {finalizado && prediccion && (
          <div className="flex justify-center items-center gap-2 text-sm">
            {prediccion.puntosObtenidos === 3 && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="h-4 w-4" /> ¡Resultado exacto! +3 pts
              </span>
            )}
            {prediccion.puntosObtenidos === 1 && (
              <span className="flex items-center gap-1 text-yellow-500">
                <CheckCircle2 className="h-4 w-4" /> Ganador/empate acertado +1 pt
              </span>
            )}
            {prediccion.puntosObtenidos === 0 && (
              <span className="flex items-center gap-1 text-red-500">
                Resultado incorrecto
              </span>
            )}
          </div>
        )}

        {!prediccion && finalizado && (
          <div className="text-center text-sm text-destructive">
            No realizaste predicción para este partido (0 pts)
          </div>
        )}
      </CardContent>
    </Card>
  )
}
