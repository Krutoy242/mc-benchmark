import { describe, expect, it } from 'vitest'
import logger from '../src/log.js'
import { getJeiPlugins, getMcLoadTime } from '../src/parse.js'

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
    const plugins = await getJeiPlugins(logStr, logger)
    expect(plugins).toEqual({
      test2: 2,
      test1: 1.5,
    })
  })
})
