/**
 * @file Collect information about load time from Debug.log
 * and output it in .MD file
 *
 * @author Krutoy242
 * @link https://github.com/Krutoy242
 */

import type { Args } from './cli.js'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import chalkWeak from 'chalk'
import { compose } from './hbs.js'
import logger from './log.js'
import { getFmlStuff, getJeiPlugins, getMcLoadTime, getMods, getTimeline, loaderSteps } from './parse.js'

const chalk = chalkWeak.constructor({ level: process.stderr.isTTY ? 3 : 0 })

//############################################################################
//############################################################################

function secondsToMinutes(sec: number): string {
  const min = Math.floor(sec / 60)
  return `${min}:${String(Math.floor(sec) - min * 60).padStart(2, '0')}`
}

export function sum(arr: Array<number>): number {
  return arr.reduce((a, v) => a + v, 0)
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

  const debug_log = await loadText(options.input, (err, fpath) => log.error(`Can't open file "${fpath}".\n${err}`))
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

  //############################################################################
  // Chart 1
  interface PieMod {
    name: string
    color: string
    readonly time: number
  }

  const pie: PieMod[] = []

  for (const [name, mod] of Object.entries(mods).slice(0, options.detailed)) {
    const modSlice: PieMod = { name, color: mod.color, time: sum(mod.steps) }
    pie.push(modSlice)
    ;(mod.parts ?? []).forEach((part) => {
      pie.push(part)
    })
  }

  const totalTimes = Object.values(mods).map(m => sum(m.steps)).slice(options.detailed)

  async function piePush(color: string, text: string, filter: (t: number) => boolean) {
    const otherMods = totalTimes.filter(filter)
    if (otherMods.length) {
      pie.push({
        name: `${otherMods.length} ${text}`,
        color,
        time: sum(otherMods),
      })
    }
    else {
      await log.info(`Cannot make pie section `
        + `"${chalk.hex('007777')(text)}" since no mods found at all`)
    }
  }

  await piePush('444444', `Other mods`, t => t > 1.0)
  await piePush('333333', `'Fast' mods (1.0s - 0.1s)`, t => t >= 0.1 && t <= 1.0)
  await piePush('222222', `'Instant' mods (%3C 0.1s)`, t => t < 0.1)

  const mcLoadTime = getMcLoadTime(debug_log)
  const modsTime = sum(pie.map(o => o.time))

  const fmlStuff = getFmlStuff(debug_log)
  const loaderStuffTime = mcLoadTime - modsTime

  // Destinct "Other" section of chart
  const otherFmlStuffTime = loaderStuffTime - sum(fmlStuff.map(part => part.time))
  if (otherFmlStuffTime > 0)
    fmlStuff.push({ color: '444444', name: 'Other', time: otherFmlStuffTime })

  const timeline = getTimeline(debug_log)

  // Remove FML steps without time
  const filteredLoaderSteps = Object.entries(mods)
    .filter(([name]) => !name.match(/Just Enough Items|Had Enough Items/))
  const sumLoaderSteps = columnSumm(filteredLoaderSteps.map(([,{ steps }]) => steps))
  const fmlStepFilter = sumLoaderSteps.map(n => n > 0)
  const removeUnusedSteps = <T>(arr: T[]) => arr.filter((_, i) => fmlStepFilter[i])
  filteredLoaderSteps.forEach(([, mod]) => mod.steps = removeUnusedSteps(mod.steps))

  const data = {
    modpackName: options.modpack,
    mcLoadTime,
    mcLoadTimeMin: secondsToMinutes(mcLoadTime),

    loadingTimeline: timeline,

    modLoadingTime: pie,

    loaderStepNames: removeUnusedSteps(Object.keys(loaderSteps)),
    loaderSteps: Object.fromEntries(
      filteredLoaderSteps.map(([n, m]) => [n, m.steps])
        .concat([[
          '[Mod Average]',
          sumLoaderSteps
            .map(n => n / filteredLoaderSteps.filter(([,m]) => sum(m.steps)).length)
            .filter(Boolean),
        ]]),
    ),

    jeiPlugins: await getJeiPlugins(debug_log, log),

    fmlStuff: {
      total: loaderStuffTime,
      list: fmlStuff,
    },
  }

  await log.begin('Composing output')

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

  const composed = await compose(data, log, options.template)
  process.stdout.write(composed)

  log.result(`Load Time total: ${mcLoadTime}`)
}

function columnSumm(arr: number[][]): number[] {
  return arr.reduce((r, a) => {
    a.forEach((b, i) => r[i] = (r[i] || 0) + b)
    return r
  }, [])
}
