import dagre from "@dagrejs/dagre"
import { MarkerType, Position, type Edge, type Node } from "@xyflow/react"
import type {
  AdventurerDto,
  SkillDto,
  AvailableSkillsResponse,
} from "@/types"

export const CENTER_NODE_ID = "__adventurer__"

const NODE_WIDTH = 220
const NODE_HEIGHT = 56

export type SkillStatus = "acquise" | "acquerable" | "bloquee"

export type UnmetPrerequisite = {
  type: string
  detail: string
}

export type CenterNodeData = {
  kind: "center"
  name: string
  advClass: string
  level: number
}

export type SkillMenuAction = "add" | "remove"

export type SkillNodeData = {
  kind: "skill"
  skill: SkillDto
  status: SkillStatus
  unmetPrerequisites: UnmetPrerequisite[]
  onMenu?: (action: SkillMenuAction, skill: SkillDto) => void
}

export type SkillTreeNode = Node<CenterNodeData | SkillNodeData>
export type SkillTreeEdge = Edge

type GraphLink = {
  source: string
  target: string
  fromCenter: boolean
}

const buildStatusMap = (
  catalog: SkillDto[],
  acquired: SkillDto[],
  available: AvailableSkillsResponse
): Map<string, SkillStatus> => {
  const statuses = new Map<string, SkillStatus>()

  for (const skill of catalog) {
    statuses.set(skill.id, "bloquee")
  }
  for (const item of available.locked) {
    statuses.set(item.skill.id, "bloquee")
  }
  for (const skill of available.acquirable) {
    statuses.set(skill.id, "acquerable")
  }
  for (const skill of acquired) {
    statuses.set(skill.id, "acquise")
  }

  return statuses
}

const buildMissingMap = (
  available: AvailableSkillsResponse
): Map<string, UnmetPrerequisite[]> => {
  const missing = new Map<string, UnmetPrerequisite[]>()
  for (const item of available.locked) {
    missing.set(item.skill.id, item.unmetPrerequisites)
  }
  return missing
}

const collectLinks = (
  catalog: SkillDto[],
  catalogIds: Set<string>
): GraphLink[] => {
  const links: GraphLink[] = []

  for (const skill of catalog) {
    const required = (skill.prerequisite.skillsRequired ?? []).filter(
      (ref) => catalogIds.has(ref.id)
    )

    if (required.length === 0) {
      links.push({
        source: CENTER_NODE_ID,
        target: skill.id,
        fromCenter: true,
      })
      continue
    }

    for (const ref of required) {
      links.push({ source: ref.id, target: skill.id, fromCenter: false })
    }
  }

  return links
}

const computeLayout = (
  catalog: SkillDto[],
  links: GraphLink[]
): Map<string, { x: number; y: number }> => {
  const graph = new dagre.graphlib.Graph()
  graph.setGraph({
    rankdir: "LR",
    nodesep: 28,
    ranksep: 110,
    marginx: 16,
    marginy: 16,
  })
  graph.setDefaultEdgeLabel(() => ({}))

  graph.setNode(CENTER_NODE_ID, { width: NODE_WIDTH, height: NODE_HEIGHT })
  for (const skill of catalog) {
    graph.setNode(skill.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }
  for (const link of links) {
    graph.setEdge(link.source, link.target)
  }

  dagre.layout(graph)

  const positions = new Map<string, { x: number; y: number }>()
  for (const id of graph.nodes()) {
    const node = graph.node(id)
    positions.set(id, {
      x: node.x - NODE_WIDTH / 2,
      y: node.y - NODE_HEIGHT / 2,
    })
  }

  return positions
}

export const buildSkillGraph = (
  adventurer: AdventurerDto,
  catalog: SkillDto[],
  acquired: SkillDto[],
  available: AvailableSkillsResponse
): { nodes: SkillTreeNode[]; edges: SkillTreeEdge[] } => {
  const statuses = buildStatusMap(catalog, acquired, available)
  const missing = buildMissingMap(available)
  const catalogIds = new Set(catalog.map((c) => c.id))
  const links = collectLinks(catalog, catalogIds)
  const positions = computeLayout(catalog, links)

  const nodes: SkillTreeNode[] = [
    {
      id: CENTER_NODE_ID,
      type: "center",
      position: positions.get(CENTER_NODE_ID) ?? { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        kind: "center",
        name: adventurer.name,
        advClass: adventurer.advClass,
        level: adventurer.level,
      },
    },
  ]

  for (const skill of catalog) {
    nodes.push({
      id: skill.id,
      type: "skill",
      position: positions.get(skill.id) ?? { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        kind: "skill",
        skill,
        status: statuses.get(skill.id) ?? "bloquee",
        unmetPrerequisites: missing.get(skill.id) ?? [],
      },
    })
  }

  const edges: SkillTreeEdge[] = links.map((link) => ({
    id: `${link.source}->${link.target}`,
    source: link.source,
    target: link.target,
    type: "smoothstep",
    ...(link.fromCenter
      ? { style: { stroke: "var(--border)", strokeWidth: 1.5, opacity: 0.6 } }
      : { markerEnd: { type: MarkerType.ArrowClosed } }),
  }))

  return { nodes, edges }
}
