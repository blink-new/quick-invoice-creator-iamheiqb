import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { toast } from 'react-hot-toast'
import { Plus, X } from 'lucide-react'
import { WealthStorage } from '../../utils/wealthStorage'
import { Opportunity } from '../../types/wealth'

interface OpportunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const opportunityTypes = [
  { value: 'business', label: 'Business Venture' },
  { value: 'investment', label: 'Investment Opportunity' },
  { value: 'skill', label: 'Skill Monetization' },
  { value: 'passive_income', label: 'Passive Income' },
  { value: 'side_hustle', label: 'Side Hustle' }
]

const riskLevels = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' }
]

const statusOptions = [
  { value: 'researching', label: 'Researching' },
  { value: 'started', label: 'Started' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' }
]

export function OpportunityDialog({ open, onOpenChange, onSuccess }: OpportunityDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'side_hustle' as Opportunity['type'],
    potentialIncome: '',
    timeInvestment: '',
    riskLevel: 'medium' as Opportunity['riskLevel'],
    status: 'researching' as Opportunity['status'],
    description: '',
    pros: [''],
    cons: [''],
    nextSteps: ['']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.potentialIncome) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      WealthStorage.addOpportunity({
        title: formData.title,
        type: formData.type,
        potentialIncome: parseFloat(formData.potentialIncome),
        timeInvestment: formData.timeInvestment,
        riskLevel: formData.riskLevel,
        status: formData.status,
        description: formData.description,
        pros: formData.pros.filter(pro => pro.trim() !== ''),
        cons: formData.cons.filter(con => con.trim() !== ''),
        nextSteps: formData.nextSteps.filter(step => step.trim() !== '')
      })

      toast.success('Opportunity added successfully!')
      onSuccess()
      onOpenChange(false)
      setFormData({
        title: '',
        type: 'side_hustle',
        potentialIncome: '',
        timeInvestment: '',
        riskLevel: 'medium',
        status: 'researching',
        description: '',
        pros: [''],
        cons: [''],
        nextSteps: ['']
      })
    } catch {
      toast.error('Failed to add opportunity')
    }
  }

  const addListItem = (field: 'pros' | 'cons' | 'nextSteps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateListItem = (field: 'pros' | 'cons' | 'nextSteps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeListItem = (field: 'pros' | 'cons' | 'nextSteps', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Wealth Opportunity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Opportunity Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Start YouTube Channel, Freelance Web Design"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Opportunity['type'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opportunityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Opportunity['status'] }))}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="potentialIncome">Potential Monthly Income *</Label>
              <Input
                id="potentialIncome"
                type="number"
                value={formData.potentialIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, potentialIncome: e.target.value }))}
                placeholder="2000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="timeInvestment">Time Investment</Label>
              <Input
                id="timeInvestment"
                value={formData.timeInvestment}
                onChange={(e) => setFormData(prev => ({ ...prev, timeInvestment: e.target.value }))}
                placeholder="10 hours/week"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="riskLevel">Risk Level</Label>
            <Select value={formData.riskLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value as Opportunity['riskLevel'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((risk) => (
                  <SelectItem key={risk.value} value={risk.value}>
                    {risk.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this opportunity in detail..."
              rows={3}
            />
          </div>

          {/* Pros */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Pros</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => addListItem('pros')}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={pro}
                    onChange={(e) => updateListItem('pros', index, e.target.value)}
                    placeholder="Enter a pro..."
                  />
                  {formData.pros.length > 1 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeListItem('pros', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Cons</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => addListItem('cons')}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.cons.map((con, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={con}
                    onChange={(e) => updateListItem('cons', index, e.target.value)}
                    placeholder="Enter a con..."
                  />
                  {formData.cons.length > 1 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeListItem('cons', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Next Steps</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => addListItem('nextSteps')}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={step}
                    onChange={(e) => updateListItem('nextSteps', index, e.target.value)}
                    placeholder="Enter next step..."
                  />
                  {formData.nextSteps.length > 1 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeListItem('nextSteps', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
              Add Opportunity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}