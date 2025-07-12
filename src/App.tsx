import React, { useState } from 'react'
import { InvoiceCreator } from './components/InvoiceCreator'
import { InvoiceHistory } from './components/InvoiceHistory'
import { ThemeProvider } from './components/ThemeProvider'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState<'create' | 'history'>('create')

  return (
    <ThemeProvider defaultTheme="light" storageKey="invoice-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {currentView === 'create' ? (
          <InvoiceCreator onViewHistory={() => setCurrentView('history')} />
        ) : (
          <InvoiceHistory onCreateNew={() => setCurrentView('create')} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App