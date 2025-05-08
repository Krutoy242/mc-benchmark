import type logger from './log'
import chalk from 'chalk'
import Color from 'color'
import ColorHash from 'color-hash'

// @ts-expect-error default

const colorHash = new (ColorHash.default ?? ColorHash)({ lightness: [0.2625, 0.375, 0.4875] })

function escapeRegex(str: string) {
  return str.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export const fmlSteps = {
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
  Object.values(fmlSteps).map(l => l.source).join('|')
})`

export interface Mod {
  time: number
  loaderSteps: number[]
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
    // Stuff: {
    //   rgx: /Sending event FMLConstructionEvent to mod minecraft/,
    // },
    Construction: {
      rgx: /Sending event FMLPreInitializationEvent to mod minecraft/,
    },
    PreInit: {
      rgx: /Sending event FMLInitializationEvent to mod minecraft/,
    },
    // Init: {
    //   rgx: /\[Foundation\]/,
    // },
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
      time: 0,
      loaderSteps: Object.keys(fmlSteps).map(() => 0.0),
      color: colorHash.hex(modName).slice(1),
    }

    const stepIndex = Object.values(fmlSteps).findIndex(rgx => stepName.match(rgx))
    const time = Number.parseFloat(timeStr)
    result[modName].loaderSteps[stepIndex] += time
    result[modName].time += time
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
    time: toSeconds(debug_log.match(
      /\[(?:jei|Had\s?Enough\s?Items)\]: Building ingredient filter (?:and search trees )?took (?<num>\d+\.\d+) (?<time>m?s)/,
    )?.groups),
  }, log)

  const jeiPlugins = Object.values(await getJeiPlugins(debug_log, log))
  if (jeiPlugins.length) {
    await addParts(result, {
      name: '[JEI Plugins]',
      rgx: /(Just|Had) Enough Items/i,
      time: jeiPlugins.reduce((a, v) => a + v),
    }, log)
  }

  await addParts(result, {
    name: '[VF Sprite preload]',
    rgx: /VintageFix/i,
    time: Number.parseFloat(debug_log.match(
      /\[Client thread\/INFO\] \[VintageFix\]: Preloaded \d+ sprites in (\d+(?:\.\d+)?) s/,
    )?.[1] ?? '0'),
  }, log)

  if (crafttweaker_log) {
    const scriptLoading = [...crafttweaker_log.matchAll(
      /\[.+?\]\[CLIENT\]\[\w+\] Completed script loading in: (\d+)ms/g,
    )]
    await addParts(result, {
      name: '[CT Script Loading]',
      rgx: 'CraftTweaker2',
      time: scriptLoading.map(([,n]) => Number.parseFloat(n ?? '0') / 1000).reduce((a, v) => a + v),
    }, log)
  }

  await addParts(result, {
    name: '[Oredict Melting]',
    rgx: /Tinkers' Construct|Tinkers' Antique/,
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
      time: duration,
    }, log)
  }

  // Sort object
  result = Object.fromEntries(Object.entries(result)
    .sort(([,{ time: a }], [,{ time: b }]) => b - a))

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

  if (mod.time + part.time < 0) {
    await log.info(
      `${chalk.hex('558855').bold(modName)} `
      + `totalTime: ${chalk.hex('558855')(mod.time)}s, but `
      + `'${chalk.hex('558855').bold(part.name)}' is `
      + `${chalk.hex('558855')(part.time)}s.`,
    )
  }
  else {
    mod.time += part.time
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

export function getFmlStuff(debug_log: string): Part[] {
  const bars: { [key: string]: number } = {}

  for (const [,nameRaw, timeRaw] of debug_log.matchAll(
    /\[Client thread\/DEBUG\] \[FML\]: Bar Finished: (.*) took (\d+\.\d+)s/g,
  )) {
    const name = nameRaw
      .replace(/\$.*/, '') // Metadata
      .replace(/ - done/, '') // done message
    const time = Number.parseFloat(timeRaw)
    bars[name] ??= 0
    bars[name] += time
  }

  const fmlStuffBars = Object.entries(bars)
    .filter(([name]) => !Object.values(fmlSteps)
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
