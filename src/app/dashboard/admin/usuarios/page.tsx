"use client"

import { useState } from "react"
import { useUsuarios, useCrearUsuario, useActualizarUsuario, useEliminarUsuario } from "@/hooks/use-usuarios"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUsuarioSchema } from "@/validations/usuario-schema"
import type { CreateUsuarioSchema } from "@/validations/usuario-schema"
import type { Usuario } from "@/types"

export default function AdminUsuariosPage() {
  const { data: usuarios, isLoading } = useUsuarios()
  const crearMutation = useCrearUsuario()
  const eliminarMutation = useEliminarUsuario()
  const actualizarMutation = useActualizarUsuario()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)

  const form = useForm<CreateUsuarioSchema>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: { nombre: "", username: "", password: "", rol: "PARTICIPANTE" },
  })

  function abrirDialog(usuario?: Usuario) {
    if (usuario) {
      setEditando(usuario)
      form.reset({ nombre: usuario.nombre, username: usuario.username, password: "", rol: usuario.rol })
    } else {
      setEditando(null)
      form.reset({ nombre: "", username: "", password: "", rol: "PARTICIPANTE" })
    }
    setDialogOpen(true)
  }

  async function onSubmit(data: CreateUsuarioSchema) {
    try {
      if (editando) {
        await actualizarMutation.mutateAsync({
          id: editando.id,
          data,
        })
        toast.success("Usuario actualizado")
      } else {
        await crearMutation.mutateAsync(data)
        toast.success("Usuario creado")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error")
    }
  }

  async function handleEliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return
    try {
      await eliminarMutation.mutateAsync(id)
      toast.success("Usuario eliminado")
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
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestiona los participantes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger onClick={() => abrirDialog()}>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input {...form.register("nombre")} placeholder="Nombre completo" />
                {form.formState.errors.nombre && (
                  <p className="text-sm text-destructive">{form.formState.errors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Usuario</Label>
                <Input {...form.register("username")} placeholder="Nombre de usuario" disabled={!!editando} />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Contraseña {editando && "(dejar vacío para mantener)"}</Label>
                <Input type="password" {...form.register("password")} placeholder="Mínimo 6 caracteres" />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={form.watch("rol")}
                  onValueChange={(v) => form.setValue("rol", v as "ADMIN" | "PARTICIPANTE")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARTICIPANTE">Participante</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={crearMutation.isPending || actualizarMutation.isPending}>
                {(crearMutation.isPending || actualizarMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editando ? "Actualizar" : "Crear Usuario"}
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
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios && usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nombre}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>
                      <Badge variant={u.rol === "ADMIN" ? "default" : "secondary"}>
                        {u.rol === "ADMIN" ? "Admin" : "Participante"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => abrirDialog(u)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminar(u.id, u.nombre)}
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
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hay usuarios registrados
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
