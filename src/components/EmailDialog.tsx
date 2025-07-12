import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { Mail, Send, X, FileText } from 'lucide-react'

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
  notes: string
  subtotal: number
  tax: number
  total: number
}

interface EmailDialogProps {
  invoice: InvoiceData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailDialog({ invoice, open, onOpenChange }: EmailDialogProps) {
  const [emailData, setEmailData] = useState({
    to: invoice.clientEmail,
    subject: `Invoice ${invoice.invoiceNumber} from ${invoice.businessName || 'Your Business'}`,
    message: `Dear ${invoice.clientName || 'Valued Client'},

Please find attached your invoice #${invoice.invoiceNumber} for the amount of $${invoice.total.toFixed(2)}.

Payment is due by ${new Date(invoice.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}.

Thank you for your business!

Best regards,
${invoice.businessName || 'Your Business'}`
  })

  const [isSending, setIsSending] = useState(false)

  const handleSendEmail = async () => {
    if (!emailData.to) {
      toast.error('Please enter a recipient email address')
      return
    }

    if (!emailData.subject.trim()) {
      toast.error('Please enter an email subject')
      return
    }

    setIsSending(true)

    try {
      // Simulate email sending (replace with actual email service)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would call your email service here
      // For example: await sendInvoiceEmail(invoice, emailData)
      
      toast.success('Invoice sent successfully!')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to send email. Please try again.')
      console.error('Email sending failed:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleInputChange = (field: keyof typeof emailData, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-600" />
            Send Invoice via Email
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Total: ${invoice.total.toFixed(2)} • Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to" className="text-sm font-medium">
                To
              </Label>
              <Input
                id="email-to"
                type="email"
                value={emailData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                placeholder="client@company.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email-subject" className="text-sm font-medium">
                Subject
              </Label>
              <Input
                id="email-subject"
                value={emailData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Invoice subject"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email-message" className="text-sm font-medium">
                Message
              </Label>
              <Textarea
                id="email-message"
                value={emailData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Your email message"
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>

          {/* Email Preview */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Preview:</h4>
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium text-gray-600">To:</span>{' '}
                  <span className="text-gray-900">{emailData.to || 'No recipient'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Subject:</span>{' '}
                  <span className="text-gray-900">{emailData.subject || 'No subject'}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="whitespace-pre-wrap text-gray-700 text-sm max-h-32 overflow-y-auto">
                    {emailData.message || 'No message content'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending || !emailData.to || !emailData.subject.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </>
              )}
            </Button>
          </div>

          {/* Note */}
          <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
            <p>
              <strong>Note:</strong> This is a demo version. In a production environment, 
              this would integrate with an email service like SendGrid, Mailgun, or similar 
              to actually send the invoice to your client.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}