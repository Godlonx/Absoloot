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
  SkillDto,
  AvailableSkillsResponse,
} from "@/types"
import {
  buildSkillGraph,
  CENTER_NODE_ID,
  type SkillMenuAction,
  type SkillTreeNode,
} from "@/lib/skill-graph"
import SkillNode from "./SkillNode"

type SkillTreeProps = {
  adventurer: AdventurerDto
  catalog: SkillDto[]
  acquired: SkillDto[]
  available: AvailableSkillsResponse
  role: UserRole | null
  adventurerId: string
  onAdd: (skillId: string) => Promise<void>
  onRemove: (skillId: string, skillName: string) => Promise<void>
}

const nodeTypes: NodeTypes = {
  center: SkillNode,
  skill: SkillNode,
}

const LEGEND = [
  { label: "Acquise", className: "bg-green-500/40 border-green-500" },
  { label: "Acquérable", className: "bg-blue-500/40 border-blue-500" },
  { label: "Bloquée", className: "bg-muted border-muted-foreground/40" },
] as const

const SkillTree = ({
  adventurer,
  catalog,
  acquired,
  available,
  role,
  onAdd,
  onRemove,
}: SkillTreeProps) => {
  const navigate = useNavigate()

  const handleMenu = useCallback(
    (action: SkillMenuAction, skill: SkillDto) => {
      if (action === "add") {
        void onAdd(skill.id)
      } else {
        void onRemove(skill.id, skill.name)
      }
    },
    [onAdd, onRemove]
  )

  const { nodes, edges } = useMemo(() => {
    const graph = buildSkillGraph(
      adventurer,
      catalog,
      acquired,
      available
    )

    if (role === "ADMIN") {
      graph.nodes = graph.nodes.map((node) => {
        if (node.data.kind !== "skill") return node
        return { ...node, data: { ...node.data, onMenu: handleMenu } }
      })
    }

    return graph
  }, [adventurer, catalog, acquired, available, role, handleMenu])

  const handleNodeClick = useCallback<NodeMouseHandler<SkillTreeNode>>(
    (_event, node) => {
      if (node.id === CENTER_NODE_ID) return
      navigate(`/skills/${node.id}`)
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

export default SkillTree
