import NavigationBar from "@/components/navigation-bar"
import * as React from "react"

type GlobalLayoutProps = {
  children: React.ReactNode
}

export default function GlobalLayout({ children } : GlobalLayoutProps) {
  return (
    <div>
      <NavigationBar />
      {children}
    </div>
  )
}