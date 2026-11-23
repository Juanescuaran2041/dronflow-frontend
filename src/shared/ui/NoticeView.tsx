import type { Notice } from './useAction'

export function NoticeView({ notice }: { notice: Notice | null }) {
  if (!notice) return null
  return <p className={`alert ${notice.ok ? 'success' : 'error'}`} role="alert">{notice.text}</p>
}
