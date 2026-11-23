import { useState } from 'react'
import { errorMessage } from '../api/http'

export interface Notice {
  ok: boolean
  text: string
}

/** Runs an API call, tracks the busy flag and turns the result or the backend error into a notice. */
export function useAction() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [busy, setBusy] = useState(false)

  async function run<T>(call: () => Promise<T>, success?: (result: T) => string): Promise<T | undefined> {
    setNotice(null)
    setBusy(true)
    try {
      const result = await call()
      if (success) setNotice({ ok: true, text: success(result) })
      return result
    } catch (e) {
      setNotice({ ok: false, text: errorMessage(e) })
    } finally {
      setBusy(false)
    }
  }

  return { notice, busy, run, setNotice }
}
