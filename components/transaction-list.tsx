"use client"

import type { TransactionType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface TransactionListProps {
  transactions: TransactionType[]
  onSelect: (id: string) => void
  selectedId: string | null
}

export function TransactionList({ transactions, onSelect, selectedId }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No transactions received yet</p>
        <p className="text-sm mt-2">Waiting for incoming transactions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {transactions.map((tx) => (
        <div
          key={tx.transaction_id}
          className={`p-3 rounded-md cursor-pointer transition-all ${
            selectedId === tx.transaction_id
              ? "bg-emerald-900/30 border border-emerald-500/50"
              : "bg-slate-700/50 hover:bg-slate-700 border border-transparent"
          }`}
          onClick={() => onSelect(tx.transaction_id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-mono text-sm text-slate-300 truncate">{tx.transaction_id}</div>
            <StatusBadge status={tx.status} />
          </div>

          <div className="text-sm">
            {tx.details?.receiver ? (
              <div className="mb-1">
                To: <span className="font-medium">{tx.details.receiver}</span>
              </div>
            ) : (
              <div className="mb-1 text-slate-400">Recipient information pending...</div>
            )}

            {tx.details?.amount ? (
              <div className="text-emerald-400 font-bold">₹{tx.details.amount.toFixed(2)}</div>
            ) : (
              <div className="text-slate-400">Amount pending...</div>
            )}
          </div>

          {tx.details?.timestamp ? (
            <div className="text-xs text-slate-400 mt-2">
              {formatDistanceToNow(new Date(tx.details.timestamp * 1000), { addSuffix: true })}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-2">Time pending...</div>
          )}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">Completed</Badge>
    case "key_generated":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Key Generated</Badge>
    default:
      return <Badge className="bg-slate-500 hover:bg-slate-600">{status}</Badge>
  }
}
