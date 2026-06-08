import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      rol: string
      nombre: string
    } & DefaultSession["user"]
  }

  interface User {
    rol: string
    nombre: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        const usuario = await prisma.usuario.findUnique({
          where: { username },
        })

        if (!usuario) return null

        const passwordMatch = await bcrypt.compare(password, usuario.passwordHash)

        if (!passwordMatch) return null

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.username,
          rol: usuario.rol,
          nombre: usuario.nombre,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
        token.nombre = user.nombre
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.rol = token.rol as string
      session.user.nombre = token.nombre as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
})
