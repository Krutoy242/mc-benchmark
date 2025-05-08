module.exports = {
  floor: text => Math.floor(Number.parseFloat(text)),
  toUpperCase: text => String(text).toUpperCase(),
  toLowerCase: text => String(text).toLowerCase(),
  padStart: (len, text) => String(text).padStart(len),
  padEnd: (len, text) => String(text).padEnd(len),
  filterTime: (arr, treshold) => arr.filter(o => o.time >= treshold),
  truncate: (record, len, note) => {
    const trunc = Object.fromEntries(Object.entries(record).slice(0, len))

    if (typeof note == 'string')
      trunc[note] = Object.values(record).slice(len).reduce((a, v) => a + v, 0)

    return trunc
  },
  num: (text) => {
    if (typeof text != 'string' && typeof text != 'number')
      return String(text)
    return (+text).toFixed(2).padStart(5)
  },
}
