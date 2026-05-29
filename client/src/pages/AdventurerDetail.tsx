import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import * as adventurersService from "@/services/adventurers.service"
import * as adventurerSkillsService from "@/services/adventurer-skills.service"
import * as skillsService from "@/services/skills.service"
import SkillTree from "@/components/skill-tree/SkillTree"
import type {
  AdventurerDto,
  SkillDto,
  AvailableSkillsResponse,
  ApiError,
} from "@/types"

const AdventurerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [adventurer, setAdventurer] = useState<AdventurerDto | null>(null)
  const [skills, setSkills] = useState<SkillDto[]>([])
  const [catalog, setCatalog] = useState<SkillDto[]>([])
  const [available, setAvailable] =
    useState<AvailableSkillsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkillsData = async () => {
    if (!id) return

    try {
      const [skillsData, availableData] = await Promise.all([
        adventurerSkillsService.list(id),
        adventurerSkillsService.listAvailable(id),
      ])
      setSkills(skillsData)
      setAvailable(availableData)
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
        const [adventurerData, skillsData, availableData, catalogData] =
          await Promise.all([
            adventurersService.get(id),
            adventurerSkillsService.list(id),
            adventurerSkillsService.listAvailable(id),
            skillsService.list(0, 1000),
          ])
        setAdventurer(adventurerData)
        setSkills(skillsData)
        setAvailable(availableData)
        setCatalog(catalogData.content)
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

  const handleAddSkill = async (skillId: string) => {
    if (!id) return

    setError(null)
    try {
      await adventurerSkillsService.add(id, skillId)
      await fetchSkillsData()
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.status === 422) {
        setError(`Prerequis non satisfaits: ${apiError.message}`)
      } else {
        setError("Impossible d'ajouter cette competence.")
      }
    }
  }

  const handleRemoveSkill = async (
    skillId: string,
    skillName: string
  ) => {
    if (!id) return

    if (!confirm(`Etes-vous sur de vouloir retirer "${skillName}" ?`)) {
      return
    }

    setError(null)
    try {
      await adventurerSkillsService.remove(id, skillId)
      await fetchSkillsData()
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
            <CardTitle>Arbre de competences</CardTitle>
          </CardHeader>
          <CardContent>
            {available ? (
              <SkillTree
                adventurer={adventurer}
                catalog={catalog}
                acquired={skills}
                available={available}
                role={role}
                adventurerId={id ?? ""}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
              />
            ) : (
              <p className="text-muted-foreground">
                Impossible de charger l'arbre de competences.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdventurerDetail
