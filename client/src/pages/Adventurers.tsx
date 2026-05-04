import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import * as adventurersService from "@/services/adventurers.service"
import type { AdventurerDto } from "@/types"

const Adventurers = () => {
  const { role } = useAuth()

  const [adventurers, setAdventurers] = useState<AdventurerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAdventurers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adventurersService.list()
      setAdventurers(data)
    } catch {
      setError("Impossible de charger la liste des aventuriers.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdventurers()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Etes-vous sur de vouloir supprimer ${name} ?`)) {
      return
    }

    try {
      await adventurersService.remove(id)
      fetchAdventurers()
    } catch {
      setError("Impossible de supprimer l'aventurier.")
    }
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Aventuriers</h1>
            <p className="text-muted-foreground">
              Liste des aventuriers de la guilde.
            </p>
          </div>
          {role === "ADMIN" && (
            <Button asChild>
              <Link to="/adventurers/new">Nouvel aventurier</Link>
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Classe</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Niveau</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm" colSpan={4}>
                    <p className="text-center text-muted-foreground">
                      Chargement...
                    </p>
                  </td>
                </tr>
              ) : adventurers.length === 0 ? (
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm" colSpan={4}>
                    <p className="text-center text-muted-foreground">
                      Aucun aventurier trouve.
                    </p>
                  </td>
                </tr>
              ) : (
                adventurers.map((adventurer) => (
                  <tr key={adventurer.id} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium">
                      {adventurer.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{adventurer.advClass}</td>
                    <td className="px-4 py-3 text-sm">{adventurer.level}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/adventurers/${adventurer.id}`}>Voir</Link>
                        </Button>
                        {role === "ADMIN" && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/adventurers/${adventurer.id}/edit`}>
                                Modifier
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDelete(adventurer.id, adventurer.name)
                              }
                            >
                              Supprimer
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Adventurers
