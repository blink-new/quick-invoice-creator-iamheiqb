import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  businessName: string
  businessEmail: string
  businessAddress: string
  clientName: string
  clientEmail: string
  clientAddress: string
  items: InvoiceItem[]
  taxRate: number
  notes: string
  subtotal: number
  tax: number
  total: number
}

interface InvoicePreviewProps {
  invoice: InvoiceData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoicePreview({ invoice, open, onOpenChange }: InvoicePreviewProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold">Invoice Preview</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Invoice Preview Content */}
        <div className="bg-white text-gray-900 p-8 rounded-lg border shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">INVOICE</h1>
              <p className="text-gray-600 text-sm">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {invoice.businessName || 'Your Business Name'}
              </h2>
              <p className="text-sm text-gray-600">{invoice.businessEmail}</p>
              <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                {invoice.businessAddress}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
              <div className="text-sm">
                <p className="font-medium">{invoice.clientName || 'Client Name'}</p>
                <p className="text-gray-600">{invoice.clientEmail}</p>
                <div className="text-gray-600 whitespace-pre-line mt-1">
                  {invoice.clientAddress}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span>{formatDate(invoice.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-800">Description</th>
                    <th className="text-center py-3 font-semibold text-gray-800 w-20">Qty</th>
                    <th className="text-right py-3 font-semibold text-gray-800 w-24">Rate</th>
                    <th className="text-right py-3 font-semibold text-gray-800 w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-800">
                        {item.description || 'Item description'}
                      </td>
                      <td className="py-3 text-sm text-center text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="py-3 text-sm text-right font-medium text-gray-800">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
              <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded">
                {invoice.notes}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}