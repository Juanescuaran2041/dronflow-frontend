import { Link, useParams } from 'react-router'
import { FlightHistory } from '../flight-history/FlightHistory'

/** Per-drone page that groups the drone's records. */
export function DroneDetailPage() {
  const { code = '' } = useParams()
  return (
    <section className="stack">
      <h1>Dron {code}</h1>
      <FlightHistory droneCode={code} />
      <Link to="/drones">Volver al listado</Link>
    </section>
  )
}
