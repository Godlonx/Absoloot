import dagre from "@dagrejs/dagre"
import { MarkerType, Position, type Edge, type Node } from "@xyflow/react"
import type {
  AdventurerDto,
  CompetenceDto,
  CompetencesDisponiblesResponse,
} from "@/types"

export const CENTER_NODE_ID = "__adventurer__"

const NODE_WIDTH = 220
const NODE_HEIGHT = 56

export type CompetenceStatus = "acquise" | "acquerable" | "bloquee"

export type PrerequisManquant = {
  type: string
  detail: string
}

export type CenterNodeData = {
  kind: "center"
  name: string
  advClass: string
  level: number
}

export type CompetenceMenuAction = "add" | "remove"

export type CompetenceNodeData = {
  kind: "competence"
  competence: CompetenceDto
  status: CompetenceStatus
  prerequisManquants: PrerequisManquant[]
  onMenu?: (action: CompetenceMenuAction, competence: CompetenceDto) => void
}

export type CompetenceTreeNode = Node<CenterNodeData | CompetenceNodeData>
export type CompetenceTreeEdge = Edge

type GraphLink = {
  source: string
  target: string
  fromCenter: boolean
}

const buildStatusMap = (
  catalog: CompetenceDto[],
  acquises: CompetenceDto[],
  disponibles: CompetencesDisponiblesResponse
): Map<string, CompetenceStatus> => {
  const statuses = new Map<string, CompetenceStatus>()

  for (const competence of catalog) {
    statuses.set(competence.id, "bloquee")
  }
  for (const item of disponibles.bloquees) {
    statuses.set(item.competence.id, "bloquee")
  }
  for (const competence of disponibles.acquerables) {
    statuses.set(competence.id, "acquerable")
  }
  for (const competence of acquises) {
    statuses.set(competence.id, "acquise")
  }

  return statuses
}

const buildMissingMap = (
  disponibles: CompetencesDisponiblesResponse
): Map<string, PrerequisManquant[]> => {
  const missing = new Map<string, PrerequisManquant[]>()
  for (const item of disponibles.bloquees) {
    missing.set(item.competence.id, item.prerequisManquants)
  }
  return missing
}

const collectLinks = (
  catalog: CompetenceDto[],
  catalogIds: Set<string>
): GraphLink[] => {
  const links: GraphLink[] = []

  for (const competence of catalog) {
    const required = (competence.prerequis.competencesRequises ?? []).filter(
      (ref) => catalogIds.has(ref.id)
    )

    if (required.length === 0) {
      links.push({
        source: CENTER_NODE_ID,
        target: competence.id,
        fromCenter: true,
      })
      continue
    }

    for (const ref of required) {
      links.push({ source: ref.id, target: competence.id, fromCenter: false })
    }
  }

  return links
}

const computeLayout = (
  catalog: CompetenceDto[],
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
  for (const competence of catalog) {
    graph.setNode(competence.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
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

export const buildCompetenceGraph = (
  adventurer: AdventurerDto,
  catalog: CompetenceDto[],
  acquises: CompetenceDto[],
  disponibles: CompetencesDisponiblesResponse
): { nodes: CompetenceTreeNode[]; edges: CompetenceTreeEdge[] } => {
  const statuses = buildStatusMap(catalog, acquises, disponibles)
  const missing = buildMissingMap(disponibles)
  const catalogIds = new Set(catalog.map((c) => c.id))
  const links = collectLinks(catalog, catalogIds)
  const positions = computeLayout(catalog, links)

  const nodes: CompetenceTreeNode[] = [
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

  for (const competence of catalog) {
    nodes.push({
      id: competence.id,
      type: "competence",
      position: positions.get(competence.id) ?? { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        kind: "competence",
        competence,
        status: statuses.get(competence.id) ?? "bloquee",
        prerequisManquants: missing.get(competence.id) ?? [],
      },
    })
  }

  const edges: CompetenceTreeEdge[] = links.map((link) => ({
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
