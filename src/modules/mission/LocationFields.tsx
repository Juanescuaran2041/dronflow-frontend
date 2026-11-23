import type { LocationDraft } from './format'
import type { Location } from './types'

/** Name, latitude, longitude and altitude of a point. */
export function LocationFields({ legend, value, onChange }: { legend: string; value: LocationDraft; onChange: (value: LocationDraft) => void }) {
  const input = (name: keyof Location, label: string, props: object) => (
    <label>
      {label}
      <input {...props} required value={value[name]} onChange={(e) => onChange({ ...value, [name]: e.target.value })} />
    </label>
  )
  return (
    <fieldset>
      <legend>{legend}</legend>
      {input('name', 'Nombre', {})}
      {input('latitude', 'Latitud', { type: 'number', min: -90, max: 90, step: 'any' })}
      {input('longitude', 'Longitud', { type: 'number', min: -180, max: 180, step: 'any' })}
      {input('altitude', 'Altitud (m)', { type: 'number', step: 'any' })}
    </fieldset>
  )
}
