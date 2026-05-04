import { useState } from "react"
import { Link, useNavigate } from "react-router"
import AuthLayout from "@/layouts/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import * as authService from "@/services/auth.service"

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await authService.register({ username, password })
      login(data)
      navigate("/")
    } catch (err) {
      if (err instanceof Error && err.message.includes("409")) {
        setError("Utilisateur deja existant")
      } else {
        setError("Une erreur est survenue. Veuillez reessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Creer un compte"
      description="Rejoignez la Guilde des Aventuriers"
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
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Deja un compte ?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  )
}

export default Register
