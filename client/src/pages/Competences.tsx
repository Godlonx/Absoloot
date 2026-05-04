import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import * as competencesService from "@/services/competences.service"
import type { CompetenceDto } from "@/types"

const PAGE_SIZE = 9

const Competences = () => {
  const navigate = useNavigate()
  const { role } = useAuth()

  const [competences, setCompetences] = useState<CompetenceDto[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompetences = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const data = await competencesService.list(page, PAGE_SIZE)
      setCompetences(data.content)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
    } catch {
      setError("Impossible de charger la liste des competences.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompetences(0)
  }, [])

  const handlePrevious = () => {
    if (currentPage > 0) {
      fetchCompetences(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      fetchCompetences(currentPage + 1)
    }
  }

  const handleCardClick = (id: string) => {
    navigate(`/competences/${id}`)
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full flex-col gap-6 mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Competences</h1>
            <p className="text-muted-foreground">
              Liste des competences disponibles.
            </p>
          </div>
          {role === "ADMIN" && (
            <Button asChild>
              <Link to="/competences/new">Nouvelle competence</Link>
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : competences.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Aucune competence trouvee.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competences.map((competence) => (
              <Card
                key={competence.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleCardClick(competence.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{competence.nom}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {competence.description || "Aucune description"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {competence.prerequis.classeRequise && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {competence.prerequis.classeRequise}
                      </span>
                    )}
                    {competence.prerequis.niveauMinimum && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">
                        Niv. {competence.prerequis.niveauMinimum}
                      </span>
                    )}
                    {competence.prerequis.caracteristiqueMin && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">
                        {competence.prerequis.caracteristiqueMin.caracteristique}{" "}
                        {competence.prerequis.caracteristiqueMin.valeur}+
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0 || loading}
            onClick={handlePrevious}
          >
            Precedent
          </Button>
          <span className="flex items-center px-2 text-sm text-muted-foreground">
            Page {currentPage + 1} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1 || loading}
            onClick={handleNext}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Competences
