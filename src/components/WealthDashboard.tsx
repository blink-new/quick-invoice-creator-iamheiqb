import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Plus,
  Users,
  BarChart3,
  Star,
  Clock
} from 'lucide-react'
import { WealthStorage } from '../utils/wealthStorage'
import { WealthData } from '../types/wealth'
import { IncomeStreamDialog } from './dialogs/IncomeStreamDialog'
import { InvestmentDialog } from './dialogs/InvestmentDialog'
import { GoalDialog } from './dialogs/GoalDialog'
import { OpportunityDialog } from './dialogs/OpportunityDialog'

export function WealthDashboard() {
  const [wealthData, setWealthData] = useState<WealthData>(WealthStorage.getData())
  const [activeTab, setActiveTab] = useState('overview')
  const [showIncomeDialog, setShowIncomeDialog] = useState(false)
  const [showInvestmentDialog, setShowInvestmentDialog] = useState(false)
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [showOpportunityDialog, setShowOpportunityDialog] = useState(false)

  const stats = WealthStorage.getWealthStats()

  const refreshData = () => {
    setWealthData(WealthStorage.getData())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': case 'researching': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'started': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'stopped': case 'abandoned': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Family Wealth Builder
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Track income streams, manage investments, set goals, and discover opportunities to build generational wealth
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Monthly Income</p>
                  <p className="text-3xl font-bold">${stats.totalMonthlyIncome.toLocaleString()}</p>
                  <p className="text-green-100 text-xs">${stats.annualIncome.toLocaleString()}/year</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Investments</p>
                  <p className="text-3xl font-bold">${stats.totalInvestmentValue.toLocaleString()}</p>
                  <p className="text-blue-100 text-xs">{wealthData.investments.length} positions</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Goal Progress</p>
                  <p className="text-3xl font-bold">{stats.totalGoalProgress.toFixed(0)}%</p>
                  <p className="text-purple-100 text-xs">{wealthData.goals.length} active goals</p>
                </div>
                <Target className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Opportunities</p>
                  <p className="text-3xl font-bold">{stats.totalActiveOpportunities}</p>
                  <p className="text-orange-100 text-xs">Active pursuits</p>
                </div>
                <Lightbulb className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="investments" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Investments
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Opportunities
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Family Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wealthData.familyMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-2xl">{member.avatar}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{member.role} • Age {member.age}</p>
                          <div className="flex gap-1 mt-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setShowIncomeDialog(true)}
                      className="h-16 flex-col gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">Add Income</span>
                    </Button>
                    <Button 
                      onClick={() => setShowInvestmentDialog(true)}
                      className="h-16 flex-col gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">Add Investment</span>
                    </Button>
                    <Button 
                      onClick={() => setShowGoalDialog(true)}
                      className="h-16 flex-col gap-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">Set Goal</span>
                    </Button>
                    <Button 
                      onClick={() => setShowOpportunityDialog(true)}
                      className="h-16 flex-col gap-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">Add Opportunity</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Income Tab */}
          <TabsContent value="income" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Income Streams</h2>
              <Button onClick={() => setShowIncomeDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Income Stream
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {wealthData.incomeStreams.map((stream) => (
                <Card key={stream.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stream.color }}
                        />
                        <div>
                          <h4 className="font-semibold">{stream.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{stream.familyMember}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(stream.status)}>
                        {stream.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Income</span>
                        <span className="font-bold text-green-600">${stream.monthlyAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                        <Badge variant="outline" className="capitalize">{stream.type.replace('_', ' ')}</Badge>
                      </div>
                      
                      {stream.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {stream.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Investment Portfolio</h2>
              <Button onClick={() => setShowInvestmentDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Investment
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {wealthData.investments.map((investment) => (
                <Card key={investment.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{investment.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{investment.platform}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {investment.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Current Value</span>
                        <span className="font-bold">${investment.currentValue.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Performance</span>
                        <span className={`font-bold ${investment.performancePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.performancePercent >= 0 ? '+' : ''}{investment.performancePercent.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Contribution</span>
                        <span className="text-sm font-medium">${investment.monthlyContribution}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Wealth Goals</h2>
              <Button onClick={() => setShowGoalDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {wealthData.goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <Card key={goal.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{goal.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                            {goal.category.replace('_', ' ')} • {goal.priority} priority
                          </p>
                        </div>
                        <Badge variant="outline" className={
                          goal.priority === 'high' ? 'border-red-200 text-red-700' :
                          goal.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                          'border-green-200 text-green-700'
                        }>
                          {goal.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Current / Target</span>
                          <span className="font-bold">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Target Date</span>
                          <span className="text-sm">{new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                        
                        {goal.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Wealth Opportunities</h2>
              <Button onClick={() => setShowOpportunityDialog(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {wealthData.opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                          {opportunity.type.replace('_', ' ')} • {opportunity.timeInvestment}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                        <Badge className={getRiskColor(opportunity.riskLevel)}>
                          {opportunity.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Potential Income</span>
                        <span className="font-bold text-green-600">
                          ${opportunity.potentialIncome.toLocaleString()}/mo
                        </span>
                      </div>
                      
                      {opportunity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {opportunity.description}
                        </p>
                      )}
                      
                      {opportunity.nextSteps.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Next Steps:</h5>
                          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                            {opportunity.nextSteps.slice(0, 3).map((step, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <IncomeStreamDialog 
          open={showIncomeDialog} 
          onOpenChange={setShowIncomeDialog}
          onSuccess={refreshData}
        />
        <InvestmentDialog 
          open={showInvestmentDialog} 
          onOpenChange={setShowInvestmentDialog}
          onSuccess={refreshData}
        />
        <GoalDialog 
          open={showGoalDialog} 
          onOpenChange={setShowGoalDialog}
          onSuccess={refreshData}
        />
        <OpportunityDialog 
          open={showOpportunityDialog} 
          onOpenChange={setShowOpportunityDialog}
          onSuccess={refreshData}
        />
      </div>
    </div>
  )
}