import { request } from '../../shared/api/http'
import type { MaintenanceRecommendationResponse } from './types'

export const recommendationsApi = {
  list: () => request<MaintenanceRecommendationResponse[]>('/maintenance-recommendations'),
}
