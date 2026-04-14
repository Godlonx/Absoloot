import NavigationBar from "@/components/navigation-bar"
import * as React from "react"

type GlobalLayoutProps = {
  children: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div>
      <NavigationBar />
      {children}
    </div>
  )
}

export default GlobalLayout