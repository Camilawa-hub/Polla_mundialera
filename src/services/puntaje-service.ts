import { prisma } from "@/lib/prisma"

export function calcularPuntos(
  golesLocalPred: number,
  golesVisitantePred: number,
  golesLocalReal: number,
  golesVisitanteReal: number
): number {
  const exacto = golesLocalPred === golesLocalReal && golesVisitantePred === golesVisitanteReal
  if (exacto) return 3

  const diffPred = Math.sign(golesLocalPred - golesVisitantePred)
  const diffReal = Math.sign(golesLocalReal - golesVisitanteReal)

  if (diffPred === diffReal) return 1

  return 0
}

export async function recalcularPuntajes() {
  const usuarios = await prisma.usuario.findMany({
    where: { rol: "PARTICIPANTE" },
    include: {
      predicciones: {
        where: { partido: { estado: "FINALIZADO" } },
        include: { partido: true },
      },
    },
  })

  for (const usuario of usuarios) {
    let puntosTotales = 0
    let resultadosExactos = 0
    let ganadoresAcertados = 0

    for (const pred of usuario.predicciones) {
      const partido = pred.partido
      if (partido.golesLocal === null || partido.golesVisitante === null) continue

      const puntos = calcularPuntos(
        pred.golesLocalPredicho,
        pred.golesVisitantePredicho,
        partido.golesLocal,
        partido.golesVisitante
      )

      await prisma.prediccion.update({
        where: { id: pred.id },
        data: { puntosObtenidos: puntos },
      })

      puntosTotales += puntos
      if (puntos === 3) resultadosExactos++
      if (puntos >= 1) ganadoresAcertados++
    }

    await prisma.puntaje.upsert({
      where: { usuarioId: usuario.id },
      update: { puntosTotales, resultadosExactos, ganadoresAcertados },
      create: { usuarioId: usuario.id, puntosTotales, resultadosExactos, ganadoresAcertados },
    })
  }
}

export async function recalcularPuntajesPartido(partidoId: string) {
  const partido = await prisma.partido.findUnique({
    where: { id: partidoId },
  })

  if (!partido || partido.golesLocal === null || partido.golesVisitante === null) return

  const predicciones = await prisma.prediccion.findMany({
    where: { partidoId },
  })

  for (const pred of predicciones) {
    const puntos = calcularPuntos(
      pred.golesLocalPredicho,
      pred.golesVisitantePredicho,
      partido.golesLocal,
      partido.golesVisitante
    )

    await prisma.prediccion.update({
      where: { id: pred.id },
      data: { puntosObtenidos: puntos },
    })
  }

  await recalcularPuntajes()
}
