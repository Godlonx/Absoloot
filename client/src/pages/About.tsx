import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export function About() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">About</h1>
          <p>This is the about page.</p>
          <Button className="mt-2" asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default About
