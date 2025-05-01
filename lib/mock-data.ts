import type { TransactionType } from "./types"

// Generate a random transaction ID
function generateTransactionId(): string {
  return `TXN-${Math.floor(Date.now() / 1000)}-${Math.floor(Math.random() * 1000)}`
}

// Generate random amount between min and max
function generateAmount(min = 100, max = 10000): number {
  return Math.floor(Math.random() * (max - min + 1) + min) / 100
}

// List of sample names for sender and receiver
const names = [
  "Alice Quantum",
  "Bob Secure",
  "Charlie Crypto",
  "Diana Encode",
  "Ethan Cipher",
  "Fiona Protocol",
  "George Hash",
  "Hannah Decrypt",
  "Ian Blockchain",
  "Julia Key",
]

// Get a random name from the list
function getRandomName(): string {
  return names[Math.floor(Math.random() * names.length)]
}

// Generate a mock transaction
export function generateMockTransaction(): TransactionType {
  const sender = getRandomName()
  let receiver = getRandomName()

  // Make sure sender and receiver are different
  while (receiver === sender) {
    receiver = getRandomName()
  }

  const amount = generateAmount()
  const transactionId = generateTransactionId()

  return {
    transaction_id: transactionId,
    status: "key_generated",
    details: {
      sender,
      receiver,
      amount,
      status: "key_generated",
      timestamp: Date.now() / 1000,
      encrypted_length: Math.floor(Math.random() * 500) + 500, // Random length between 500-1000
    },
  }
}
