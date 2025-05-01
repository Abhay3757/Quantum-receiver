"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ZapIcon, ServerIcon, RefreshCwIcon } from "lucide-react"

interface SimulationControlsProps {
  isSimulationMode: boolean
  onToggleMode: () => void
  onSimulate: () => void
  backendUrl: string
  onBackendUrlChange: (url: string) => void
}

export function SimulationControls({
  isSimulationMode,
  onToggleMode,
  onSimulate,
  backendUrl,
  onBackendUrlChange,
}: SimulationControlsProps) {
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [tempUrl, setTempUrl] = useState(backendUrl)

  const handleUrlSave = () => {
    onBackendUrlChange(tempUrl)
    setIsEditingUrl(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <Button
        variant={isSimulationMode ? "default" : "outline"}
        size="sm"
        onClick={onToggleMode}
        className={isSimulationMode ? "bg-purple-600 hover:bg-purple-700" : ""}
      >
        <ZapIcon className="h-4 w-4 mr-2" />
        {isSimulationMode ? "Simulation Mode" : "Live Mode"}
      </Button>

      {isSimulationMode && (
        <Button variant="outline" size="sm" onClick={onSimulate}>
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Simulate Transaction
        </Button>
      )}

      {!isSimulationMode && !isEditingUrl && (
        <Button variant="outline" size="sm" onClick={() => setIsEditingUrl(true)}>
          <ServerIcon className="h-4 w-4 mr-2" />
          Change Backend URL
        </Button>
      )}

      {!isSimulationMode && isEditingUrl && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Backend URL"
            className="h-9 w-64 text-sm"
          />
          <Button size="sm" onClick={handleUrlSave}>
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
