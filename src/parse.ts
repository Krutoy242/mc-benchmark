import type logger from './log.js'
import process from 'node:process'
import chalkWeak from 'chalk'
import Color from 'color'
import ColorHash from 'color-hash'
import { sum } from './index.js'

const chalk = chalkWeak.constructor({ level: process.stderr.isTTY ? 3 : 0 })

// @ts-expect-error default

const colorHash = new (ColorHash.default ?? ColorHash)({ lightness: [0.2625, 0.375, 0.4875] })

function escapeRegex(str: string) {
  return str.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export const loaderSteps = {
  'Construction': /Construction - /,
  'Loading Resources': /Loading Resources - (?:FMLFileResourcePack:)?/,
  'PreInitialization': /PreInitialization - /,
  'Initialization': /Initialization - /,
  'InterModComms': /InterModComms\$IMC - /,
  'PostInitialization': /PostInitialization - /,
  'LoadComplete': /LoadComplete - /,
  'ModIdMapping': /ModIdMapping - /,
}

const fml_steps_rgx = `(?<stepName>${
  Object.values(loaderSteps).map(l => l.source).join('|')
})`

export interface Mod {
  steps: number[]
  fileName?: string
  color: string
  parts?: Part[]
}

export interface Part {
  name: string
  color: string
  time: number
}

export interface ModStore { [modName: string]: Mod }

// ------------------------------------------------
const mcFinishLoadingRgx = /(\[FML\]: Bar Finished: Loading took|\[VintageFix\]: Game launch took|\[Universal Tweaks\]: The game loaded in approximately) (\S*)(s| seconds)/g

function timeToSeconds(timeStr: string): number {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

export function getTimeline(debug_log: string) {
  const timelineSteps: { [key: string]: { rgx: RegExp, stamp?: string } } = {
    Mixins: {
      rgx: /\[Client thread\/INFO\] \[FML\]: -- System Details --/,
      stamp: 'Window appear',
    },
    Construction: {
      rgx: /Sending event FMLPreInitializationEvent to mod minecraft/,
    },
    PreInit: {
      rgx: /Sending event FMLInitializationEvent to mod minecraft/,
    },
    Init: {
      rgx: mcFinishLoadingRgx,
    },
  }

  const lines = debug_log.split('\n')
  const timeline: [name: string, time: number, stamp?: string][] = []

  const timeStampRgx = /^\[(\d+:\d+:\d+)\] /
  const prevTimeStamp = debug_log.match(timeStampRgx)![1]
  let prevMoment = timeToSeconds(prevTimeStamp)
  let pointer = 0

  for (const [name, { rgx, stamp }] of Object.entries(timelineSteps)) {
    for (let i = pointer; i < lines.length; i++) {
      const line = lines[i]
      if (!line.match(rgx))
        continue

      const timeStamp = line.match(timeStampRgx)![1]
      const moment = timeToSeconds(timeStamp)
      timeline.push([name, moment - prevMoment, stamp])
      prevMoment = moment
      pointer = i + 1
      break
    }
  }

  return timeline
}

export async function getMods(
  debug_log: string,
  crafttweaker_log: string | undefined,
  log: typeof logger,
) {
  let result: ModStore = {}

  const fullSearchRgx = new RegExp(
    `${escapeRegex('[Client thread/DEBUG] [FML]: Bar Step: ')}${fml_steps_rgx}(?<modName>.+) took (?<time>\\d+.\\d+)s`,
    'gim',
  )
  const fullLog = [...debug_log.matchAll(fullSearchRgx)]

  await log.begin('Parsing mods', fullLog.length)

  for (const { groups } of fullLog) {
    await log.step()
    const { stepName, modName, time: timeStr } = groups as { [key: string]: string }

    // Skip Forge steps
    if (['Minecraft Forge', 'Forge Mod Loader'].includes(modName))
      continue

    result[modName] ??= {
      steps: [...Object.keys(loaderSteps), 0.0].map(() => 0.0),
      color: colorHash.hex(modName).slice(1),
    }

    const stepIndex = Object.values(loaderSteps).findIndex(rgx => stepName.match(rgx))
    const time = Number.parseFloat(timeStr)
    result[modName].steps[stepIndex] += time
  }

  // Get file for every mod
  for (const { groups } of debug_log.matchAll(
    // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
    /\[Client thread\/DEBUG\] \[FML\]: \t[^(]+\((?!API: )(?<modName>.+):[^)]+\): (?<fileName>.+?\.jar) \(.*\)/gi,
  )) {
    const modWithFile = result[groups!.modName]
    if (modWithFile) {
      modWithFile.fileName = groups!.fileName
    }
    else {
      await log.info(
        `"${chalk.hex('558855').bold(groups!.modName)}" `
        + `from "${chalk.hex('558855')(groups!.fileName)}" `
        + `file, but not a mod`,
      )
    }
  }

  // -------------------------------------------
  // Additional parts
  // -------------------------------------------

  await addParts(result, {
    name: '[JEI Ingredient Filter]',
    rgx: /(Just|Had) Enough Items/i,
    step: 'LoadComplete',
    time: toSeconds(debug_log.match(
      /\[(?:jei|Had\s?Enough\s?Items)\]: Building ingredient filter (?:and search trees )?took (?<num>\d+\.\d+) (?<time>m?s)/,
    )?.groups),
  }, log)

  const jeiPlugins = Object.values(await getJeiPlugins(debug_log, log))
  if (jeiPlugins.length) {
    await addParts(result, {
      name: '[JEI Plugins]',
      rgx: /(Just|Had) Enough Items/i,
      step: 'LoadComplete',
      time: sum(jeiPlugins),
    }, log)
  }

  // if (crafttweaker_log) {
  //   const scriptLoading = [...crafttweaker_log.matchAll(
  //     /\[.+?\]\[CLIENT\]\[\w+\] Completed script loading in: (\d+)ms/g,
  //   )]
  //   await addParts(result, {
  //     name: '[CT Script Loading]',
  //     rgx: 'CraftTweaker2',
  //     step: 'Other',
  //     time: sum(scriptLoading.map(([,n]) => Number.parseFloat(n ?? '0') / 1000)),
  //   }, log)
  // }

  await addParts(result, {
    name: '[Oredict Melting]',
    rgx: /Tinkers' Construct|Tinkers' Antique/,
    step: 'Other',
    time: Number.parseFloat(debug_log.match(
      /Oredict melting recipes finished in (\d+\.\d+) ms/,
    )?.[1] ?? '0') / 1000,
  }, log)

  const lines = debug_log.split('\n')
  const duration = logLineDuration(lines, '\\[tconstruct-TextureGen\\]: Generated \\d+ Textures for Materials')
  if (duration > 0) {
    await addParts(result, {
      name: '[TCon Textures]',
      rgx: /^Tinkers' Construct|Tinkers' Antique/,
      step: 'Other',
      time: duration,
    }, log)
  }

  // Sort object
  result = Object.fromEntries(Object.entries(result)
    .sort(([,{ steps: a }], [,{ steps: b }]) => sum(b) - sum(a)))

  return result
}

export function getMcLoadTime(debug_log: string): number {
  const listOfLoadTime = [...debug_log.matchAll(mcFinishLoadingRgx)].map(([,,v]) => Number.parseFloat(v))
  return Math.max(0, ...listOfLoadTime)
}

let jeiPluginsCache: Record<string, number>

export async function getJeiPlugins(debug_log: string, log: typeof logger) {
  if (jeiPluginsCache)
    return jeiPluginsCache

  const pluginRgx = /\[(?:jei|Had\s?Enough\s?Items)\]: Registered +plugin: (?<name>.*) in (?<time>\d+) ms/g
  const jeiPlugins: { name: string, time: number }[] = []
  for (const { groups } of debug_log.matchAll(pluginRgx)) {
    const { name, time } = groups as { [key: string]: string }

    // Filter plugins with same name (happens with /ct jeiReload command)
    if (jeiPlugins.find(o => o.name === name))
      continue

    jeiPlugins.push({ name, time: Number.parseInt(time) / 1000 })
  }

  jeiPlugins.sort(({ time: a }, { time: b }) => b - a)

  // const showPlugins = 15 // options.plugins
  jeiPluginsCache = Object.fromEntries(jeiPlugins
    // .slice(0, showPlugins)
    // .concat([{
    //   name: `Other ${jeiPlugins.length - showPlugins} Plugins`,
    //   time: jeiPlugins
    //     .slice(showPlugins)
    //     .map(o => o.time)
    //     .reduce((a, v) => a + v),
    // }])
    .map(o => [o.name, o.time]))

  if (jeiPluginsCache.length <= 0) {
    await log.info(`Cannot find any of ${chalk.hex('c2aa0e')('JEI')} plugins`)
  }

  return jeiPluginsCache
}

async function addParts(mods: ModStore, part: {
  name: string
  rgx: string | RegExp
  step: keyof typeof loaderSteps | 'Other'
  time: number
}, log: typeof logger) {
  // eslint-disable-next-line unicorn/prefer-number-properties
  if (!part.time || isNaN(part.time)) {
    return await log.info(`Didnt add mod `
      + `"${chalk.hex('c2aa0e')(part.name)}" part of mod `
      + `${chalk.hex('94852e')(part.rgx)} since it took 0 sec or less`)
  }

  const entry = Object.entries(mods).find(([modName]) =>
    typeof part.rgx === 'string'
      ? modName === part.rgx
      : part.rgx.test(modName))

  if (!entry) {
    return await log.warn(`Could not find part `
      + `"${chalk.hex('c2aa0e')(part.name)}" with regex `
      + `${chalk.hex('94852e')(part.rgx)}`)
  }

  const [modName, mod] = entry

  const fmlStepsKeys = Object.keys(loaderSteps)
  if (part.step === 'Other') {
    mod.steps[fmlStepsKeys.length] += part.time
  }
  else {
    const stepIndex = fmlStepsKeys.indexOf(part.step)
    if (mod.steps[stepIndex] - part.time < 0) {
      await log.info(
        `${chalk.hex('558855').bold(modName)} `
        + `step ${part.step} `
        + `time: ${chalk.hex('558855')(mod.steps[stepIndex])}s, but `
        + `'${chalk.hex('558855').bold(part.name)}' is `
        + `${chalk.hex('558855')(part.time)}s.`,
      )
    }
    else {
      mod.steps[stepIndex] -= part.time
    }
  }

  mod.parts ??= []
  mod.parts.push({
    color: Color(`#${mod.color}`).darken(0.15).hex().slice(1),
    time: part.time,
    name: part.name,
  })
}

function toSeconds(groups?: { [key: string]: string }) {
  if (!groups)
    return 0
  return groups.time === 's'
    ? Number.parseFloat(groups.num)
    : Number.parseFloat(groups.num) / 1000.0
}

const fmlStuffRegexps = [
  /\[Client thread\/DEBUG\] \[FML\]: Bar Finished: (?<name>.*) took (?<time>\d+\.\d+)s/g,
  /(?<name>\[VintageFix\]: Texture search) took (?<time>\d+\.\d+) s, total of(?<r1> \d+) collected (?<r2>sprites)/g,
  /\[Client thread\/INFO\] \[VintageFix\]: (?<name>Preloaded \d+ sprites) in (?<time>\d+(\.\d+)?) s/g,
]

export function getFmlStuff(debug_log: string): Part[] {
  const bars: { [key: string]: number } = {}

  for (const rgx of fmlStuffRegexps) {
    for (const { groups } of debug_log.matchAll(rgx)) {
      const { name, time, ...desc } = groups!
      const namePure = name
        .replace(/\$.*/, '') // Metadata
        .replace(/ - done/, '') // done message

      if (/Applying remove (?:recipes without ingredients|recipe actions).*|^Loading$/.test(namePure))
        continue

      const timePure = Number.parseFloat(time)
      const nameAndDesc = namePure + Object.values(desc).join(' ')
      bars[nameAndDesc] ??= 0
      bars[nameAndDesc] += timePure
    }
  }

  const fmlStuffBars = Object.entries(bars)
    .filter(([name]) => !Object.values(loaderSteps)
      .some(rgx => name.match(rgx.source.replace(/ - .*/, ''))))

  let colPointer = Color('orange').rotate(-20).darken(0.4)

  return fmlStuffBars
    // .filter(([,time]) => time >= 0.01)
    .map(([name, time]) => ({
      color: (colPointer = colPointer.rotate(4)).hex().slice(1),
      name,
      time,
    }))
}

function logLineDuration(lines: string[], rgxText: string): number {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const currTime = line.match(
      new RegExp(`^\\[(\\d+:\\d+:\\d+)\\] \\[[^\\]]+\\] ${rgxText}`),
    )?.[1]
    if (!currTime)
      continue
    for (let j = i - 1; j >= 0; j--) {
      const prevTime = lines[j].match(/^\[(\d+:\d+:\d+)\]/)?.[1]
      if (!prevTime)
        continue
      const diffTime = timeToSeconds(currTime) - timeToSeconds(prevTime)
      if (diffTime > 0)
        return diffTime
    }
    break
  }
  return 0
}
