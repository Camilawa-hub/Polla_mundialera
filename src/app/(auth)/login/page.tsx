import { LoginForm } from "./login-form"
import { WorldCupTrophy } from "@/components/shared/world-cup-trophy"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <WorldCupTrophy size={100} className="drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Polla Mundial 2026</h1>
          <p className="text-muted-foreground mt-2">Ingresa tus credenciales para acceder</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
