import { useEffect, useState, type FormEvent } from 'react'
import { NoticeView } from '../../shared/ui/NoticeView'
import { useAction } from '../../shared/ui/useAction'

export interface RuleField<T> {
  name: keyof T & string
  label: string
  min: number
  max?: number
  step: number
}

interface RuleFormProps<T> {
  title: string
  fields: RuleField<T>[]
  api: { get: () => Promise<T>; save: (body: T) => Promise<T> }
}

/** One form per rule (HU-18 author decision): loads the current values and saves them with PUT. */
export function RuleForm<T extends object>({ title, fields, api }: RuleFormProps<T>) {
  const [values, setValues] = useState<Record<string, string> | null>(null)
  const { notice, busy, run, setNotice } = useAction()

  useEffect(() => {
    api.get().then(
      (rule) => setValues(Object.fromEntries(fields.map((f) => [f.name, String(rule[f.name])]))),
      (e: Error) => setNotice({ ok: false, text: e.message }),
    )
  }, [api, fields, setNotice])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const body = Object.fromEntries(fields.map((f) => [f.name, Number(values![f.name])])) as T
    await run(() => api.save(body), () => 'Configuración guardada.')
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {values &&
        fields.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              type="number" required min={f.min} max={f.max} step={f.step} value={values[f.name]}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          </label>
        ))}
      <NoticeView notice={notice} />
      {values && <button disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>}
    </form>
  )
}
