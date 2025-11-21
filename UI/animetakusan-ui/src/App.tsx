import { useState, useEffect } from 'react'
import { LoginPage } from './pages/LoginPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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

  // Route rendering
  if (currentPath === '/login') {
    return <LoginPage />
  }

  if (currentPath === '/auth/callback') {
    return <AuthCallbackPage />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Home page (existing content)
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleLogout} style={{marginBottom: 12}}>
          Logout
        </button>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div style={{marginTop:12}}>
          <button onClick={fetchMessage} disabled={loading}>
            {loading ? 'Loading...' : 'Load message'}
          </button>
          <button onClick={fetchWeather} disabled={weatherLoading} style={{marginLeft:12}}>
            {weatherLoading ? 'Loading...' : 'Load weather'}
          </button>
        </div>
        <div style={{marginTop:8}}>
          {error && <div style={{color:'crimson'}}>Error: {error}</div>}
          {message != null && <pre style={{whiteSpace:'pre-wrap'}}>{message}</pre>}
          {weatherError && <div style={{color:'crimson'}}>Weather error: {weatherError}</div>}
          {weather != null && <pre style={{whiteSpace:'pre-wrap'}}>{weather}</pre>}
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
