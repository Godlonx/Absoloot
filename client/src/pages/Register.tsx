import { useState } from "react"
import { Link } from "react-router"
import AuthLayout from "@/layouts/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    // TODO: Implement register API call
    console.log("Register:", { username, password })
  }

  return (
    <AuthLayout
      title="Créer un compte"
      description="Rejoignez la Guilde des Aventuriers"
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
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          />
        </div>
        <Button type="submit" className="w-full">
          S'inscrire
        </Button>
      </form>
      <div className="text-center text-sm">
        Déjà un compte ?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  )
}
