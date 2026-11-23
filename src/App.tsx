import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './shared/auth/AuthProvider'
import { RequireAuth } from './shared/auth/RequireAuth'
import { Layout } from './shared/layout/Layout'
import { LoginPage } from './modules/users/LoginPage'
import { RegisterOperatorPage } from './modules/users/RegisterOperatorPage'
import { DronesPage } from './modules/fleet/DronesPage'
import { RegisterDronePage } from './modules/fleet/RegisterDronePage'
import { DroneDetailPage } from './modules/fleet/DroneDetailPage'
import { ConfigurationPage } from './modules/configuration/ConfigurationPage'
import { CreateMissionPage } from './modules/mission/CreateMissionPage'
import { MissionDetailPage } from './modules/mission/MissionDetailPage'
import { MissionsPage } from './modules/mission/MissionsPage'
import { AlertsPage } from './modules/alert/AlertsPage'

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
            <Route path="drones/:code" element={<DroneDetailPage />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="missions/new" element={<CreateMissionPage />} />
            <Route path="missions/:code" element={<MissionDetailPage />} />
            <Route path="alerts" element={<RequireAuth roles={['ADMIN']}><AlertsPage /></RequireAuth>} />
            <Route path="configuration" element={<RequireAuth roles={['ADMIN']}><ConfigurationPage /></RequireAuth>} />
            <Route path="users/new" element={<RequireAuth roles={['ADMIN']}><RegisterOperatorPage /></RequireAuth>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
