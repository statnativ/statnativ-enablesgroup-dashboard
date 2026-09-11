import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Documents from './pages/Documents'
import Actions from './pages/Actions'
import Timeline from './pages/Timeline'
import Risks from './pages/Risks'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/dashboard/documents" element={<Documents />} />
              <Route path="/dashboard/actions" element={<Actions />} />
              <Route path="/dashboard/timeline" element={<Timeline />} />
              <Route path="/dashboard/risks" element={<Risks />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
