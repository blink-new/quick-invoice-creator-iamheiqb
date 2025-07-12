import { WealthData, IncomeStream, Investment, WealthGoal, Opportunity, FamilyMember } from '../types/wealth'

class WealthStorageClass {
  private readonly STORAGE_KEY = 'family-wealth-data'

  private getDefaultData(): WealthData {
    return {
      incomeStreams: [],
      investments: [],
      goals: [],
      opportunities: [],
      familyMembers: [
        {
          id: '1',
          name: 'You',
          role: 'Primary',
          age: 30,
          skills: ['Leadership', 'Strategy'],
          avatar: '👨‍💼'
        }
      ]
    }
  }

  getData(): WealthData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      return this.getDefaultData()
    } catch {
      return this.getDefaultData()
    }
  }

  saveData(data: WealthData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save wealth data:', error)
    }
  }

  addIncomeStream(stream: Omit<IncomeStream, 'id'>): void {
    const data = this.getData()
    const newStream: IncomeStream = {
      ...stream,
      id: `income-${Date.now()}`
    }
    data.incomeStreams.push(newStream)
    this.saveData(data)
  }

  addInvestment(investment: Omit<Investment, 'id'>): void {
    const data = this.getData()
    const newInvestment: Investment = {
      ...investment,
      id: `investment-${Date.now()}`
    }
    data.investments.push(newInvestment)
    this.saveData(data)
  }

  addGoal(goal: Omit<WealthGoal, 'id'>): void {
    const data = this.getData()
    const newGoal: WealthGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    }
    data.goals.push(newGoal)
    this.saveData(data)
  }

  addOpportunity(opportunity: Omit<Opportunity, 'id'>): void {
    const data = this.getData()
    const newOpportunity: Opportunity = {
      ...opportunity,
      id: `opportunity-${Date.now()}`
    }
    data.opportunities.push(newOpportunity)
    this.saveData(data)
  }

  addFamilyMember(member: Omit<FamilyMember, 'id'>): void {
    const data = this.getData()
    const newMember: FamilyMember = {
      ...member,
      id: `member-${Date.now()}`
    }
    data.familyMembers.push(newMember)
    this.saveData(data)
  }

  updateIncomeStream(id: string, updates: Partial<IncomeStream>): void {
    const data = this.getData()
    const index = data.incomeStreams.findIndex(stream => stream.id === id)
    if (index !== -1) {
      data.incomeStreams[index] = { ...data.incomeStreams[index], ...updates }
      this.saveData(data)
    }
  }

  updateInvestment(id: string, updates: Partial<Investment>): void {
    const data = this.getData()
    const index = data.investments.findIndex(inv => inv.id === id)
    if (index !== -1) {
      data.investments[index] = { ...data.investments[index], ...updates }
      this.saveData(data)
    }
  }

  updateGoal(id: string, updates: Partial<WealthGoal>): void {
    const data = this.getData()
    const index = data.goals.findIndex(goal => goal.id === id)
    if (index !== -1) {
      data.goals[index] = { ...data.goals[index], ...updates }
      this.saveData(data)
    }
  }

  updateOpportunity(id: string, updates: Partial<Opportunity>): void {
    const data = this.getData()
    const index = data.opportunities.findIndex(opp => opp.id === id)
    if (index !== -1) {
      data.opportunities[index] = { ...data.opportunities[index], ...updates }
      this.saveData(data)
    }
  }

  deleteIncomeStream(id: string): void {
    const data = this.getData()
    data.incomeStreams = data.incomeStreams.filter(stream => stream.id !== id)
    this.saveData(data)
  }

  deleteInvestment(id: string): void {
    const data = this.getData()
    data.investments = data.investments.filter(inv => inv.id !== id)
    this.saveData(data)
  }

  deleteGoal(id: string): void {
    const data = this.getData()
    data.goals = data.goals.filter(goal => goal.id !== id)
    this.saveData(data)
  }

  deleteOpportunity(id: string): void {
    const data = this.getData()
    data.opportunities = data.opportunities.filter(opp => opp.id !== id)
    this.saveData(data)
  }

  getWealthStats() {
    const data = this.getData()
    
    const totalMonthlyIncome = data.incomeStreams
      .filter(stream => stream.status === 'active')
      .reduce((sum, stream) => sum + stream.monthlyAmount, 0)

    const totalInvestmentValue = data.investments
      .reduce((sum, inv) => sum + inv.currentValue, 0)

    const totalGoalProgress = data.goals.length > 0 
      ? data.goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / data.goals.length
      : 0

    const totalActiveOpportunities = data.opportunities
      .filter(opp => opp.status === 'started' || opp.status === 'researching').length

    return {
      totalMonthlyIncome,
      totalInvestmentValue,
      totalGoalProgress: Math.min(totalGoalProgress * 100, 100),
      totalActiveOpportunities,
      annualIncome: totalMonthlyIncome * 12
    }
  }
}

export const WealthStorage = new WealthStorageClass()