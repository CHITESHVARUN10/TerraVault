import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { AppShell, RequireAuth } from './components/AppShell'

// Landing
import Landing from './pages/Landing'
// Auth
import Login from './pages/Login'
import Register from './pages/Register'
// App
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Profile from './pages/Profile'
import Contact from './pages/Contact'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AppShell />}>
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/properties"
              element={
                <RequireAuth>
                  <Properties />
                </RequireAuth>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <RequireAuth>
                  <PropertyDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
