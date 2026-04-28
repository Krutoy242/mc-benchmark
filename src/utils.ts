export function secondsToMinutes(sec: number): string {
  const min = Math.floor(sec / 60)
  return `${min}:${String(Math.floor(sec) - min * 60).padStart(2, '0')}`
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
