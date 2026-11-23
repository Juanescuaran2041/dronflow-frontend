import { request } from '../../shared/api/http'
import type { FlightHistoryResponse } from './types'

export const flightHistoryApi = {
  get: (droneCode: string) => request<FlightHistoryResponse>(`/drones/${encodeURIComponent(droneCode)}/flight-history`),
}
