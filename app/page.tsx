"use client"

import { useState, useEffect } from "react"
import { TransactionList } from "@/components/transaction-list"
import { TransactionDetails } from "@/components/transaction-details"
import { StatusBanner } from "@/components/status-banner"
import { ConnectionStatus } from "@/components/connection-status"
import { SimulationControls } from "@/components/simulation-controls"
import type { TransactionType } from "@/lib/types"
import { generateMockTransaction } from "@/lib/mock-data"

// Polyfill for AbortSignal.timeout if not available
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function timeout(ms: number) {
    const controller = new AbortController()
    setTimeout(() => controller.abort(new DOMException("TimeoutError", "TimeoutError")), ms)
    return controller.signal
  }
}

export default function ReceiverDashboard() {
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")
  const [lastEvent, setLastEvent] = useState<string | null>(null)
  const [isSimulationMode, setIsSimulationMode] = useState(false)
  const [backendUrl, setBackendUrl] = useState("http://localhost:5000")

  useEffect(() => {
    // Connect to the SSE endpoint
    let eventSource: EventSource | null = null
    let connectionAttempts = 0
    const maxAttempts = 3

    const connectSSE = () => {
      if (connectionAttempts >= maxAttempts) {
        console.log("Max connection attempts reached, switching to simulation mode")
        setConnectionStatus("disconnected")
        setIsSimulationMode(true)
        return
      }

      setConnectionStatus("connecting")
      connectionAttempts++

      try {
        eventSource = new EventSource(`${backendUrl}/api/events`)

        eventSource.onopen = () => {
          setConnectionStatus("connected")
          connectionAttempts = 0 // Reset attempts on successful connection
        }

        eventSource.onerror = (error) => {
          console.error("SSE connection error:", error)
          setConnectionStatus("disconnected")

          // Close the current connection
          if (eventSource) {
            eventSource.close()
            eventSource = null
          }

          // Try to reconnect after a delay with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000)
          setTimeout(connectSSE, delay)
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            setLastEvent(data.event)

            if (data.event === "connected" || data.event === "keep-alive") {
              setConnectionStatus("connected")
              return
            }

            if (data.event === "transaction_created") {
              // Add the transaction with minimal info first
              setTransactions((prev) => {
                const exists = prev.some((tx) => tx.transaction_id === data.transaction_id)
                if (exists) {
                  return prev.map((tx) =>
                    tx.transaction_id === data.transaction_id ? { ...tx, status: data.status } : tx,
                  )
                } else {
                  return [
                    ...prev,
                    {
                      transaction_id: data.transaction_id,
                      status: data.status,
                      details: {
                        // Add minimal details until we can fetch more
                        status: data.status,
                      },
                    },
                  ]
                }
              })

              // Then try to fetch more details
              fetchTransactionDetails(data.transaction_id)
            }

            if (data.event === "transaction_updated") {
              setTransactions((prev) =>
                prev.map((tx) =>
                  tx.transaction_id === data.transaction_id
                    ? {
                        ...tx,
                        status: data.status,
                        details: {
                          ...tx.details,
                          amount: data.amount,
                          status: data.status,
                        },
                      }
                    : tx,
                ),
              )

              // Refresh details after update
              fetchTransactionDetails(data.transaction_id)
            }
          } catch (error) {
            console.error("Error parsing SSE data:", error)
          }
        }
      } catch (error) {
        console.error("Error setting up SSE connection:", error)
        setConnectionStatus("disconnected")

        // Try to reconnect after a delay with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000)
        setTimeout(connectSSE, delay)
      }
    }

    const fetchTransactionDetails = async (transactionId: string) => {
      try {
        const response = await fetch(`${backendUrl}/api/transaction_status/${transactionId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          // Add a timeout to prevent hanging requests
          signal: AbortSignal.timeout(5000),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const txData = await response.json()

        setTransactions((prev) =>
          prev.map((tx) =>
            tx.transaction_id === transactionId
              ? {
                  ...tx,
                  details: txData.details,
                }
              : tx,
          ),
        )
      } catch (error) {
        console.error(`Error fetching transaction details for ${transactionId}:`, error)
        // Don't update state on error, keep existing data
      }
    }

    // Only try to connect if not in simulation mode
    if (!isSimulationMode) {
      connectSSE()
    }

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
    }
  }, [isSimulationMode, backendUrl])

  const handleTransactionSelect = (id: string) => {
    setSelectedTransaction(id)
  }

  const handleSimulateTransaction = () => {
    const newTransaction = generateMockTransaction()
    setTransactions((prev) => [...prev, newTransaction])

    // Auto-select the new transaction
    setSelectedTransaction(newTransaction.transaction_id)

    // Simulate transaction completion after a delay
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.transaction_id === newTransaction.transaction_id
            ? {
                ...tx,
                status: "completed",
                details: {
                  ...tx.details,
                  status: "completed",
                  timestamp: Date.now() / 1000,
                },
              }
            : tx,
        ),
      )
    }, 3000)
  }

  const toggleSimulationMode = () => {
    setIsSimulationMode((prev) => !prev)
  }

  const handleBackendUrlChange = (url: string) => {
    setBackendUrl(url)
  }

  const selectedTx = transactions.find((tx) => tx.transaction_id === selectedTransaction)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Quantum UPI Receiver Dashboard</h1>
          <p className="text-slate-300">Secure transactions with quantum key distribution</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
            <ConnectionStatus status={isSimulationMode ? "simulation" : connectionStatus} lastEvent={lastEvent} />
            <SimulationControls
              isSimulationMode={isSimulationMode}
              onToggleMode={toggleSimulationMode}
              onSimulate={handleSimulateTransaction}
              backendUrl={backendUrl}
              onBackendUrlChange={handleBackendUrlChange}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-slate-800 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Incoming Transactions</h2>
            <TransactionList
              transactions={transactions}
              onSelect={handleTransactionSelect}
              selectedId={selectedTransaction}
            />
          </div>

          <div className="lg:col-span-2 bg-slate-800 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            {selectedTx ? (
              <TransactionDetails transaction={selectedTx} />
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p>Select a transaction to view details</p>
                {transactions.length === 0 && isSimulationMode && (
                  <button
                    onClick={handleSimulateTransaction}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white font-medium transition-colors"
                  >
                    Simulate a Transaction
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <StatusBanner transactions={transactions} />
      </div>
    </main>
  )
}
