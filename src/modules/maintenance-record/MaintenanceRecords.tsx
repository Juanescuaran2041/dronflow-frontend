import { useEffect, useState, type FormEvent } from 'react'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'
import { formatDate } from '../mission/format'
import { maintenanceRecordsApi } from './api'
import { MAINTENANCE_RESULTS, MAINTENANCE_RESULT_LABELS, type MaintenanceRecordResponse, type MaintenanceResult } from './types'

interface Props {
  droneCode: string
  inMaintenance: boolean
  onRecorded: () => void
}

/** HU-15: maintenance results of a drone; a new one can be registered while it is in maintenance. */
export function MaintenanceRecords({ droneCode, inMaintenance, onRecorded }: Props) {
  const [records, setRecords] = useState<MaintenanceRecordResponse[] | null>(null)
  const [result, setResult] = useState('')
  const { notice, busy, run, setNotice } = useAction()

  useEffect(() => {
    maintenanceRecordsApi.listByDrone(droneCode).then(setRecords, (e: Error) => setNotice({ ok: false, text: e.message }))
  }, [droneCode, setNotice])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (result === 'DECOMMISSION' && !window.confirm(`¿Dar de baja el dron ${droneCode}? No se podrá reactivar.`)) return
    const record = await run(
      () => maintenanceRecordsApi.create({ droneCode, result: result as MaintenanceResult }),
      (r) => `Resultado "${MAINTENANCE_RESULT_LABELS[r.result]}" registrado.`,
    )
    if (record) {
      setRecords((current) => [record, ...(current ?? [])])
      setResult('')
      onRecorded()
    }
  }

  return (
    <div className="stack">
      <h2>Mantenimiento</h2>
      {inMaintenance && (
        <form className="inline" onSubmit={handleSubmit}>
          <label>
            Resultado del mantenimiento
            <select value={result} onChange={(e) => setResult(e.target.value)} required>
              <option value="" disabled>Selecciona un resultado</option>
              {MAINTENANCE_RESULTS.map((r) => <option key={r} value={r}>{MAINTENANCE_RESULT_LABELS[r]}</option>)}
            </select>
          </label>
          <button disabled={busy}>Registrar resultado</button>
        </form>
      )}
      <NoticeView notice={notice} />
      {records?.length === 0 && <p className="empty">Sin mantenimientos registrados.</p>}
      {!!records?.length && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Resultado</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}><td>{formatDate(r.date)}</td><td>{MAINTENANCE_RESULT_LABELS[r.result]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
