import { Routes, Route } from "react-router"
import Home from "@/pages/Home"
import Adventurers from "@/pages/Adventurers"
import AdventurerDetail from "@/pages/AdventurerDetail"
import AdventurerForm from "@/pages/AdventurerForm"
import Skills from "@/pages/Skills"
import SkillDetail from "@/pages/SkillDetail"
import SkillForm from "@/pages/SkillForm"
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
      <Route path="/skills" element={
        <ProtectedRoute>
          <Skills />
        </ProtectedRoute>
      } />
      <Route path="/skills/new" element={
        <ProtectedRoute requiredRole="ADMIN">
          <SkillForm />
        </ProtectedRoute>
      } />
      <Route path="/skills/:id" element={
        <ProtectedRoute>
          <SkillDetail />
        </ProtectedRoute>
      } />
      <Route path="/skills/:id/edit" element={
        <ProtectedRoute requiredRole="ADMIN">
          <SkillForm />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
