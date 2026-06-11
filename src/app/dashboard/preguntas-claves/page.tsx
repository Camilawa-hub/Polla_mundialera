"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePreguntasClaves } from "@/hooks/use-preguntas-claves"
import { useRespuestasClaves, useGuardarRespuesta } from "@/hooks/use-respuestas-claves"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { banderas } from "@/lib/flags"
import { Flag } from "@/components/shared/flag"
import { Save, Lock, CheckCircle2, HelpCircle } from "lucide-react"
import { toast } from "sonner"

const equipos = Object.keys(banderas).sort()

export default function PreguntasClavesPage() {
  const { data: session } = useSession()
  const { data: preguntas, isLoading: loadingPreguntas } = usePreguntasClaves()
  const { data: respuestas, isLoading: loadingRespuestas } = useRespuestasClaves()
  const guardarMutation = useGuardarRespuesta()

  const [valores, setValores] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (respuestas && respuestas.length > 0 && Object.keys(valores).length === 0) {
      const inicial: Record<string, string> = {}
      for (const r of respuestas) {
        inicial[r.preguntaClaveId] = r.respuesta
      }
      setValores(inicial)
    }
  }, [respuestas])

  if (loadingPreguntas || loadingRespuestas) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const respuestasMap = new Map(respuestas?.map((r) => [r.preguntaClaveId, r]) ?? [])
  const tieneRespuestas = respuestas && respuestas.length > 0

  const preguntasActivas = preguntas?.filter((p) => p.activa) ?? []
  const todasBloqueadas = preguntasActivas.every((p) => p.bloqueada)

  async function handleGuardar() {
    if (!session?.user?.id) return
    setEnviando(true)

    try {
      for (const pregunta of preguntasActivas) {
        const respuesta = valores[pregunta.id]
        if (!respuesta) continue

        await guardarMutation.mutateAsync({
          preguntaClaveId: pregunta.id,
          respuesta,
        })
      }
      toast.success("Respuestas guardadas correctamente")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar respuestas")
    } finally {
      setEnviando(false)
    }
  }

  function handleChange(preguntaId: string, value: string) {
    setValores((prev) => ({ ...prev, [preguntaId]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Preguntas Claves</h1>
        <p className="text-muted-foreground">
          Responde estas preguntas antes de que el administrador las bloquee.
          {todasBloqueadas
            ? " Todas las preguntas están bloqueadas."
            : " Una vez bloqueadas no se podrán modificar."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Tus pronósticos especiales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {preguntasActivas.map((pregunta, idx) => {
            const respuesta = respuestasMap.get(pregunta.id)
            const valorActual = valores[pregunta.id] ?? respuesta?.respuesta ?? ""
            const bloqueada = pregunta.bloqueada

            return (
              <div key={pregunta.id}>
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    {idx + 1}. {pregunta.pregunta}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({pregunta.puntosMaximos} pts)
                    </span>
                    {bloqueada && (
                      <span className="text-xs text-amber-500 ml-2">
                        (bloqueada)
                      </span>
                    )}
                  </Label>

                  {pregunta.tipo === "SELECCION" ? (
                    <Select
                      value={valorActual}
                      onValueChange={(v) => v && handleChange(pregunta.id, v)}
                      disabled={bloqueada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un equipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {equipos.map((eq) => (
                          <SelectItem key={eq} value={eq}>
                            <Flag pais={eq} /> {eq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : pregunta.tipo === "NUMERO" ? (
                    <Input
                      type="number"
                      min={0}
                      placeholder="Ingresa un número..."
                      value={valorActual}
                      onChange={(e) => handleChange(pregunta.id, e.target.value)}
                      disabled={bloqueada}
                    />
                  ) : (
                    <Input
                      placeholder="Escribe tu respuesta..."
                      value={valorActual}
                      onChange={(e) => handleChange(pregunta.id, e.target.value)}
                      disabled={bloqueada}
                    />
                  )}

                  {respuesta?.puntosObtenidos !== null && respuesta?.puntosObtenidos !== undefined && (
                    <p className={`text-sm flex items-center gap-1 ${
                      respuesta.puntosObtenidos > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                      {respuesta.puntosObtenidos > 0
                        ? `¡Acertaste! (+${respuesta.puntosObtenidos} pts)`
                        : respuesta.pregunta?.respuestaCorrecta
                          ? `No acertaste. Respuesta correcta: ${respuesta.pregunta.respuestaCorrecta}`
                          : "Respuesta registrada (pendiente de corrección)"}
                    </p>
                  )}
                </div>
                {idx < preguntasActivas.length - 1 && <Separator className="mt-4" />}
              </div>
            )
          })}

          {!todasBloqueadas && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleGuardar}
                disabled={enviando || guardarMutation.isPending}
              >
                {enviando || guardarMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {tieneRespuestas ? "Actualizar respuestas" : "Enviar respuestas"}
              </Button>
            </div>
          )}

          {todasBloqueadas && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <Lock className="h-4 w-4" />
              Todas las preguntas están bloqueadas por el administrador
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
