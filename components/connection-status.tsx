import { WifiIcon, WifiOffIcon, ZapIcon } from "lucide-react"

interface ConnectionStatusProps {
  status: "connected" | "disconnected" | "connecting" | "simulation"
  lastEvent: string | null
}

export function ConnectionStatus({ status, lastEvent }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === "connected" && (
        <>
          <div className="flex items-center gap-1 text-emerald-400">
            <WifiIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Connected to server</span>
          </div>
          {lastEvent && <span className="text-xs text-slate-400">Last event: {lastEvent}</span>}
        </>
      )}

      {status === "disconnected" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-red-400">
            <WifiOffIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Disconnected from server</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Make sure the Flask backend is running or use simulation mode</p>
        </div>
      )}

      {status === "connecting" && (
        <div className="flex items-center gap-2 text-amber-400">
          <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Connecting to server...</span>
        </div>
      )}

      {status === "simulation" && (
        <div className="flex items-center gap-1 text-purple-400">
          <ZapIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Simulation Mode Active</span>
        </div>
      )}
    </div>
  )
}
