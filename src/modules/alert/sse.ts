/** Parses one Server-Sent Events block ("event: x\ndata: y") into its event name and data. */
export function parseSseBlock(block: string): { event: string; data: string } {
  let event = 'message'
  const data: string[] = []
  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''))
  }
  return { event, data: data.join('\n') }
}
