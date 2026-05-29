import { useState } from "react"
import { Link, useNavigate } from "react-router"
import AuthLayout from "@/layouts/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import * as authService from "@/services/auth.service"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authService.login({ username, password })
      login({ ...data, username })
      navigate("/")
    } catch (err) {
      if (err instanceof Error && err.message.includes("401")) {
        setError("Identifiants invalides")
      } else {
        setError("Une erreur est survenue. Veuillez reessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Connexion"
      description="Entrez vos identifiants pour acceder a votre compte"
    >
      <form onSubmit={handleSubmit} className="grid gap-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            type="text"
            placeholder="aventurier"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Mot de passe oublie ?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Pas encore de compte ?{" "}
        <Link to="/register" className="underline underline-offset-4">
          S'inscrire
        </Link>
      </div>
    </AuthLayout>
  )
}

export default Login
