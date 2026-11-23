import type { Location } from './types'

export type LocationDraft = Record<keyof Location, string>

export const EMPTY_LOCATION: LocationDraft = { name: '', latitude: '', longitude: '', altitude: '' }

export function toLocation(draft: LocationDraft): Location {
  return {
    name: draft.name.trim(),
    latitude: Number(draft.latitude),
    longitude: Number(draft.longitude),
    altitude: Number(draft.altitude),
  }
}

export function formatLocation(location: Location): string {
  return `${location.name} (${location.latitude}, ${location.longitude}, ${location.altitude} m)`
}

export function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleString('es-CO') : '—'
}
