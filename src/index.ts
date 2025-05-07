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

import { compose } from './hbs'
import logger from './log'
import { fmlSteps, getFmlStuff, getJeiPlugins, getMcLoadTime, getMods, getTimeline } from './parse'

//############################################################################
//############################################################################

function secondsToMinutes(sec: number): string {
  const min = Math.floor(sec / 60)
  return `${min}:${String(Math.floor(sec) - min * 60).padStart(2, '0')}`
}

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
  const modsTime = Object.values(mods).map(o => o.time).reduce((acc, v) => acc + v)

  const jeiPlugins = getJeiPlugins(debug_log)

  //############################################################################
  // Chart 1
  const pieMods = options.detailed

  interface PieMod {
    name: string
    color: string
    time: number
  }

  const pie: PieMod[] = []

  for (const [name, mod] of Object.entries(mods).slice(0, pieMods)) {
    pie.push({ name, color: mod.color, time: mod.time })
    ;(mod.parts ?? []).forEach(part => pie.push(part))
  }

  const totalTimes = Object.values(mods).map(m => m.time).slice(pieMods)

  function piePush(color: string, text: string, filter: (t: number) => boolean) {
    const otherMods = totalTimes.filter(filter)
    pie.push({
      name: `${otherMods.length} ${text}`,
      color,
      time: otherMods.reduce((a, v) => a + v),
    })
  }

  piePush('444444', `Other mods`, t => t > 1.0)
  piePush('333333', `'Fast' mods (1.0s - 0.1s)`, t => t >= 0.1 && t <= 1.0)
  piePush('222222', `'Instant' mods (%3C 0.1s)`, t => t < 0.1)

  const fmlStuff = getFmlStuff(debug_log)
  const loaderStuffTime = mcLoadTime - modsTime
  const otherFmlStuffTime = loaderStuffTime - fmlStuff.map(o => o.time).reduce((a, v) => a + v)
  if (otherFmlStuffTime > 0)
    fmlStuff.push({ color: '444444', name: 'Other', time: otherFmlStuffTime })

  const timeline = getTimeline(debug_log)

  const data = {
    modpackName: options.modpack,
    mcLoadTime,
    mcLoadTimeMin: secondsToMinutes(mcLoadTime),

    loadingTimeline: timeline,

    modLoadingTime: pie,

    fmlSteps: Object.keys(fmlSteps),
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

  await log.begin('Composing output')

  const composed = await compose(data, log)

  try {
    saveText(composed, options.output)
  }
  catch (error) {
    await log.error(`Can't save output file "${options.output}". Use option "--output=path/to/benchmark.md"\n\n${error}`)
  }

  if (options.data) {
    await log.begin('Writing file')

    const dataJson = JSON.stringify(data, null, 2)
      // prettify numerical arrays
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      .replace(/\[(\s*\d+(\.\d+)?,?\s+)+\]/g, m => m.replace(/\s+/g, ''))

    try {
      saveText(dataJson, options.data)
    }
    catch (error) {
      await log.error(`Can't save output file "${options.data}". Use option "--data=path/to/data.json"\n\n${error}`)
    }
  }

  log.result(`Load Time total: ${mcLoadTime}`)
}
