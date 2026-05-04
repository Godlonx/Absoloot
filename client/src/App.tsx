import { Routes, Route } from "react-router"
import Home from "@/pages/Home"
import Adventurers from "@/pages/Adventurers"
import AdventurerDetail from "@/pages/AdventurerDetail"
import AdventurerForm from "@/pages/AdventurerForm"
import Competences from "@/pages/Competences"
import CompetenceDetail from "@/pages/CompetenceDetail"
import CompetenceForm from "@/pages/CompetenceForm"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import NotFound from "@/pages/NotFound"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adventurers" element={
        <ProtectedRoute>
          <Adventurers />
        </ProtectedRoute>
      } />
      <Route path="/adventurers/new" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdventurerForm />
        </ProtectedRoute>
      } />
      <Route path="/adventurers/:id" element={
        <ProtectedRoute>
          <AdventurerDetail />
        </ProtectedRoute>
      } />
      <Route path="/adventurers/:id/edit" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdventurerForm />
        </ProtectedRoute>
      } />
      <Route path="/competences" element={
        <ProtectedRoute>
          <Competences />
        </ProtectedRoute>
      } />
      <Route path="/competences/new" element={
        <ProtectedRoute requiredRole="ADMIN">
          <CompetenceForm />
        </ProtectedRoute>
      } />
      <Route path="/competences/:id" element={
        <ProtectedRoute>
          <CompetenceDetail />
        </ProtectedRoute>
      } />
      <Route path="/competences/:id/edit" element={
        <ProtectedRoute requiredRole="ADMIN">
          <CompetenceForm />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
