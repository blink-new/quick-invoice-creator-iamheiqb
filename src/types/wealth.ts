export interface IncomeStream {
  id: string
  name: string
  type: 'job' | 'freelance' | 'business' | 'passive' | 'investment' | 'other'
  monthlyAmount: number
  description: string
  status: 'active' | 'pending' | 'stopped'
  startDate: string
  familyMember: string
  color: string
}

export interface Investment {
  id: string
  name: string
  type: 'stocks' | 'crypto' | 'real_estate' | 'bonds' | 'index_funds' | 'other'
  currentValue: number
  initialInvestment: number
  monthlyContribution: number
  performancePercent: number
  lastUpdated: string
  platform: string
}

export interface WealthGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  priority: 'high' | 'medium' | 'low'
  category: 'emergency_fund' | 'house' | 'retirement' | 'education' | 'vacation' | 'other'
  description: string
}

export interface Opportunity {
  id: string
  title: string
  type: 'business' | 'investment' | 'skill' | 'passive_income' | 'side_hustle'
  potentialIncome: number
  timeInvestment: string
  riskLevel: 'low' | 'medium' | 'high'
  status: 'researching' | 'started' | 'completed' | 'abandoned'
  description: string
  pros: string[]
  cons: string[]
  nextSteps: string[]
}

export interface FamilyMember {
  id: string
  name: string
  role: string
  age: number
  skills: string[]
  avatar: string
}

export interface WealthData {
  incomeStreams: IncomeStream[]
  investments: Investment[]
  goals: WealthGoal[]
  opportunities: Opportunity[]
  familyMembers: FamilyMember[]
}