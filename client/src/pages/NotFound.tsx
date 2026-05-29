import { Button } from "@/components/ui/button"
import { Link } from "react-router"

const NotFound = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-medium">Page non trouvee</h2>
        <p className="mt-2 text-muted-foreground">
          La page que vous recherchez n'existe pas.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/">Retour a l'accueil</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
