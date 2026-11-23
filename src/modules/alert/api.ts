import { request } from '../../shared/api/http'
import { getStoredSession } from '../../shared/auth/session'
import { parseSseBlock } from './sse'
import type { AlertResponse, AlertType, Severity } from './types'

const RETRY_MS = 5000

export const alertsApi = {
  list: (filter: { type?: AlertType; severity?: Severity }) => {
    const query = new URLSearchParams(Object.entries(filter).filter(([, value]) => value) as [string, string][])
    return request<AlertResponse[]>(`/alerts?${query}`)
  },

  /**
   * HU-11: listens to GET /alerts/stream until the signal aborts, reconnecting when the stream drops.
   * EventSource cannot send the Authorization header, so the stream is read with fetch.
   */
  subscribe: async (onAlert: (alert: AlertResponse) => void, signal: AbortSignal) => {
    while (!signal.aborted) {
      try {
        const response = await fetch('/api/v1/alerts/stream', {
          headers: { Accept: 'text/event-stream', Authorization: `Bearer ${getStoredSession()?.token}` },
          signal,
        })
        if (response.status === 401 || response.status === 403) return
        if (!response.ok || !response.body) throw new Error(`stream ${response.status}`)
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
        let buffer = ''
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += value
          const blocks = buffer.split(/\r?\n\r?\n/)
          buffer = blocks.pop() ?? ''
          for (const block of blocks) {
            const { event, data } = parseSseBlock(block)
            if (event === 'alert' && data) onAlert(JSON.parse(data) as AlertResponse)
          }
        }
      } catch {
        if (signal.aborted) return
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_MS))
    }
  },
}
