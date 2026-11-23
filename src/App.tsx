import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './shared/auth/AuthProvider'
import { RequireAuth } from './shared/auth/RequireAuth'
import { Layout } from './shared/layout/Layout'
import { LoginPage } from './modules/users/LoginPage'
import { RegisterOperatorPage } from './modules/users/RegisterOperatorPage'
import { DronesPage } from './modules/fleet/DronesPage'
import { RegisterDronePage } from './modules/fleet/RegisterDronePage'
import { ConfigurationPage } from './modules/configuration/ConfigurationPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Navigate to="/drones" replace />} />
            <Route path="drones" element={<DronesPage />} />
            <Route path="drones/new" element={<RegisterDronePage />} />
            <Route path="configuration" element={<RequireAuth roles={['ADMIN']}><ConfigurationPage /></RequireAuth>} />
            <Route path="users/new" element={<RequireAuth roles={['ADMIN']}><RegisterOperatorPage /></RequireAuth>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
