export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface InvoiceData {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  
  // Business Info
  businessName: string
  businessEmail: string
  businessAddress: string
  
  // Client Info
  clientName: string
  clientEmail: string
  clientAddress: string
  
  // Items
  items: InvoiceItem[]
  
  // Tax Settings
  taxRate: number
  
  // Notes
  notes: string
  
  // Totals
  subtotal: number
  tax: number
  total: number
  
  // Status & Tracking
  status: 'paid' | 'unpaid' | 'overdue'
  createdAt: string
  updatedAt: string
  paidAt?: string
}

export interface InvoiceFilters {
  status?: 'all' | 'paid' | 'unpaid' | 'overdue'
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}