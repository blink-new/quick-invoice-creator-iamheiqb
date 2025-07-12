import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { WealthStorage } from '../../utils/wealthStorage'
import { IncomeStream } from '../../types/wealth'

interface IncomeStreamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const incomeTypes = [
  { value: 'job', label: 'Full-time Job' },
  { value: 'freelance', label: 'Freelancing' },
  { value: 'business', label: 'Business' },
  { value: 'passive', label: 'Passive Income' },
  { value: 'investment', label: 'Investment Returns' },
  { value: 'other', label: 'Other' }
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'stopped', label: 'Stopped' }
]

const colors = [
  '#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'
]

export function IncomeStreamDialog({ open, onOpenChange, onSuccess }: IncomeStreamDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'job' as IncomeStream['type'],
    monthlyAmount: '',
    description: '',
    status: 'active' as IncomeStream['status'],
    startDate: new Date().toISOString().split('T')[0],
    familyMember: 'You',
    color: colors[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.monthlyAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      WealthStorage.addIncomeStream({
        name: formData.name,
        type: formData.type,
        monthlyAmount: parseFloat(formData.monthlyAmount),
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate,
        familyMember: formData.familyMember,
        color: formData.color
      })

      toast.success('Income stream added successfully!')
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: '',
        type: 'job',
        monthlyAmount: '',
        description: '',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        familyMember: 'You',
        color: colors[0]
      })
    } catch {
      toast.error('Failed to add income stream')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Income Stream</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Software Engineer Job"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as IncomeStream['type'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {incomeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="monthlyAmount">Monthly Amount *</Label>
            <Input
              id="monthlyAmount"
              type="number"
              value={formData.monthlyAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyAmount: e.target.value }))}
              placeholder="5000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="familyMember">Family Member</Label>
            <Input
              id="familyMember"
              value={formData.familyMember}
              onChange={(e) => setFormData(prev => ({ ...prev, familyMember: e.target.value }))}
              placeholder="You"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as IncomeStream['status'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2 mt-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-800' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Add Income Stream
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}