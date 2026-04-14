import Logo from "@/components/navbar-components/logo"
import { Link } from "react-router"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Image */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="text-center">
            <Logo className="mx-auto size-24 text-primary/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Guilde des Aventuriers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
