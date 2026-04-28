import { createConsola } from 'consola'
import { describe, expect, it } from 'vitest'

describe('consola output configuration', () => {
  it('should disable ANSI when fancy is false', () => {
    const consola = createConsola({
      fancy: false,
    })
    expect(consola.options.fancy).toBe(false)
  })

  it('should enable ANSI when fancy is true', () => {
    const consola = createConsola({
      fancy: true,
    })
    expect(consola.options.fancy).toBe(true)
  })

  it('should have stderr as stdout/stderr in CLI-like setup', () => {
    const consola = createConsola({})
    consola.options.stdout = process.stderr
    consola.options.stderr = process.stderr

    expect(consola.options.stdout).toBe(process.stderr)
    expect(consola.options.stderr).toBe(process.stderr)
  })
})
