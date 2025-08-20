// ==============================================================================
// Enhanced User Balance API Route
// File: app/api/user/balance/route.ts
// ==============================================================================

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

// Types
interface BalanceResponse {
  balance: number
  currency: string
  lastUpdated: string
}

interface UpdateBalanceRequest {
  amount: number
  paymentMethod?: string
  transactionId?: string
  type?: 'add' | 'subtract' | 'deposit'
  reason?: string
}

interface Transaction {
  id: string
  transactionId?: string
  amount: number
  type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'refund'
  method?: string
  status: 'completed' | 'pending' | 'failed'
  reason?: string
  date: Date
}

interface UpdateBalanceResponse {
  success: boolean
  newBalance: number
  message: string
  transaction?: Transaction
}

// Helper function to validate payment method
function validatePaymentMethod(method: string): boolean {
  const validMethods = ['paypal', 'stripe', 'bank_transfer', 'crypto', 'credit_card', 'debit_card']
  return validMethods.includes(method.toLowerCase())
}

// Helper function to generate transaction ID
function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// GET: Get user balance
export async function GET(): Promise<NextResponse<BalanceResponse | { error: string }>> {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
      .select('balance currency lastBalanceUpdate')
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      balance: user.balance || 0,
      currency: user.currency || "USD",
      lastUpdated: user.lastBalanceUpdate?.toISOString() || new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Balance API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Update user balance (deposit/add/subtract)
export async function POST(
  request: NextRequest
): Promise<NextResponse<UpdateBalanceResponse | { error: string }>> {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body: UpdateBalanceRequest = await request.json()
    const { 
      amount, 
      paymentMethod, 
      transactionId, 
      type = 'add', 
      reason 
    } = body
    
    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be greater than 0" }, 
        { status: 400 }
      )
    }
    
    if (amount > 10000) {
      return NextResponse.json(
        { error: "Amount exceeds maximum limit of $10,000" }, 
        { status: 400 }
      )
    }
    
    // For deposits, require payment method and transaction ID
    if (type === 'deposit') {
      if (!paymentMethod) {
        return NextResponse.json(
          { error: "Payment method is required for deposits" }, 
          { status: 400 }
        )
      }
      
      if (!validatePaymentMethod(paymentMethod)) {
        return NextResponse.json(
          { error: "Invalid payment method" }, 
          { status: 400 }
        )
      }
      
      if (!transactionId) {
        return NextResponse.json(
          { error: "Transaction ID is required for deposits" }, 
          { status: 400 }
        )
      }
    }
    
    await connectToDatabase()
    
    // Check if transaction ID already exists (for deposits)
    if (transactionId) {
      const existingTransaction = await User.findOne({
        'transactions.transactionId': transactionId
      })
      
      if (existingTransaction) {
        return NextResponse.json(
          { error: "Transaction already processed" }, 
          { status: 400 }
        )
      }
    }
    
    // Get current user to check balance for subtractions
    const currentUser = await User.findOne({ email: session.user.email })
    
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Check sufficient balance for subtractions
    if (type === 'subtract' && currentUser.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" }, 
        { status: 400 }
      )
    }
    
    // Determine transaction type and operation
    let transactionType: Transaction['type']
    let balanceChange: number
    let message: string
    
    switch (type) {
      case 'deposit':
        transactionType = 'deposit'
        balanceChange = amount
        message = `Successfully added $${amount} to your balance via ${paymentMethod}`
        break
      case 'add':
        transactionType = 'deposit'
        balanceChange = amount
        message = `Successfully added $${amount} to your balance`
        break
      case 'subtract':
        transactionType = 'withdrawal'
        balanceChange = -amount
        message = `Successfully deducted $${amount} from your balance`
        break
      default:
        return NextResponse.json(
          { error: "Invalid transaction type" }, 
          { status: 400 }
        )
    }
    
    // Create transaction object
    const transaction: Transaction = {
      id: generateTransactionId(),
      transactionId: transactionId,
      amount: amount,
      type: transactionType,
      method: paymentMethod,
      status: 'completed',
      reason: reason || (type === 'deposit' ? 'Balance Top-up' : 'Balance Update'),
      date: new Date()
    }
    
    // Update user balance and add transaction
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $inc: { balance: balanceChange },
        $set: { lastBalanceUpdate: new Date() },
        $push: { transactions: transaction }
      },
      { new: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user balance" }, 
        { status: 500 }
      )
    }
    
    // Log the transaction for audit purposes
    console.log(`Balance ${type} for user ${session.user.email}: $${amount}, new balance: $${updatedUser.balance}`)
    
    return NextResponse.json({
      success: true,
      newBalance: updatedUser.balance,
      message,
      transaction
    })
    
  } catch (error) {
    console.error("Update Balance Error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}

// PUT: Update user currency or other balance settings
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { currency } = await request.json()
    
    if (!currency) {
      return NextResponse.json(
        { error: "Currency is required" }, 
        { status: 400 }
      )
    }
    
    const validCurrencies = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP']
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: "Invalid currency" }, 
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { currency },
      { new: true }
    ).select('currency')
    
    return NextResponse.json({
      success: true,
      currency: updatedUser.currency,
      message: `Currency updated to ${currency}`
    })
    
  } catch (error) {
    console.error("Update Currency Error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}

// DELETE: Not supported for security reasons
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Balance deletion not allowed" },
    { status: 405 }
  )
}
