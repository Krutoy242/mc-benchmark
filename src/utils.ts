export function secondsToMinutes(sec: number): string {
  if (Number.isNaN(sec) || !Number.isFinite(sec))
    return '0:00'
  const absoluteSec = Math.max(0, sec)
  const min = Math.floor(absoluteSec / 60)
  return `${min}:${String(Math.floor(absoluteSec) - min * 60).padStart(2, '0')}`
}

export function sum(arr: Array<number>): number {
  return arr.reduce((a, v) => a + v, 0)
}

export function columnSumm(arr: number[][]): number[] {
  return arr.reduce((r, a) => {
    a.forEach((b, i) => r[i] = (r[i] || 0) + b)
    return r
  }, [])
}
