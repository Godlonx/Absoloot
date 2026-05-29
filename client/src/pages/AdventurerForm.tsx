import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as adventurersService from "@/services/adventurers.service"
import type { AdvClass } from "@/types"
import { ADV_CLASSES } from "@/types"

const AdventurerForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [name, setName] = useState("")
  const [advClass, setAdvClass] = useState<AdvClass | "">("")
  const [level, setLevel] = useState<number>(1)
  const [physical, setPhysical] = useState<number>(1)
  const [mental, setMental] = useState<number>(1)
  const [perception, setPerception] = useState<number>(1)
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdventurer = async () => {
      if (!id) return

      setFetching(true)
      setError(null)

      try {
        const data = await adventurersService.get(id)
        setName(data.name)
        setAdvClass(data.advClass)
        setLevel(data.level)
        setPhysical(data.physical)
        setMental(data.mental)
        setPerception(data.perception)
        setDescription(data.description || "")
      } catch {
        setError("Impossible de charger les donnees de l'aventurier.")
      } finally {
        setFetching(false)
      }
    }

    if (isEditing) {
      fetchAdventurer()
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!advClass) {
      setError("Veuillez selectionner une classe.")
      return
    }

    setLoading(true)
    setError(null)

    const payload = {
      name,
      advClass: advClass as AdvClass,
      level,
      physical,
      mental,
      perception,
      description: description || undefined,
    }

    try {
      let result
      if (isEditing && id) {
        result = await adventurersService.update(id, payload)
      } else {
        result = await adventurersService.create(payload)
      }
      navigate(`/adventurers/${result.id}`)
    } catch {
      setError(
        isEditing
          ? "Impossible de modifier l'aventurier."
          : "Impossible de creer l'aventurier."
      )
    } finally {
      setLoading(false)
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
            {isEditing ? "Modifier l'aventurier" : "Nouvel aventurier"}
          </h1>
          <Button variant="outline" asChild>
            <Link to="/adventurers">Annuler</Link>
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Nom de l'aventurier"
                  minLength={3}
                  maxLength={100}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advClass">Classe</Label>
                <select
                  id="advClass"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  value={advClass}
                  onChange={(e) => setAdvClass(e.target.value as AdvClass)}
                  disabled={loading}
                >
                  <option value="">Selectionner une classe</option>
                  {ADV_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Niveau (1-100)</Label>
                <Input
                  id="level"
                  type="number"
                  min={1}
                  max={100}
                  placeholder="1"
                  required
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="physical">Physique (1-50)</Label>
                  <Input
                    id="physical"
                    type="number"
                    min={1}
                    max={50}
                    placeholder="1"
                    required
                    value={physical}
                    onChange={(e) => setPhysical(Number(e.target.value))}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mental">Mental (1-50)</Label>
                  <Input
                    id="mental"
                    type="number"
                    min={1}
                    max={50}
                    placeholder="1"
                    required
                    value={mental}
                    onChange={(e) => setMental(Number(e.target.value))}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perception">Perception (1-50)</Label>
                  <Input
                    id="perception"
                    type="number"
                    min={1}
                    max={50}
                    placeholder="1"
                    required
                    value={perception}
                    onChange={(e) => setPerception(Number(e.target.value))}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <textarea
                  id="description"
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Description de l'aventurier..."
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdventurerForm
