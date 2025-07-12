import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'react-hot-toast'
import { 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  MoreHorizontal,
  Trash2
} from 'lucide-react'
import { InvoiceData, InvoiceFilters } from '../types/invoice'
import { InvoiceStorage } from '../utils/invoiceStorage'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InvoicePreview } from './InvoicePreview'

interface InvoiceHistoryProps {
  onCreateNew: () => void
}

export function InvoiceHistory({ onCreateNew }: InvoiceHistoryProps) {
  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([])
  const [filters, setFilters] = useState<InvoiceFilters>({ status: 'all' })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [invoices, filters, searchTerm])

  const loadInvoices = () => {
    const loadedInvoices = InvoiceStorage.getAll()
    
    // Update overdue status
    const now = new Date()
    const updatedInvoices = loadedInvoices.map(invoice => {
      if (invoice.status === 'unpaid' && new Date(invoice.dueDate) < now) {
        return { ...invoice, status: 'overdue' as const }
      }
      return invoice
    })
    
    setInvoices(updatedInvoices)
  }

  const applyFilters = () => {
    let filtered = [...invoices]

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status)
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.clientName.toLowerCase().includes(search) ||
        invoice.clientEmail.toLowerCase().includes(search)
      )
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredInvoices(filtered)
  }

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceData['status']) => {
    try {
      InvoiceStorage.updateStatus(invoiceId, status)
      loadInvoices()
      toast.success(`Invoice marked as ${status}`)
    } catch {
      toast.error('Failed to update invoice status')
    }
  }

  const deleteInvoice = (invoiceId: string) => {
    try {
      InvoiceStorage.delete(invoiceId)
      loadInvoices()
      toast.success('Invoice deleted successfully')
    } catch {
      toast.error('Failed to delete invoice')
    }
  }

  const stats = InvoiceStorage.getStats()

  const getStatusBadge = (status: InvoiceData['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Unpaid
        </Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (invoice: InvoiceData) => {
    return invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Invoice History
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track and manage all your invoices
          </p>
        </div>
        <Button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 h-11 px-6"
        >
          Create New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalAmount.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Paid Amount</p>
                <p className="text-3xl font-bold text-green-600">${stats.paidAmount.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Outstanding</p>
                <p className="text-3xl font-bold text-orange-600">${stats.pendingAmount.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Filter className="h-5 w-5 text-blue-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by invoice number, client name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as InvoiceFilters['status'] }))}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">
            All Invoices ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {invoices.length === 0 
                  ? 'Create your first invoice to get started!' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {invoices.length === 0 && (
                <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                  Create Your First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className={isOverdue(invoice) ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.clientName}</div>
                          <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>
                        <div className={isOverdue(invoice) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(invoice.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                setShowPreview(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Invoice
                            </DropdownMenuItem>
                            {invoice.status !== 'paid' && (
                              <DropdownMenuItem 
                                onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {invoice.status === 'paid' && (
                              <DropdownMenuItem 
                                onClick={() => updateInvoiceStatus(invoice.id, 'unpaid')}
                                className="text-yellow-600"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Mark as Unpaid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteInvoice(invoice.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      {selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      )}
    </div>
  )
}