import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as skillsService from "@/services/skills.service"
import type { AdvClass, Attribute, SkillDto } from "@/types"
import { ADV_CLASSES } from "@/types"

const ATTRIBUTES: Attribute[] = ["physical", "mental", "perception"]

const SkillForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [classRequired, setClassRequired] = useState<AdvClass | "">("")
  const [minimumLevel, setMinimumLevel] = useState<number | "">("")
  const [attribute, setAttribute] = useState<Attribute | "">("")
  const [valueMin, setValueMin] = useState<number | "">("")
  const [skillsRequired, setSkillsRequired] = useState<string[]>([])

  const [allSkills, setAllSkills] = useState<SkillDto[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true)
      setError(null)

      try {
        // Fetch all skills for the selector
        const skillsData = await skillsService.list(0, 1000)
        // Filter out the current skill if editing
        setAllSkills(
          skillsData.content.filter((c) => c.id !== id)
        )

        // Fetch existing data if editing
        if (isEditing && id) {
          const data = await skillsService.get(id)
          setName(data.name)
          setDescription(data.description || "")
          setClassRequired(data.prerequisite.classRequired || "")
          setMinimumLevel(data.prerequisite.minimumLevel || "")
          if (data.prerequisite.attributeMin) {
            setAttribute(data.prerequisite.attributeMin.attribute)
            setValueMin(data.prerequisite.attributeMin.value)
          }
          if (data.prerequisite.skillsRequired) {
            setSkillsRequired(
              data.prerequisite.skillsRequired.map((c) => c.id)
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

  const handleSkillToggle = (skillId: string) => {
    setSkillsRequired((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const payload = {
      name,
      description: description || undefined,
      classRequired: classRequired || null,
      minimumLevel: minimumLevel ? Number(minimumLevel) : null,
      attributeMin:
        attribute && valueMin
          ? { attribute, value: Number(valueMin) }
          : null,
      skillsRequired:
        skillsRequired.length > 0 ? skillsRequired : undefined,
    }

    try {
      let result
      if (isEditing && id) {
        result = await skillsService.update(id, payload)
      } else {
        result = await skillsService.create(payload)
      }
      navigate(`/skills/${result.id}`)
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

  const attributeLabel = (attr: string) => {
    switch (attr) {
      case "physical":
        return "Physique"
      case "mental":
        return "Mental"
      case "perception":
        return "Perception"
      default:
        return attr
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
            <Link to="/skills">Annuler</Link>
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
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    placeholder="Nom de la competence"
                    minLength={3}
                    maxLength={100}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <Label htmlFor="classRequired">Classe requise</Label>
                  <select
                    id="classRequired"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={classRequired}
                    onChange={(e) =>
                      setClassRequired(e.target.value as AdvClass | "")
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
                  <Label htmlFor="minimumLevel">Niveau minimum</Label>
                  <Input
                    id="minimumLevel"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Aucun"
                    value={minimumLevel}
                    onChange={(e) =>
                      setMinimumLevel(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="attribute">Caracteristique</Label>
                    <select
                      id="attribute"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={attribute}
                      onChange={(e) =>
                        setAttribute(
                          e.target.value as Attribute | ""
                        )
                      }
                      disabled={loading}
                    >
                      <option value="">Aucune</option>
                      {ATTRIBUTES.map((c) => (
                        <option key={c} value={c}>
                          {attributeLabel(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valueMin">Valeur minimum</Label>
                    <Input
                      id="valueMin"
                      type="number"
                      min={1}
                      max={50}
                      placeholder="1"
                      value={valueMin}
                      onChange={(e) =>
                        setValueMin(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      disabled={loading || !attribute}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Competences requises</Label>
                  {allSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune competence disponible.
                    </p>
                  ) : (
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2">
                      {allSkills.map((req) => (
                        <label
                          key={req.id}
                          className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            checked={skillsRequired.includes(req.id)}
                            onChange={() => handleSkillToggle(req.id)}
                            disabled={loading}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{req.name}</span>
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

export default SkillForm
