"use client"

import { useState } from "react"
import { usePartidos, useCrearPartido, useActualizarPartido, useEliminarPartido } from "@/hooks/use-partidos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { formatFecha } from "@/lib/utils"
import type { Partido } from "@/types"

export default function AdminPartidosPage() {
  const { data: partidos, isLoading } = usePartidos()
  const crearMutation = useCrearPartido()
  const actualizarMutation = useActualizarPartido()
  const eliminarMutation = useEliminarPartido()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<Partido | null>(null)
  const [formData, setFormData] = useState<{
    equipoLocal: string
    equipoVisitante: string
    fechaHora: string
    fase: string
    grupo: string
  }>({
    equipoLocal: "",
    equipoVisitante: "",
    fechaHora: "",
    fase: "GRUPOS",
    grupo: "",
  })

  function abrirDialog(partido?: Partido) {
    if (partido) {
      setEditando(partido)
      setFormData({
        equipoLocal: partido.equipoLocal,
        equipoVisitante: partido.equipoVisitante,
        fechaHora: new Date(partido.fechaHora).toISOString().slice(0, 16),
        fase: partido.fase,
        grupo: partido.grupo || "",
      })
    } else {
      setEditando(null)
      setFormData({ equipoLocal: "", equipoVisitante: "", fechaHora: "", fase: "GRUPOS", grupo: "" })
    }
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editando) {
        await actualizarMutation.mutateAsync({ id: editando.id, data: formData })
        toast.success("Partido actualizado")
      } else {
        await crearMutation.mutateAsync(formData)
        toast.success("Partido creado")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error")
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar este partido?")) return
    try {
      await eliminarMutation.mutateAsync(id)
      toast.success("Partido eliminado")
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partidos</h1>
          <p className="text-muted-foreground">Gestiona los partidos del mundial</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={() => abrirDialog()}>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Partido
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar Partido" : "Nuevo Partido"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Equipo Local</Label>
                  <Input
                    value={formData.equipoLocal}
                    onChange={(e) => setFormData((f) => ({ ...f, equipoLocal: e.target.value }))}
                    placeholder="Ej: Chile"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equipo Visitante</Label>
                  <Input
                    value={formData.equipoVisitante}
                    onChange={(e) => setFormData((f) => ({ ...f, equipoVisitante: e.target.value }))}
                    placeholder="Ej: Argentina"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fecha y Hora</Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaHora}
                  onChange={(e) => setFormData((f) => ({ ...f, fechaHora: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fase</Label>
                  <Select value={formData.fase} onValueChange={(v) => setFormData((f) => ({ ...f, fase: v ?? "" }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GRUPOS">Grupos</SelectItem>
                      <SelectItem value="OCTAVOS">Octavos</SelectItem>
                      <SelectItem value="CUARTOS">Cuartos</SelectItem>
                      <SelectItem value="SEMIFINALES">Semifinales</SelectItem>
                      <SelectItem value="TERCER_PUESTO">Tercer Puesto</SelectItem>
                      <SelectItem value="FINAL">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Grupo</Label>
                  <Input
                    value={formData.grupo}
                    onChange={(e) => setFormData((f) => ({ ...f, grupo: e.target.value }))}
                    placeholder="Ej: A"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={crearMutation.isPending || actualizarMutation.isPending}>
                {(crearMutation.isPending || actualizarMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editando ? "Actualizar" : "Crear Partido"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="hidden sm:table-cell">Fase</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partidos && partidos.length > 0 ? (
                partidos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.equipoLocal}</div>
                      <div className="text-muted-foreground">vs {p.equipoVisitante}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {formatFecha(p.fechaHora)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {p.fase}
                        {p.grupo ? ` · ${p.grupo}` : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.estado === "FINALIZADO" ? "default" : p.estado === "EN_VIVO" ? "secondary" : "outline"
                        }
                      >
                        {p.estado === "FINALIZADO" ? "Finalizado" : p.estado === "EN_VIVO" ? "En Vivo" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => abrirDialog(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminar(p.id)}
                          disabled={eliminarMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay partidos registrados
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
