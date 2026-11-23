import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './shared/auth/AuthProvider'
import { RequireAuth } from './shared/auth/RequireAuth'
import { Layout } from './shared/layout/Layout'
import { HomePage } from './modules/users/HomePage'
import { LoginPage } from './modules/users/LoginPage'
import { RegisterOperatorPage } from './modules/users/RegisterOperatorPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<HomePage />} />
            <Route path="users/new" element={<RequireAuth roles={['ADMIN']}><RegisterOperatorPage /></RequireAuth>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
