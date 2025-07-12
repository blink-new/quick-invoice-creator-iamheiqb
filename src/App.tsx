import React from 'react'
import { InvoiceCreator } from './components/InvoiceCreator'
import { ThemeProvider } from './components/ThemeProvider'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="invoice-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <InvoiceCreator />
      </div>
    </ThemeProvider>
  )
}

export default App