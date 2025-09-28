import React from "react"

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Utils
import { cn } from "@/lib/utils"

// Types
export type SessionCardProps = {
  title: string
  description: string
  emoji: string
  onOpen?: () => void
  actionLabel?: string
  disabled?: boolean
  className?: string
  progress?: number // Progress percentage (0-100)
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  description,
  emoji,
  onOpen,
  actionLabel = "Open",
  disabled,
  className,
  progress = 0,
}) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/70 hover:border-border card-elevated transition-transform hover:-translate-y-0.5 hover-scale motion-safe:animate-enter",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-md border bg-accent p-2 text-accent-foreground motion-safe:animate-float flex items-center justify-center text-xl">
            {emoji}
          </div>
          <CardTitle className="text-lg story-link">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          variant="soft"
          size="sm"
          onClick={onOpen}
          disabled={disabled}
          aria-label={`${actionLabel} ${title}`}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
