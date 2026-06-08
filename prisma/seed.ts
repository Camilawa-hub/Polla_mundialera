import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Limpiando base de datos...")
  await prisma.prediccion.deleteMany()
  await prisma.puntaje.deleteMany()
  await prisma.partido.deleteMany()
  await prisma.usuario.deleteMany()

  console.log("Creando usuarios...")
  const passwordHash = await bcrypt.hash("Polla2026!", 10)

  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador",
      username: "admin",
      passwordHash,
      rol: "ADMIN",
    },
  })

  const participantesData = [
    "Carlos Pérez",
    "María González",
    "José Martínez",
    "Ana López",
    "Luis Rodríguez",
    "Carmen Fernández",
    "Pedro Sánchez",
    "Rosa Vargas",
    "Diego Ramírez",
    "Sofía Torres",
  ]

  const participantes = []
  for (let i = 0; i < participantesData.length; i++) {
    const nombre = participantesData[i]
    const username = `participante${i + 1}`
    const usuario = await prisma.usuario.create({
      data: { nombre, username, passwordHash, rol: "PARTICIPANTE" },
    })
    participantes.push(usuario)
    console.log(`  ${nombre} -> usuario: ${username}, contraseña: Polla2026!`)
  }

  console.log("\nCreando partidos del Mundial 2026...")

  const grupoA = [
    { local: "Argentina", visitante: "Arabia Saudita" },
    { local: "México", visitante: "Polonia" },
  ]
  const grupoB = [
    { local: "Brasil", visitante: "Canadá" },
    { local: "Portugal", visitante: "Marruecos" },
  ]
  const grupoC = [
    { local: "Francia", visitante: "Australia" },
    { local: "Dinamarca", visitante: "Túnez" },
  ]
  const grupoD = [
    { local: "España", visitante: "Costa Rica" },
    { local: "Alemania", visitante: "Japón" },
  ]
  const grupoE = [
    { local: "Inglaterra", visitante: "Irán" },
    { local: "Estados Unidos", visitante: "Gales" },
  ]
  const grupoF = [
    { local: "Bélgica", visitante: "Croacia" },
    { local: "Suiza", visitante: "Camerún" },
  ]
  const grupoG = [
    { local: "Países Bajos", visitante: "Senegal" },
    { local: "Ecuador", visitante: "Catar" },
  ]
  const grupoH = [
    { local: "Uruguay", visitante: "Corea del Sur" },
    { local: "Colombia", visitante: "Serbia" },
  ]

  const grupos = [grupoA, grupoB, grupoC, grupoD, grupoE, grupoF, grupoG, grupoH]
  const letras = ["A", "B", "C", "D", "E", "F", "G", "H"]

  const partidosCreados = []
  let fechaBase = new Date("2026-06-11T12:00:00Z")

  for (let g = 0; g < grupos.length; g++) {
    for (let p = 0; p < grupos[g].length; p++) {
      const partido = await prisma.partido.create({
        data: {
          equipoLocal: grupos[g][p].local,
          equipoVisitante: grupos[g][p].visitante,
          fechaHora: new Date(fechaBase.getTime() + partidosCreados.length * 7200000),
          fase: "GRUPOS",
          grupo: letras[g],
          estado: "PENDIENTE",
        },
      })
      partidosCreados.push(partido)
    }
  }

  const octavos = [
    { local: "1A", visitante: "2B" },
    { local: "1C", visitante: "2D" },
    { local: "1B", visitante: "2A" },
    { local: "1D", visitante: "2C" },
    { local: "1E", visitante: "2F" },
    { local: "1G", visitante: "2H" },
    { local: "1F", visitante: "2E" },
    { local: "1H", visitante: "2G" },
  ]

  for (const octavo of octavos) {
    const partido = await prisma.partido.create({
      data: {
        equipoLocal: octavo.local,
        equipoVisitante: octavo.visitante,
        fechaHora: new Date(fechaBase.getTime() + partidosCreados.length * 7200000),
        fase: "OCTAVOS",
        estado: "PENDIENTE",
      },
    })
    partidosCreados.push(partido)
  }

  const cuartos = [
    { local: "Ganador O1", visitante: "Ganador O2" },
    { local: "Ganador O3", visitante: "Ganador O4" },
    { local: "Ganador O5", visitante: "Ganador O6" },
    { local: "Ganador O7", visitante: "Ganador O8" },
  ]

  for (const cuarto of cuartos) {
    const partido = await prisma.partido.create({
      data: {
        equipoLocal: cuarto.local,
        equipoVisitante: cuarto.visitante,
        fechaHora: new Date(fechaBase.getTime() + partidosCreados.length * 7200000),
        fase: "CUARTOS",
        estado: "PENDIENTE",
      },
    })
    partidosCreados.push(partido)
  }

  const semifinales = [
    { local: "Ganador C1", visitante: "Ganador C2" },
    { local: "Ganador C3", visitante: "Ganador C4" },
  ]

  for (const semi of semifinales) {
    const partido = await prisma.partido.create({
      data: {
        equipoLocal: semi.local,
        equipoVisitante: semi.visitante,
        fechaHora: new Date(fechaBase.getTime() + partidosCreados.length * 7200000),
        fase: "SEMIFINALES",
        estado: "PENDIENTE",
      },
    })
    partidosCreados.push(partido)
  }

  const tercerPuesto = await prisma.partido.create({
    data: {
      equipoLocal: "Perdedor S1",
      equipoVisitante: "Perdedor S2",
      fechaHora: new Date(fechaBase.getTime() + partidosCreados.length * 7200000),
      fase: "TERCER_PUESTO",
      estado: "PENDIENTE",
    },
  })
  partidosCreados.push(tercerPuesto)

  const final = await prisma.partido.create({
    data: {
      equipoLocal: "Ganador S1",
      equipoVisitante: "Ganador S2",
      fechaHora: new Date(fechaBase.getTime() + partidosCreados.length * 7200000),
      fase: "FINAL",
      estado: "PENDIENTE",
    },
  })
  partidosCreados.push(final)

  console.log(`\nTotal partidos: ${partidosCreados.length}`)

  console.log("\nCreando puntajes iniciales...")
  for (const p of participantes) {
    await prisma.puntaje.create({
      data: {
        usuarioId: p.id,
        puntosTotales: 0,
        resultadosExactos: 0,
        ganadoresAcertados: 0,
      },
    })
  }

  console.log("\nSeed completado exitosamente!")
  console.log("\nCredenciales de acceso:")
  console.log("  Admin:      usuario=admin / contraseña=Polla2026!")
  for (let i = 0; i < participantesData.length; i++) {
    console.log(`  ${participantesData[i]}: usuario=participante${i + 1} / contraseña=Polla2026!`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
