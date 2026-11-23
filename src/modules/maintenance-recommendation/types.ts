// Mirrors the backend maintenance recommendation DTO.
export interface MaintenanceRecommendationResponse {
  id: string
  droneCode: string
  reason: string
  generatedAt: string
}
