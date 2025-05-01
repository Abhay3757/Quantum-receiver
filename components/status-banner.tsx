"use client"

import type { TransactionType } from "@/lib/types"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircleIcon } from "lucide-react"

interface StatusBannerProps {
  transactions: TransactionType[]
}

export function StatusBanner({ transactions }: StatusBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [lastCompletedTx, setLastCompletedTx] = useState<TransactionType | null>(null)

  useEffect(() => {
    // Check if there's a newly completed transaction
    const completedTx = transactions.find((tx) => tx.status === "completed" && tx.details?.amount)

    if (completedTx && (!lastCompletedTx || completedTx.transaction_id !== lastCompletedTx.transaction_id)) {
      setLastCompletedTx(completedTx)
      setShowBanner(true)

      // Hide the banner after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [transactions, lastCompletedTx])

  if (!showBanner || !lastCompletedTx) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 bg-emerald-900/90 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-4"
      >
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500 rounded-full p-2 mt-1">
            <CheckCircleIcon className="h-5 w-5 text-emerald-950" />
          </div>
          <div>
            <h3 className="font-medium">Transaction Completed</h3>
            <p className="text-sm text-emerald-200 mt-1">
              Received ₹{lastCompletedTx.details?.amount?.toFixed(2)} from {lastCompletedTx.details?.sender}
            </p>
            <p className="text-xs text-emerald-300/70 mt-2 font-mono">{lastCompletedTx.transaction_id}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
