module.exports = {
  floor: text => Math.floor(Number.parseFloat(text)),
  toUpperCase: text => String(text).toUpperCase(),
  toLowerCase: text => String(text).toLowerCase(),
  padStart: (len, text) => String(text).padStart(len),
  padEnd: (len, text) => String(text).padEnd(len),
  truncate: (arr, len, note) => Array.isArray(arr)
    ? [...arr.slice(0, len), note]
    : Object.fromEntries(Object.entries(arr).slice(0, len)),
  num: (text) => {
    if (typeof text != 'string' && typeof text != 'number')
      return String(text)
    const n = Number.parseFloat(text)
    const whole = Math.floor(n)
    const resedue = n - whole
    return `${String(whole).padStart(3)}.${String(Math.floor(resedue * 100)).padEnd(2)}`
  },
}
