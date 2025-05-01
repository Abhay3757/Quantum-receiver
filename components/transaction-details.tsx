import type { TransactionType } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { LockIcon, KeyIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon, ShieldCheckIcon, ClipboardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransactionDetailsProps {
  transaction: TransactionType
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const { details, status, transaction_id } = transaction

  return (
    <div className="space-y-4">
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Transaction Summary</CardTitle>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Transaction ID</p>
              <p className="font-mono text-sm break-all">{transaction_id}</p>
            </div>

            {details?.timestamp ? (
              <div>
                <p className="text-sm text-slate-400">Time</p>
                <p>{new Date(details.timestamp * 1000).toLocaleString()}</p>
                <p className="text-xs text-slate-400">
                  ({formatDistanceToNow(new Date(details.timestamp * 1000), { addSuffix: true })})
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-400">Time</p>
                <p className="text-slate-300">Pending...</p>
              </div>
            )}
          </div>

          <Separator className="my-4 bg-slate-600" />

          <div className="flex items-center justify-center gap-3 my-4">
            <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">From</p>
              <p className="font-medium">{details?.sender || "Pending..."}</p>
            </div>

            <ArrowRightIcon className="text-slate-400" />

            <div className="text-center px-4 py-2 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">To</p>
              <p className="font-medium">{details?.receiver || "Pending..."}</p>
            </div>
          </div>

          {details?.amount ? (
            <div className="text-center my-6">
              <p className="text-sm text-slate-400">Amount</p>
              <p className="text-3xl font-bold text-emerald-400">₹{details.amount.toFixed(2)}</p>
            </div>
          ) : (
            <div className="text-center my-6">
              <p className="text-sm text-slate-400">Amount</p>
              <p className="text-xl text-slate-300">Waiting for transaction data...</p>
            </div>
          )}
        </CardContent>
      </Card>


      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyIcon className="h-4 w-4" /> Quantum Security Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Status and Security Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <LockIcon className="h-5 w-5" />
                <span>Transaction secured with quantum key distribution</span>
              </div>
              <Badge className="bg-emerald-600 px-3 py-1">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Quantum Secured
              </Badge>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {status === "key_generated" && (
                <div className="bg-slate-800 p-3 rounded-md">
                  <p className="text-slate-400">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ClockIcon className="h-4 w-4 text-amber-400" />
                    <span>Waiting for transaction to complete</span>
                  </div>
                </div>
              )}

              {status === "completed" && (
                <div className="bg-slate-800 p-3 rounded-md">
                  <p className="text-slate-400">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                    <span>Transaction completed successfully</span>
                  </div>
                </div>
              )}

              {details?.encrypted_length ? (
                <div className="bg-slate-800 p-3 rounded-md">
                  <p className="text-slate-400">Encrypted Data Size</p>
                  <p>{details.encrypted_length} bytes</p>
                </div>
              ) : (
                <div className="bg-slate-800 p-3 rounded-md">
                  <p className="text-slate-400">Encrypted Data Size</p>
                  <p>Pending...</p>
                </div>
              )}
            </div>

            {/* BB84 Protocol Visualization */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">BB84 Protocol Flow</h3>
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="bg-blue-500/20 p-2 rounded-md">Alice (Sender)</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500/20 p-2 rounded-md">Quantum Channel</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500/20 p-2 rounded-md">Bob (Receiver)</div>
                  </div>
                </div>
                
                {/* Protocol Steps Visualization */}
                <div className="relative">
                  <div className="absolute left-1/2 h-full w-0.5 bg-slate-600 transform -translate-x-1/2"></div>
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-center justify-between">
                      <div className="w-5/12 bg-slate-700 p-2 rounded-md">
                        Random Bits Generation
                      </div>
                      <div className="w-5/12"></div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex items-center justify-between">
                      <div className="w-5/12"></div>
                      <div className="w-5/12 bg-slate-700 p-2 rounded-md">
                        Quantum Measurement
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex items-center justify-between">
                      <div className="w-5/12 bg-slate-700 p-2 rounded-md">
                        Basis Reconciliation
                      </div>
                      <div className="w-5/12 bg-slate-700 p-2 rounded-md">
                        Basis Matching
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

    
    
            {/* Security Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded-md">
                <p className="text-slate-400 text-sm">Quantum Bit Error Rate</p>
                <p className="text-emerald-400 font-mono mt-1">0.02%</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-md">
                <p className="text-slate-400 text-sm">Key Exchange Time</p>
                <p className="text-emerald-400 font-mono mt-1">142ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1">
          <CheckCircleIcon className="h-3 w-3" /> Completed
        </Badge>
      )
    case "key_generated":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
          <KeyIcon className="h-3 w-3" /> Key Generated
        </Badge>
      )
    default:
      return <Badge className="bg-slate-500 hover:bg-slate-600">{status}</Badge>
  }
}
