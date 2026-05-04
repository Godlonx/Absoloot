import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/contexts/AuthContext.tsx"
import GlobalLayout from "./layouts/GlobalLayout.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <BrowserRouter>
          <GlobalLayout>
            <App />
          </GlobalLayout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
