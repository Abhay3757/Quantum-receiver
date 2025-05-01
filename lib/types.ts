export interface TransactionType {
  transaction_id: string
  status: string
  details?: {
    sender?: string
    receiver?: string
    amount?: number
    status?: string
    timestamp?: number
    encrypted_length?: number
  }
}
