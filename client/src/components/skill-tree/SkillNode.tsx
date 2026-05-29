import { useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Check, Lock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { SkillTreeNode } from "@/lib/skill-graph"
import { formatPrerequisites } from "./prerequisites"

type SkillNodeProps = NodeProps<SkillTreeNode>

const STATUS_STYLES = {
  acquise: "border-green-500 bg-green-500/15 text-foreground",
  acquerable: "border-blue-500 bg-blue-500/15 text-foreground",
  bloquee: "border-muted bg-muted/40 text-muted-foreground opacity-70",
} as const

const SkillNode = ({ data }: SkillNodeProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  if (data.kind === "center") {
    return (
      <div className="flex w-[220px] flex-col items-center rounded-full border-2 border-primary bg-primary/15 px-4 py-3 text-center shadow-sm">
        <Handle
          type="source"
          position={Position.Right}
          className="!opacity-0"
          isConnectable={false}
        />
        <span className="text-sm font-bold">{data.name}</span>
        <span className="text-xs text-muted-foreground">
          {data.advClass} · Niv. {data.level}
        </span>
      </div>
    )
  }

  const { skill, status, unmetPrerequisites } = data
  const prereqLines = formatPrerequisites(skill.prerequisite)

  return (
    <div className="skill-tree__node">
      <Handle
        type="target"
        position={Position.Left}
        className="!opacity-0"
        isConnectable={false}
      />
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex w-[220px] items-center gap-2 rounded-md border-2 px-3 py-2 shadow-sm transition-colors",
              STATUS_STYLES[status]
            )}
          >
            {status === "acquise" && (
              <Check className="size-4 shrink-0 text-green-600" />
            )}
            {status === "bloquee" && (
              <Lock className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="line-clamp-2 flex-1 text-sm leading-tight font-medium">
              {skill.name}
            </span>
            {data.onMenu && (
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="nodrag"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreHorizontal />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-40 p-1"
                  align="end"
                  onClick={(event) => event.stopPropagation()}
                >
                  {status === "acquerable" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={(event) => {
                        event.stopPropagation()
                        setMenuOpen(false)
                        data.onMenu?.("add", skill)
                      }}
                    >
                      Ajouter
                    </Button>
                  )}
                  {status === "acquise" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={(event) => {
                        event.stopPropagation()
                        setMenuOpen(false)
                        data.onMenu?.("remove", skill)
                      }}
                    >
                      Retirer
                    </Button>
                  )}
                  {status === "bloquee" && (
                    <p className="px-2 py-1.5 text-xs text-muted-foreground">
                      Prérequis non satisfaits
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 space-y-2"
          side="top"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-sm font-semibold">{skill.name}</p>
          {prereqLines.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Prérequis
              </p>
              {prereqLines.map((line) => (
                <p key={line} className="text-xs">
                  {line}
                </p>
              ))}
            </div>
          )}
          {status === "bloquee" && unmetPrerequisites.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-destructive">
                Prérequis manquants
              </p>
              {unmetPrerequisites.map((prereq, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  {prereq.type}: {prereq.detail}
                </p>
              ))}
            </div>
          )}
          {prereqLines.length === 0 &&
            !(status === "bloquee" && unmetPrerequisites.length > 0) && (
              <p className="text-xs text-muted-foreground">
                Aucun prérequis particulier.
              </p>
            )}
        </PopoverContent>
      </Popover>
      <Handle
        type="source"
        position={Position.Right}
        className="!opacity-0"
        isConnectable={false}
      />
    </div>
  )
}

export default SkillNode
