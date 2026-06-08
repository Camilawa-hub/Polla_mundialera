"use client"

import { useState } from "react"
import { usePartidos, useActualizarPartido } from "@/hooks/use-partidos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { formatFechaCorta } from "@/lib/utils"

export default function AdminResultadosPage() {
  const { data: partidos, isLoading } = usePartidos()
  const actualizarMutation = useActualizarPartido()

  const [resultados, setResultados] = useState<Record<string, { golesLocal: number; golesVisitante: number }>>({})

  const pendientes = partidos?.filter((p) => p.estado !== "FINALIZADO") ?? []
  const finalizados = partidos?.filter((p) => p.estado === "FINALIZADO") ?? []

  async function handleGuardarResultado(partidoId: string) {
    const data = resultados[partidoId]
    if (!data) return

    try {
      await actualizarMutation.mutateAsync({
        id: partidoId,
        data: { golesLocal: data.golesLocal, golesVisitante: data.golesVisitante },
      })
      setResultados((prev) => {
        const copy = { ...prev }
        delete copy[partidoId]
        return copy
      })
      toast.success("Resultado guardado")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resultados</h1>
        <p className="text-muted-foreground">Ingresa los marcadores oficiales</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pendientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-center">Marcador</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendientes.length > 0 ? (
                pendientes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{p.equipoLocal}</div>
                      <div className="font-medium text-sm">{p.equipoVisitante}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {formatFechaCorta(p.fechaHora)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          className="w-14 h-10 text-center"
                          placeholder="0"
                          value={resultados[p.id]?.golesLocal ?? ""}
                          onChange={(e) =>
                            setResultados((prev) => ({
                              ...prev,
                              [p.id]: {
                                golesLocal: Number(e.target.value),
                                golesVisitante: prev[p.id]?.golesVisitante ?? 0,
                              },
                            }))
                          }
                        />
                        <span className="text-lg font-bold">:</span>
                        <Input
                          type="number"
                          min={0}
                          className="w-14 h-10 text-center"
                          placeholder="0"
                          value={resultados[p.id]?.golesVisitante ?? ""}
                          onChange={(e) =>
                            setResultados((prev) => ({
                              ...prev,
                              [p.id]: {
                                golesLocal: prev[p.id]?.golesLocal ?? 0,
                                golesVisitante: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleGuardarResultado(p.id)}
                        disabled={!resultados[p.id] || actualizarMutation.isPending}
                      >
                        {actualizarMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hay partidos pendientes por resultado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Finalizados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalizados.length > 0 ? (
                finalizados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{p.equipoLocal}</div>
                      <div className="font-medium text-sm">{p.equipoVisitante}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {formatFechaCorta(p.fechaHora)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold">
                        {p.golesLocal} - {p.golesVisitante}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No hay partidos finalizados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
