export default {
  floor: (text: string) => Math.floor(Number.parseFloat(text)),
  toUpperCase: (text: any) => String(text).toUpperCase(),
  toLowerCase: (text: any) => String(text).toLowerCase(),
  padStart: (len: number, text: any) => String(text).padStart(len),
  padEnd: (len: number, text: any) => String(text).padEnd(len),
  filterTime: (arr: any[], treshold: number) => arr.filter((o: { time: number }) => o.time >= treshold),
  truncate: (record: { [s: string]: number } | ArrayLike<number>, len: number | undefined, note: string | number) => {
    const trunc = Object.fromEntries(Object.entries(record).slice(0, len))

    if (typeof note == 'string')
      trunc[note] = Object.values(record).slice(len).reduce((a, v) => a + v, 0)

    return trunc
  },
  num: (text: string | number) => {
    if (typeof text != 'string' && typeof text != 'number')
      return String(text)
    return (+text).toFixed(2).padStart(5)
  },
}
