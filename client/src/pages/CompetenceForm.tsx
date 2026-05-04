import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as competencesService from "@/services/competences.service"
import type { AdvClass, Caracteristique, CompetenceDto } from "@/types"
import { ADV_CLASSES } from "@/types"

const CARACTERISTIQUES: Caracteristique[] = ["physical", "mental", "perception"]

const CompetenceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [nom, setNom] = useState("")
  const [description, setDescription] = useState("")
  const [classeRequise, setClasseRequise] = useState<AdvClass | "">("")
  const [niveauMinimum, setNiveauMinimum] = useState<number | "">("")
  const [caracteristique, setCaracteristique] = useState<Caracteristique | "">("")
  const [valeurMin, setValeurMin] = useState<number | "">("")
  const [competencesRequises, setCompetencesRequises] = useState<string[]>([])

  const [allCompetences, setAllCompetences] = useState<CompetenceDto[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true)
      setError(null)

      try {
        // Fetch all competences for the selector
        const competencesData = await competencesService.list(0, 1000)
        // Filter out the current competence if editing
        setAllCompetences(
          competencesData.content.filter((c) => c.id !== id)
        )

        // Fetch existing data if editing
        if (isEditing && id) {
          const data = await competencesService.get(id)
          setNom(data.nom)
          setDescription(data.description || "")
          setClasseRequise(data.prerequis.classeRequise || "")
          setNiveauMinimum(data.prerequis.niveauMinimum || "")
          if (data.prerequis.caracteristiqueMin) {
            setCaracteristique(data.prerequis.caracteristiqueMin.caracteristique)
            setValeurMin(data.prerequis.caracteristiqueMin.valeur)
          }
          if (data.prerequis.competencesRequises) {
            setCompetencesRequises(
              data.prerequis.competencesRequises.map((c) => c.id)
            )
          }
        }
      } catch {
        setError("Impossible de charger les donnees.")
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [id, isEditing])

  const handleCompetenceToggle = (compId: string) => {
    setCompetencesRequises((prev) =>
      prev.includes(compId)
        ? prev.filter((id) => id !== compId)
        : [...prev, compId]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const payload = {
      nom,
      description: description || undefined,
      classeRequise: classeRequise || null,
      niveauMinimum: niveauMinimum ? Number(niveauMinimum) : null,
      caracteristiqueMin:
        caracteristique && valeurMin
          ? { caracteristique, valeur: Number(valeurMin) }
          : null,
      competencesRequises:
        competencesRequises.length > 0 ? competencesRequises : undefined,
    }

    try {
      let result
      if (isEditing && id) {
        result = await competencesService.update(id, payload)
      } else {
        result = await competencesService.create(payload)
      }
      navigate(`/competences/${result.id}`)
    } catch {
      setError(
        isEditing
          ? "Impossible de modifier la competence."
          : "Impossible de creer la competence."
      )
    } finally {
      setLoading(false)
    }
  }

  const caracteristiqueLabel = (car: string) => {
    switch (car) {
      case "physical":
        return "Physique"
      case "mental":
        return "Mental"
      case "perception":
        return "Perception"
      default:
        return car
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Modifier la competence" : "Nouvelle competence"}
          </h1>
          <Button variant="outline" asChild>
            <Link to="/competences">Annuler</Link>
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    placeholder="Nom de la competence"
                    minLength={3}
                    maxLength={100}
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <textarea
                    id="description"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Description de la competence..."
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerequis (optionnels)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="classeRequise">Classe requise</Label>
                  <select
                    id="classeRequise"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={classeRequise}
                    onChange={(e) =>
                      setClasseRequise(e.target.value as AdvClass | "")
                    }
                    disabled={loading}
                  >
                    <option value="">Aucune (toutes les classes)</option>
                    {ADV_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveauMinimum">Niveau minimum</Label>
                  <Input
                    id="niveauMinimum"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Aucun"
                    value={niveauMinimum}
                    onChange={(e) =>
                      setNiveauMinimum(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="caracteristique">Caracteristique</Label>
                    <select
                      id="caracteristique"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={caracteristique}
                      onChange={(e) =>
                        setCaracteristique(
                          e.target.value as Caracteristique | ""
                        )
                      }
                      disabled={loading}
                    >
                      <option value="">Aucune</option>
                      {CARACTERISTIQUES.map((c) => (
                        <option key={c} value={c}>
                          {caracteristiqueLabel(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valeurMin">Valeur minimum</Label>
                    <Input
                      id="valeurMin"
                      type="number"
                      min={1}
                      max={50}
                      placeholder="1"
                      value={valeurMin}
                      onChange={(e) =>
                        setValeurMin(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      disabled={loading || !caracteristique}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Competences requises</Label>
                  {allCompetences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune competence disponible.
                    </p>
                  ) : (
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2">
                      {allCompetences.map((comp) => (
                        <label
                          key={comp.id}
                          className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            checked={competencesRequises.includes(comp.id)}
                            onChange={() => handleCompetenceToggle(comp.id)}
                            disabled={loading}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{comp.nom}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Enregistrement..."
                      : isEditing
                        ? "Enregistrer"
                        : "Creer"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default CompetenceForm
