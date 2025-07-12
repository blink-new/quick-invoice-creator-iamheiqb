import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { WealthStorage } from '../../utils/wealthStorage'
import { Investment } from '../../types/wealth'

interface InvestmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const investmentTypes = [
  { value: 'stocks', label: 'Individual Stocks' },
  { value: 'index_funds', label: 'Index Funds' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'other', label: 'Other' }
]

export function InvestmentDialog({ open, onOpenChange, onSuccess }: InvestmentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as Investment['type'],
    currentValue: '',
    initialInvestment: '',
    monthlyContribution: '',
    performancePercent: '',
    platform: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.currentValue || !formData.initialInvestment) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      WealthStorage.addInvestment({
        name: formData.name,
        type: formData.type,
        currentValue: parseFloat(formData.currentValue),
        initialInvestment: parseFloat(formData.initialInvestment),
        monthlyContribution: parseFloat(formData.monthlyContribution) || 0,
        performancePercent: parseFloat(formData.performancePercent) || 0,
        lastUpdated: new Date().toISOString(),
        platform: formData.platform
      })

      toast.success('Investment added successfully!')
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: '',
        type: 'stocks',
        currentValue: '',
        initialInvestment: '',
        monthlyContribution: '',
        performancePercent: '',
        platform: ''
      })
    } catch {
      toast.error('Failed to add investment')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Investment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Investment Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Apple Stock, S&P 500 ETF"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Investment['type'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="initialInvestment">Initial Investment *</Label>
              <Input
                id="initialInvestment"
                type="number"
                value={formData.initialInvestment}
                onChange={(e) => setFormData(prev => ({ ...prev, initialInvestment: e.target.value }))}
                placeholder="10000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="currentValue">Current Value *</Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                placeholder="12000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={formData.monthlyContribution}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyContribution: e.target.value }))}
                placeholder="500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="performancePercent">Performance %</Label>
              <Input
                id="performancePercent"
                type="number"
                value={formData.performancePercent}
                onChange={(e) => setFormData(prev => ({ ...prev, performancePercent: e.target.value }))}
                placeholder="15.5"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="platform">Platform/Broker</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="e.g., Robinhood, Fidelity, E*TRADE"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Investment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}