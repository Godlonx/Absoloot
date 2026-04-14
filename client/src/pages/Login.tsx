import { useState } from "react"
import { Link } from "react-router"
import AuthLayout from "@/layouts/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement login API call
    console.log("Login:", { username, password })
  }

  return (
    <AuthLayout
      title="Connexion"
      description="Entrez vos identifiants pour accéder à votre compte"
    >
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            type="text"
            placeholder="aventurier"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
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
