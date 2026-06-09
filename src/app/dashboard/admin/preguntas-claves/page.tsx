"use client"

import { useState } from "react"
import { usePreguntasClaves } from "@/hooks/use-preguntas-claves"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Trophy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { RespuestaClave } from "@/types"

export default function AdminPreguntasClavesPage() {
  const { data: preguntas, isLoading, refetch } = usePreguntasClaves()
  const [correctas, setCorrectas] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState<Record<string, boolean>>({})
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaClave[]>>({})

  async function cargarRespuestas(preguntaId: string) {
    try {
      const res = await fetch(`/api/respuestas-claves?preguntaClaveId=${preguntaId}`)
      if (res.ok) {
        const data = await res.json()
        setRespuestas((prev) => ({ ...prev, [preguntaId]: data }))
      }
    } catch {
      // silencioso
    }
  }

  async function handleToggleRespuestas(preguntaId: string) {
    if (respuestas[preguntaId]) {
      setRespuestas((prev) => {
        const next = { ...prev }
        delete next[preguntaId]
        return next
      })
    } else {
      await cargarRespuestas(preguntaId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  async function handleAsignarCorrecta(preguntaId: string) {
    const respuestaCorrecta = correctas[preguntaId]
    if (!respuestaCorrecta) {
      toast.error("Debes escribir la respuesta correcta")
      return
    }

    setCargando((prev) => ({ ...prev, [preguntaId]: true }))

    try {
      const res = await fetch(`/api/preguntas-claves/${preguntaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestaCorrecta }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al asignar respuesta correcta")
      }

      toast.success("Respuesta correcta asignada y puntajes recalculados")
      await cargarRespuestas(preguntaId)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al asignar")
    } finally {
      setCargando((prev) => ({ ...prev, [preguntaId]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Preguntas Claves — Admin</h1>
        <p className="text-muted-foreground">
          Gestiona las preguntas claves y asigna las respuestas correctas cuando termine el mundial
        </p>
      </div>

      {preguntas && preguntas.length > 0 ? (
        <div className="space-y-4">
          {preguntas.map((pregunta, idx) => {
            const yaTieneCorrecta = !!pregunta.respuestaCorrecta
            const respuestasPregunta = respuestas[pregunta.id] ?? []

            return (
              <Card key={pregunta.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>
                      {idx + 1}. {pregunta.pregunta}
                    </span>
                    <Badge variant={yaTieneCorrecta ? "default" : "secondary"}>
                      {yaTieneCorrecta ? "✔ Corregida" : "Pendiente"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Escribe la respuesta correcta..."
                      value={correctas[pregunta.id] ?? pregunta.respuestaCorrecta ?? ""}
                      onChange={(e) =>
                        setCorrectas((prev) => ({ ...prev, [pregunta.id]: e.target.value }))
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleAsignarCorrecta(pregunta.id)}
                      disabled={cargando[pregunta.id]}
                    >
                      {cargando[pregunta.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trophy className="h-4 w-4 mr-2" />
                      )}
                      Asignar
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRespuestas(pregunta.id)}
                  >
                    {respuestasPregunta.length > 0
                      ? "Ocultar respuestas"
                      : "Ver respuestas de participantes"}
                  </Button>

                  {respuestasPregunta.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Respuestas ({respuestasPregunta.length}):
                      </p>
                      <div className="grid gap-1">
                        {respuestasPregunta.map((r: any) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50"
                          >
                            <span>{r.usuario?.nombre ?? "Desconocido"}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{r.respuesta}</span>
                              {yaTieneCorrecta && (
                                <span>
                                  {r.puntosObtenidos && r.puntosObtenidos > 0 ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <span className="text-red-500">✗</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {yaTieneCorrecta && (
                    <p className="text-sm text-green-600">
                      Respuesta correcta actual: <strong>{pregunta.respuestaCorrecta}</strong>
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No hay preguntas claves configuradas
          </CardContent>
        </Card>
      )}
    </div>
  )
}
