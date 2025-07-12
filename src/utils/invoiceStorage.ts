import { InvoiceData } from '../types/invoice'

const STORAGE_KEY = 'invoice_history'

export class InvoiceStorage {
  static getAll(): InvoiceData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading invoices:', error)
      return []
    }
  }

  static save(invoice: InvoiceData): void {
    try {
      const invoices = this.getAll()
      const existingIndex = invoices.findIndex(inv => inv.id === invoice.id)
      
      if (existingIndex >= 0) {
        invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() }
      } else {
        invoices.push(invoice)
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
    } catch (error) {
      console.error('Error saving invoice:', error)
      throw new Error('Failed to save invoice')
    }
  }

  static updateStatus(invoiceId: string, status: InvoiceData['status']): void {
    try {
      const invoices = this.getAll()
      const invoice = invoices.find(inv => inv.id === invoiceId)
      
      if (invoice) {
        invoice.status = status
        invoice.updatedAt = new Date().toISOString()
        
        if (status === 'paid') {
          invoice.paidAt = new Date().toISOString()
        } else {
          invoice.paidAt = undefined
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
      }
    } catch (error) {
      console.error('Error updating invoice status:', error)
      throw new Error('Failed to update invoice status')
    }
  }

  static delete(invoiceId: string): void {
    try {
      const invoices = this.getAll()
      const filtered = invoices.filter(inv => inv.id !== invoiceId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw new Error('Failed to delete invoice')
    }
  }

  static getById(invoiceId: string): InvoiceData | null {
    const invoices = this.getAll()
    return invoices.find(inv => inv.id === invoiceId) || null
  }

  static getStats() {
    const invoices = this.getAll()
    const now = new Date()
    
    return {
      total: invoices.length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      unpaid: invoices.filter(inv => inv.status === 'unpaid').length,
      overdue: invoices.filter(inv => {
        if (inv.status === 'paid') return false
        const dueDate = new Date(inv.dueDate)
        return dueDate < now
      }).length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paidAmount: invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: invoices
        .filter(inv => inv.status !== 'paid')
        .reduce((sum, inv) => sum + inv.total, 0)
    }
  }
}