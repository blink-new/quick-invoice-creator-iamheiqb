import React from 'react'
import { WealthDashboard } from './components/WealthDashboard'
import { ThemeProvider } from './components/ThemeProvider'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="wealth-theme">
      <WealthDashboard />
    </ThemeProvider>
  )
}

export default App