import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router"
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { UserRole } from "@/types/auth"
import type {
  AdventurerDto,
  CompetenceDto,
  CompetencesDisponiblesResponse,
} from "@/types"
import {
  buildCompetenceGraph,
  CENTER_NODE_ID,
  type CompetenceMenuAction,
  type CompetenceTreeNode,
} from "@/lib/competence-graph"
import CompetenceNode from "./CompetenceNode"

type CompetenceTreeProps = {
  adventurer: AdventurerDto
  catalog: CompetenceDto[]
  acquises: CompetenceDto[]
  disponibles: CompetencesDisponiblesResponse
  role: UserRole | null
  adventurerId: string
  onAdd: (competenceId: string) => Promise<void>
  onRemove: (competenceId: string, competenceName: string) => Promise<void>
}

const nodeTypes: NodeTypes = {
  center: CompetenceNode,
  competence: CompetenceNode,
}

const LEGEND = [
  { label: "Acquise", className: "bg-green-500/40 border-green-500" },
  { label: "Acquérable", className: "bg-blue-500/40 border-blue-500" },
  { label: "Bloquée", className: "bg-muted border-muted-foreground/40" },
] as const

const CompetenceTree = ({
  adventurer,
  catalog,
  acquises,
  disponibles,
  role,
  onAdd,
  onRemove,
}: CompetenceTreeProps) => {
  const navigate = useNavigate()

  const handleMenu = useCallback(
    (action: CompetenceMenuAction, competence: CompetenceDto) => {
      if (action === "add") {
        void onAdd(competence.id)
      } else {
        void onRemove(competence.id, competence.nom)
      }
    },
    [onAdd, onRemove]
  )

  const { nodes, edges } = useMemo(() => {
    const graph = buildCompetenceGraph(
      adventurer,
      catalog,
      acquises,
      disponibles
    )

    if (role === "ADMIN") {
      graph.nodes = graph.nodes.map((node) => {
        if (node.data.kind !== "competence") return node
        return { ...node, data: { ...node.data, onMenu: handleMenu } }
      })
    }

    return graph
  }, [adventurer, catalog, acquises, disponibles, role, handleMenu])

  const handleNodeClick = useCallback<NodeMouseHandler<CompetenceTreeNode>>(
    (_event, node) => {
      if (node.id === CENTER_NODE_ID) return
      navigate(`/competences/${node.id}`)
    },
    [navigate]
  )

  return (
    <div className="relative h-[600px] w-full rounded-md border">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 rounded-md border bg-background/90 p-2 text-xs shadow-sm backdrop-blur">
        <span className="font-medium">Légende</span>
        {LEGEND.map((entry) => (
          <div key={entry.label} className="flex items-center gap-2">
            <span
              className={`inline-block size-3 rounded-sm border ${entry.className}`}
            />
            <span className="text-muted-foreground">{entry.label}</span>
          </div>
        ))}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  )
}

export default CompetenceTree
