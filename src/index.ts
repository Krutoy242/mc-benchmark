/* eslint-disable regexp/no-super-linear-backtracking */
/**
 * @file Collect information about load time from Debug.log
 * and output it in .MD file
 *
 * @author Krutoy242
 * @link https://github.com/Krutoy242
 */

import type { Args } from './cli'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import numeral from 'numeral'
import logger from './log'
import { fmlSteps, getFmlStuff, getJeiPlugins, getMcLoadTime, getMods } from './parse'

//############################################################################
//############################################################################

// function num(n: string | number) {
//   return numeral(typeof n == 'string' ? Number.parseFloat(n) : n).format('0.00').padStart(6)
// }

function secondsToMinutes(sec: number): string {
  const min = Math.floor(sec / 60)
  return `${min}:${String(Math.floor(sec) - min * 60).padStart(2, '0')}`
}

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝

export default async function parseDebugLog(_options: Args) {
  const options = {
    mkdirSync,
    readFileSync,
    writeFileSync,

    ..._options,
  }

  const log: typeof logger = (options as any).defaultLogger ?? logger

  async function loadText(fpath: string, onError: (err: any, fpath: string) => void | Promise<void>) {
    await log.begin(`Opening file "${fpath}"`)
    let fileContent
    try {
      fileContent = options.readFileSync(resolve(options.cwd ?? './', fpath), 'utf8')
    }
    catch (err) {
      await onError(err, fpath)
      return undefined
    }
    return fileContent
  }

  function saveText(txt: string, filename: string) {
    options.mkdirSync(dirname(filename), { recursive: true })
    options.writeFileSync(filename, txt)
  }

  //############################################################################
  // Numbers

  const debug_log = await loadText(options.input, (err, fpath) => log.error(`Can't open file "${fpath}". Use option "--input=path/to/debug.log"\n${err}`))
  if (!debug_log)
    return

  const crafttweaker_log = await loadText(options.ctlog, (_err, fpath) => log.warn(`Can't open file "${fpath}". Use option "--ctlog=path/to/crafttweker.log"`))

  const mods = await getMods(debug_log, crafttweaker_log, log)

  if (!Object.keys(mods)) {
    if (!debug_log.match(/\[main\/DEBUG\] \[FML\]/)) {
      return await log.error(`The file "${options.input}" does not contain`
        + ` rich debugging information. It is most likely not actual debug.log.`
        + `\n\nHint:\nSome MC launchers disable generating of debug.log file by default.`
        + ` Find out how to enable it.`)
    }
    else {
      return await log.error(`The file "${options.input}" not full.`
        + ` Your Minecraft not loaded completely or file is corrupted.`)
    }
  }

  const mcLoadTime = getMcLoadTime(debug_log)
  const modsTime = Object.values(mods).map(o => o.totalTime).reduce((acc, v) => acc + v)

  const jeiPlugins = getJeiPlugins(debug_log)

  //############################################################################
  // Chart 1
  const pieMods = options.detailed

  interface PieMod {
    name: string
    color: string
    totalTime: number
  }

  const pie: PieMod[] = Object.entries(mods)
    .map(([name, mod]) => ({ name, color: mod.color, totalTime: mod.totalTime }))
    .slice(0, pieMods)

  const totalTimes = Object.values(mods).map(m => m.totalTime).slice(pieMods)

  function piePush(color: string, text: string, filter: (t: number) => boolean) {
    const otherMods = totalTimes.filter(filter)
    pie.push({
      name: `${otherMods.length} ${text}`,
      color,
      totalTime: otherMods.reduce((a, v) => a + v),
    })
  }

  piePush('444444', `Other mods`, t => t > 1.0)
  piePush('333333', `'Fast' mods (1.0s - 0.1s)`, t => t >= 0.1 && t <= 1.0)
  piePush('222222', `'Instant' mods (%3C 0.1s)`, t => t < 0.1)

  const fmlStuff = getFmlStuff(debug_log)

  const loaderStuffTime = mcLoadTime - modsTime
  const otherFmlStuffTime = loaderStuffTime - fmlStuff.map(o => o.time).reduce((a, v) => a + v)
  fmlStuff.push({ color: '444444', name: 'Other', time: otherFmlStuffTime })

  const result = {
    modpackName: options.modpack,
    mcLoadTime,
    mcLoadTimeMin: secondsToMinutes(mcLoadTime),

    horizontalBar: [
      { label: 'MODS', value: modsTime },
      { label: 'FML stuff', value: loaderStuffTime },
    ],

    modLoadingTime: pie,

    fmlSteps: fmlSteps.map(s => s.replace(/ - .*/, '')),
    loaderSteps: Object.fromEntries(Object
      .entries(mods)
      .filter(([name]) => !name.match(/Just Enough Items|Had Enough Items/))
      .map(([name, mod]) => [name, mod.loaderSteps])),

    jeiPlugins,

    fmlStuff: {
      total: loaderStuffTime,
      list: fmlStuff,
    },
  }

  //############################################################################
  //############################################################################

  await log.begin('Writing file')

  try {
    saveText(
      JSON.stringify(result, null, 2)
        // prettify numerical arrays
        .replace(/\[(\s*\d+(\.\d+)?,?\s+)+\]/g, m => m.replace(/\s+/g, '')),
      options.output,
    )
  }
  catch (error) {
    await log.error(`Can't save output file "${options.output}". Use option "--output=path/to/benchmark.md"\n\n${error}`)
  }

  log.result(`Load Time total: ${mcLoadTime}`)
}
