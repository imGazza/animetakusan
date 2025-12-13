import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/auth/Login'
import Layout from './pages/layout/Layout'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [count, setCount] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [weather, setWeather] = useState<string | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
  }, [])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  async function fetchMessage() {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('https://api.animetakusan.eu/api/Public/message')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      setMessage(text)
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function fetchWeather() {
    setWeatherLoading(true)
    setWeatherError(null)
    setWeather(null)
    try {
      const res = await fetch('https://api.animetakusan.eu/WeatherForecast')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setWeather(JSON.stringify(json, null, 2))
    } catch (err: any) {
      setWeatherError(err?.message ?? 'Unknown error')
    } finally {
      setWeatherLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
    window.history.pushState({}, '', '/login')
    setCurrentPath('/login')
  }

  // // Route rendering
  // if (currentPath === '/login') {
  //   return <LoginPage />
  // }

  // if (currentPath === '/auth/callback') {
  //   return <AuthCallbackPage />
  // }

  // // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   return <LoginPage />
  // }

  // Home page (existing content)
  return (
    <>
      <Layout />
    </>
  )
}

export default App
