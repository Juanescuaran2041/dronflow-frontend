import { configurationApi } from './api'
import { RuleForm, type RuleField } from './RuleForm'
import type { AlertThresholds, AssignmentRule, MaintenanceThresholds } from './types'

const ASSIGNMENT_FIELDS: RuleField<AssignmentRule>[] = [
  { name: 'batteryWeight', label: 'Peso de la batería', min: 0, step: 0.01 },
  { name: 'proximityWeight', label: 'Peso de la cercanía', min: 0, step: 0.01 },
  { name: 'priorityWeight', label: 'Peso de la prioridad', min: 0, step: 0.01 },
]

const ALERT_FIELDS: RuleField<AlertThresholds>[] = [
  { name: 'batteryMinPercent', label: 'Batería mínima (%)', min: 0, max: 100, step: 0.1 },
  { name: 'maxDeviationMeters', label: 'Desvío máximo de ruta (m)', min: 0.1, step: 0.1 },
]

const MAINTENANCE_FIELDS: RuleField<MaintenanceThresholds>[] = [
  { name: 'maxHours', label: 'Horas de vuelo máximas', min: 0.1, step: 0.1 },
  { name: 'maxMissions', label: 'Misiones máximas', min: 1, step: 1 },
]

/** HU-18: assignment rule, alert thresholds and maintenance thresholds (ADMIN only). */
export function ConfigurationPage() {
  return (
    <section>
      <h1>Configuración</h1>
      <div className="grid">
        <RuleForm title="Ponderación de asignación" fields={ASSIGNMENT_FIELDS} api={configurationApi.assignmentRule} />
        <RuleForm title="Umbrales de alerta" fields={ALERT_FIELDS} api={configurationApi.alertThresholds} />
        <RuleForm title="Umbrales de mantenimiento" fields={MAINTENANCE_FIELDS} api={configurationApi.maintenanceThresholds} />
      </div>
    </section>
  )
}
