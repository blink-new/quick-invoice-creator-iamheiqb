import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { 
  Mail, 
  Plus, 
  Trash2, 
  FileText, 
  Calendar,
  User,
  Building,
  DollarSign,
  Eye,
  Save,
  History
} from 'lucide-react'
import { InvoicePreview } from './InvoicePreview'
import { EmailDialog } from './EmailDialog'
import { InvoiceData, InvoiceItem } from '../types/invoice'
import { InvoiceStorage } from '../utils/invoiceStorage'

interface InvoiceCreatorProps {
  onViewHistory: () => void
}

export function InvoiceCreator({ onViewHistory }: InvoiceCreatorProps) {
  const [invoice, setInvoice] = useState<InvoiceData>({
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    businessName: '',
    businessEmail: '',
    businessAddress: '',
    
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    
    taxRate: 10, // Default 10% tax rate
    
    notes: '',
    
    subtotal: 0,
    tax: 0,
    total: 0,
    
    status: 'unpaid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [showPreview, setShowPreview] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax
    
    return { subtotal, tax, total }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    })
    
    const totals = calculateTotals(updatedItems, invoice.taxRate)
    
    setInvoice(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const removeItem = (id: string) => {
    if (invoice.items.length === 1) {
      toast.error('Cannot remove the last item')
      return
    }
    
    const updatedItems = invoice.items.filter(item => item.id !== id)
    const totals = calculateTotals(updatedItems, invoice.taxRate)
    
    setInvoice(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }))
  }

  const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
    const updatedInvoice = { ...invoice, [field]: value }
    
    // Recalculate totals when tax rate changes
    if (field === 'taxRate') {
      const totals = calculateTotals(updatedInvoice.items, Number(value))
      updatedInvoice.subtotal = totals.subtotal
      updatedInvoice.tax = totals.tax
      updatedInvoice.total = totals.total
    }
    
    setInvoice(updatedInvoice)
  }

  const saveInvoice = () => {
    try {
      const invoiceToSave = {
        ...invoice,
        updatedAt: new Date().toISOString()
      }
      InvoiceStorage.save(invoiceToSave)
      toast.success('Invoice saved successfully!')
    } catch {
      toast.error('Failed to save invoice')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 h-12 hover:bg-blue-50 border-blue-200"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Professional Invoice Creator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
          Create stunning invoices in minutes and send them directly to your clients via email. 
          Professional templates, real-time calculations, and seamless delivery.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time calculations
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Email delivery
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Professional templates
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Invoice Form */}
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-blue-600" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber" className="text-sm font-medium">
                    Invoice Number
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoice.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Info Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building className="h-5 w-5 text-green-600" />
                Your Business
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={invoice.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Your Company Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="businessEmail" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={invoice.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  placeholder="contact@yourcompany.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="businessAddress" className="text-sm font-medium">
                  Address
                </Label>
                <Textarea
                  id="businessAddress"
                  value={invoice.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  placeholder="Your business address"
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Info Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-purple-600" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  value={invoice.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Client or Company Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="clientEmail" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={invoice.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="client@company.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress" className="text-sm font-medium">
                  Address
                </Label>
                <Textarea
                  id="clientAddress"
                  value={invoice.clientAddress}
                  onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                  placeholder="Client address"
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items and Actions */}
        <div className="space-y-6">
          {/* Items Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  Invoice Items
                </CardTitle>
                <Button
                  onClick={addItem}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="text-xs">
                      Item {index + 1}
                    </Badge>
                    {invoice.items.length > 1 && (
                      <Button
                        onClick={() => removeItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm font-medium">Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Rate</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Amount</Label>
                        <Input
                          value={`$${item.amount.toFixed(2)}`}
                          readOnly
                          className="mt-1 bg-gray-100 dark:bg-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-3">
                {/* Tax Rate Input */}
                <div className="flex justify-between items-center">
                  <Label htmlFor="taxRate" className="text-sm font-medium">
                    Tax Rate (%)
                  </Label>
                  <div className="w-24">
                    <Input
                      id="taxRate"
                      type="number"
                      value={invoice.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      className="text-right"
                    />
                  </div>
                </div>
                
                <Separator className="opacity-50" />
                
                {/* Totals */}
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
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
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={invoice.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Payment terms, thank you note, or additional information..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="h-12 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => setShowEmailDialog(true)}
              className="h-12 bg-green-600 hover:bg-green-700"
              disabled={!invoice.clientEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button
              onClick={saveInvoice}
              variant="outline"
              className="h-12 border-orange-200 hover:bg-orange-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <InvoicePreview
        invoice={invoice}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
      
      <EmailDialog
        invoice={invoice}
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
      />
    </div>
  )
}