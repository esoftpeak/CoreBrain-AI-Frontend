import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'
import { AppPage } from './pages/AppPage'
import { SignUpVerifyPage } from './pages/SignUpVerifyPage'
import { LoginPage } from './pages/LoginPage'
import { SignUpCheckEmailPage } from './pages/SignUpCheckEmailPage'
import { SignUpPage } from './pages/SignUpPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUpPage />
              </GuestRoute>
            }
          />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/signup/check-email" element={<SignUpCheckEmailPage />} />
          <Route path="/signup/verify" element={<SignUpVerifyPage />} />
          <Route path="/auth/verify" element={<SignUpVerifyPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
