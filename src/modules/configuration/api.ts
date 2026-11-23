import { request } from '../../shared/api/http'
import type { AlertThresholds, AssignmentRule, MaintenanceThresholds } from './types'

function resource<T>(path: string) {
  return {
    get: () => request<T>(path),
    save: (body: T) => request<T>(path, { method: 'PUT', body }),
  }
}

export const configurationApi = {
  assignmentRule: resource<AssignmentRule>('/configuration/assignment-rule'),
  alertThresholds: resource<AlertThresholds>('/configuration/alert-thresholds'),
  maintenanceThresholds: resource<MaintenanceThresholds>('/configuration/maintenance-thresholds'),
}
