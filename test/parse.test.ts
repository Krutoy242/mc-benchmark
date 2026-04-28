import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getJeiPlugins, getMcLoadTime, getMods } from '../src/parse.js'

describe('parse', () => {
  it('getMcLoadTime', () => {
    expect(getMcLoadTime('[FML]: Bar Finished: Loading took 12.3s')).toBe(12.3)
    expect(getMcLoadTime('[VintageFix]: Game launch took 45.6 seconds')).toBe(45.6)
    expect(getMcLoadTime('[Universal Tweaks]: The game loaded in approximately 78.9 seconds')).toBe(78.9)
    expect(getMcLoadTime('Nothing')).toBe(0)
  })

  it('getJeiPlugins', async () => {
    const logStr = `
[01:02:03] [jei]: Registered plugin: test1 in 1500 ms
[01:02:04] [Had Enough Items]: Registered plugin: test2 in 2000 ms
[01:02:05] [jei]: Registered plugin: test1 in 500 ms
    `
    const plugins = await getJeiPlugins(logStr)
    expect(plugins).toEqual({
      test2: 2,
      test1: 1.5,
    })
  })

  it('getMods from real fixture', async () => {
    const logPath = resolve(__dirname, 'fixtures/debug-sample.log')
    const debug_log = readFileSync(logPath, 'utf8')
    const lines = debug_log.split('\n')
    const mods = await getMods(debug_log, lines, undefined)
    
    expect(Object.keys(mods).length).toBeGreaterThan(0)
    // Check for some known mods in the fixture if possible
    // Since I don't know exactly what's in "D:/mc/E2E-E/logs/debug.log" 
    // but typically it has many mods.
  })
})
