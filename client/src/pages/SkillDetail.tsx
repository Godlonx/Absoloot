import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import * as skillsService from "@/services/skills.service"
import type { AdventurerDto, SkillDto } from "@/types"

const SkillDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [skill, setSkill] = useState<SkillDto | null>(null)
  const [owners, setOwners] = useState<AdventurerDto[]>([])
  const [eligible, setEligible] = useState<AdventurerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const [skillData, linkedData] = await Promise.all([
          skillsService.get(id),
          skillsService.getAdventurersLinked(id),
        ])
        setSkill(skillData)
        setOwners(linkedData.owners)
        setEligible(linkedData.eligible)
      } catch {
        setError("Impossible de charger les donnees de la competence.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!id || !skill) return

    if (!confirm(`Etes-vous sur de vouloir supprimer ${skill.name} ?`)) {
      return
    }

    try {
      await skillsService.remove(id)
      navigate("/skills")
    } catch {
      setError("Impossible de supprimer la competence.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (error || !skill) {
    return (
      <div className="flex min-h-svh p-6">
        <div className="flex w-full flex-col gap-6">
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error || "Competence non trouvee."}
          </div>
          <Button variant="outline" asChild>
            <Link to="/skills">Retour</Link>
          </Button>
        </div>
      </div>
    )
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

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{skill.name}</h1>
            <p className="text-sm text-muted-foreground">ID: {id}</p>
          </div>
          <div className="flex gap-2">
            {role === "ADMIN" && (
              <>
                <Button variant="outline" asChild>
                  <Link to={`/skills/${id}/edit`}>Modifier</Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              </>
            )}
            <Button variant="outline" asChild>
              <Link to="/skills">Retour</Link>
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
                <span className="font-medium">{skill.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Description</span>
                <p className="mt-1 text-sm">
                  {skill.description || "Aucune description"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerequis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Classe requise</span>
                <span className="font-medium">
                  {skill.prerequisite.classRequired || "Aucune"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niveau minimum</span>
                <span className="font-medium">
                  {skill.prerequisite.minimumLevel || "Aucun"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Caracteristique</span>
                <span className="font-medium">
                  {skill.prerequisite.attributeMin
                    ? `${attributeLabel(skill.prerequisite.attributeMin.attribute)} >= ${skill.prerequisite.attributeMin.value}`
                    : "Aucune"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Competences requises
                </span>
                {skill.prerequisite.skillsRequired &&
                skill.prerequisite.skillsRequired.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {skill.prerequisite.skillsRequired.map((req) => (
                      <Link
                        key={req.id}
                        to={`/skills/${req.id}`}
                        className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20"
                      >
                        {req.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm font-medium">Aucune</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Possesseurs</CardTitle>
            </CardHeader>
            <CardContent>
              {owners.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucun aventurier ne possede cette competence.
                </p>
              ) : (
                <div className="space-y-2">
                  {owners.map((adventurer) => (
                    <Link
                      key={adventurer.id}
                      to={`/adventurers/${adventurer.id}`}
                      className="block rounded-md border p-2 hover:bg-muted/50"
                    >
                      <span className="font-medium">{adventurer.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {adventurer.advClass} - Niv. {adventurer.level}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibles</CardTitle>
            </CardHeader>
            <CardContent>
              {eligible.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucun aventurier eligible.
                </p>
              ) : (
                <div className="space-y-2">
                  {eligible.map((adventurer) => (
                    <Link
                      key={adventurer.id}
                      to={`/adventurers/${adventurer.id}`}
                      className="block rounded-md border p-2 hover:bg-muted/50"
                    >
                      <span className="font-medium">{adventurer.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {adventurer.advClass} - Niv. {adventurer.level}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SkillDetail
