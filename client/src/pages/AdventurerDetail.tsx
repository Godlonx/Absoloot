import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import * as adventurersService from "@/services/adventurers.service"
import * as adventurerCompetencesService from "@/services/adventurer-competences.service"
import type {
  AdventurerDto,
  CompetenceDto,
  CompetencesDisponiblesResponse,
  ApiError,
} from "@/types"

const AdventurerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [adventurer, setAdventurer] = useState<AdventurerDto | null>(null)
  const [competences, setCompetences] = useState<CompetenceDto[]>([])
  const [disponibles, setDisponibles] =
    useState<CompetencesDisponiblesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompetencesData = async () => {
    if (!id) return

    try {
      const [competencesData, disponiblesData] = await Promise.all([
        adventurerCompetencesService.list(id),
        adventurerCompetencesService.listDisponibles(id),
      ])
      setCompetences(competencesData)
      setDisponibles(disponiblesData)
    } catch {
      // Erreur silencieuse pour les donnees secondaires
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const [adventurerData, competencesData, disponiblesData] =
          await Promise.all([
            adventurersService.get(id),
            adventurerCompetencesService.list(id),
            adventurerCompetencesService.listDisponibles(id),
          ])
        setAdventurer(adventurerData)
        setCompetences(competencesData)
        setDisponibles(disponiblesData)
      } catch {
        setError("Impossible de charger les donnees de l'aventurier.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!id || !adventurer) return

    if (!confirm(`Etes-vous sur de vouloir supprimer ${adventurer.name} ?`)) {
      return
    }

    try {
      await adventurersService.remove(id)
      navigate("/adventurers")
    } catch {
      setError("Impossible de supprimer l'aventurier.")
    }
  }

  const handleAddCompetence = async (competenceId: string) => {
    if (!id) return

    setError(null)
    try {
      await adventurerCompetencesService.add(id, competenceId)
      await fetchCompetencesData()
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 422) {
        setError(`Prerequis non satisfaits: ${apiError.message}`)
      } else {
        setError("Impossible d'ajouter cette competence.")
      }
    }
  }

  const handleRemoveCompetence = async (
    competenceId: string,
    competenceName: string
  ) => {
    if (!id) return

    if (!confirm(`Etes-vous sur de vouloir retirer "${competenceName}" ?`)) {
      return
    }

    setError(null)
    try {
      await adventurerCompetencesService.remove(id, competenceId)
      await fetchCompetencesData()
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 409) {
        setError(`Impossible de retirer cette competence: ${apiError.message}`)
      } else {
        setError("Impossible de retirer cette competence.")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!adventurer) {
    return (
      <div className="flex min-h-svh p-6">
        <div className="flex w-full flex-col gap-6">
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            Aventurier non trouve.
          </div>
          <Button variant="outline" asChild>
            <Link to="/adventurers">Retour</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full flex-col gap-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{adventurer.name}</h1>
            <p className="text-sm text-muted-foreground">ID: {id}</p>
          </div>
          <div className="flex gap-2">
            {role === "ADMIN" && (
              <>
                <Button variant="outline" asChild>
                  <Link to={`/adventurers/${id}/edit`}>Modifier</Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              </>
            )}
            <Button variant="outline" asChild>
              <Link to="/adventurers">Retour</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-medium">{adventurer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Classe</span>
                <span className="font-medium">{adventurer.advClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-medium">{adventurer.level}</span>
              </div>
              {adventurer.description && (
                <div className="pt-2">
                  <span className="text-muted-foreground">Description</span>
                  <p className="mt-1 text-sm">{adventurer.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caracteristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Physique</span>
                <span className="font-medium">{adventurer.physical}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mental</span>
                <span className="font-medium">{adventurer.mental}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Perception</span>
                <span className="font-medium">{adventurer.perception}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Competences acquises</CardTitle>
          </CardHeader>
          <CardContent>
            {competences.length === 0 ? (
              <p className="text-muted-foreground">
                Aucune competence acquise.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {competences.map((competence) => (
                  <div
                    key={competence.id}
                    className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5"
                  >
                    <Link
                      to={`/competences/${competence.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {competence.nom}
                    </Link>
                    {role === "ADMIN" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-5 w-5 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          handleRemoveCompetence(competence.id, competence.nom)
                        }
                      >
                        X
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {role === "ADMIN" && disponibles && disponibles.acquerables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Competences acquerables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {disponibles.acquerables.map((competence) => (
                  <div
                    key={competence.id}
                    className="flex items-center gap-2 rounded-md border px-3 py-1.5"
                  >
                    <Link
                      to={`/competences/${competence.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {competence.nom}
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleAddCompetence(competence.id)}
                    >
                      Ajouter
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {disponibles && disponibles.bloquees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Competences bloquees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {disponibles.bloquees.map((item) => (
                  <div
                    key={item.competence.id}
                    className="rounded-md border border-muted bg-muted/30 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.competence.nom}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {item.prerequisManquants.map((prereq, index) => (
                        <p
                          key={index}
                          className="text-xs text-muted-foreground"
                        >
                          {prereq.type}: {prereq.detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdventurerDetail
