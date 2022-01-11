#!/usr/bin/env node

/**
 * @file Collect information about load time from Debug.log
 * and output it in .MD file
 *
 * @author Krutoy242
 * @link https://github.com/Krutoy242
 */

// @ts-check


import { writeFileSync, readFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import _ from 'lodash'
import numeral from 'numeral'
import Color from 'color'
import ColorHash from 'color-hash'
import memoize from 'memoizee'
import chalk from 'chalk'

import yargs from 'yargs'
const { argv } = yargs(process.argv.slice(2))
  .option("i", {
    alias: "input",
    type: "string",
    describe: "Debug.log path",
    default: 'logs/debug.log',
  })
  .option("c", {
    alias: "ctlog",
    type: "string",
    describe: "crafttweaker.log path",
    default: 'crafttweaker.log',
  })
  .option("o", {
    alias: "output",
    type: "string",
    describe: "Output file path",
    default: 'benchmark.md',
  })
  .option("n", {
    alias: "nospaces",
    type: "boolean",
    describe: 'Replace all space characters "\\s" in image code. Useful for posting on GitHub.',
    default: false,
  })
  .option("d", {
    alias: "detailed",
    type: "number",
    describe: "Count of detailed mods in main pie chart",
    default: 20,
  })
  .option("p", {
    alias: "plugins",
    type: "number",
    describe: "Plugin count to show in 'JEI plugins' section",
    default: 15,
  })
  .option("m", {
    alias: "modpack",
    type: "string",
    describe: "Modpack name in header",
  })
  .option("cwd", {
    type: "string",
    describe: "Minecraft directory to OPEN files from",
    default: './',
  })
  .option("u", {
    alias: "unlisted",
    type: "boolean",
    describe: "Output unlisted tooks in console",
    default: false,
  })
  .version(false)
  .help('h')
  .wrap(null)

// @ts-ignore
const colorHash = new (ColorHash.default)({lightness: [0.2625, 0.375, 0.4875]});

function escapeRegex(string) {
  return string.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')
}


//############################################################################
//############################################################################

const fml_steps = 
`Construction - 
Loading Resources - FMLFileResourcePack:
PreInitialization - 
Initialization - 
InterModComms$IMC - 
PostInitialization - 
LoadComplete - 
ModIdMapping - `
.split('\n')
const fml_steps_rgx = `(${fml_steps.map(l=>escapeRegex(l)).join('|')})`


/**
 * Chart with loading time
 * @type {{[mod: string]: number[]}} Time taken for each FML step
 */
const chart_obj = {}

export const getModLoadTimeTuples = memoize(
/**
 * @param {string} debug_log
 * @return {[modName: string, loadTime: number, fileName: string][]}
 */
(debug_log) => {
  const fullSearchRgx = new RegExp(
    escapeRegex('[Client thread/DEBUG] [FML]: Bar Step: ') + fml_steps_rgx + '(.+) took (\\d+.\\d+)s', 'gmi'
  )
  for (const match of debug_log.matchAll(fullSearchRgx)) {
    const [, step, mod, time] = match
    chart_obj[mod] ??= new Array(fml_steps.length).fill(0.0)
    chart_obj[mod][fml_steps.indexOf(step)] += parseFloat(time)
  }

  const chart_arr = Object.entries(chart_obj)
  chart_arr.sort(([,a],[,b])=>_.sum(b)-_.sum(a))

  // Get file for every mod
  /** @type {{[modName: string]: string}} */
  const mod_fileNames = {}
  for (const {groups} of debug_log.matchAll(
    /\[Client thread\/DEBUG\] \[FML\]: 	[^(]+\((?<modName>.+):[^)]+\): (?<fileName>.+?\.jar) \(.*\)/gmi)
  ) {
    mod_fileNames[groups.modName] = groups.fileName
  }

  return chart_arr.map(([modName, steps])=>[modName, _.sum(steps), mod_fileNames[modName]])
}, { primitive: true })

/**
 * @param {() => string[]} fn
 */
var memoizeWrap = (fn) => memoize(()=>'`\n' + fn().join(';\n') + '\n`')

var get_fml_steps = memoizeWrap(()=>fml_steps
  .map(s=>s.replace(/[ -:]*$| - .*$/,''))
  .map((step,i)=>`${i+1}: ${step}`)
)

/**
 * Make pretty number
 * @param {string | number} n Numeric-like value
 */
function num(n) {
  return numeral(typeof n == 'string' ? parseFloat(n) : n).format('0.00').padStart(6)
}

const defaultLogger = {
  begin: function (s, steps) {
    // @ts-ignore
    this.done()
    if(steps) (this.steps = steps, this.stepSize = steps / 30)
    process.stdout.write(`🔹 ${s.trim()}` + (steps?` [${steps}] `:''))
    this.isUnfinishedTask = true
  },
  done: function (s='') {
    if(!this.isUnfinishedTask) return
    process.stdout.write(` ${chalk.gray(`${s} ✔`)}\n`)
    this.isUnfinishedTask = false
  },
  step: function (s='.') {
    if(this.steps <= 30 || (this.steps-- % this.stepSize === 0)) {
      process.stdout.write(s)
    }
  },
  result: function (s='') {
    this.done()
    process.stdout.write(`✔️ ${chalk.dim.green(`${s}`)}\n`)
  },
  warn : function (...s) { this.done(); process.stdout.write(`⚠️ ${chalk.dim.yellow(`${s.join('\t')}`)}\n`) },
  error: function (...s) { this.done(); process.stdout.write(`🛑 ${chalk.dim.red   (`${s.join('\t')}`)}\n`) },

  isUnfinishedTask: false,
}

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝

/**
 * 
 * @param {{[key:string]: any}} _options
 * @returns {Promise<void>}
 */
export default async function parseDebugLog(_options=argv) {

  /** @type {{[key:string]: any}} */
  const options = {
    input: 'logs/debug.log',
    ctlog: 'crafttweaker.log',
    plugins: 15,
    detailed: 20,
    cwd: './',
    mkdirSync,
    readFileSync,
    writeFileSync,
    output: 'benchmark.md',

    ..._options
  }
  
  function loadText(/** @type {string} */ fpath) {
    return options.readFileSync(resolve(options.cwd??'./', fpath), 'utf8')
  }

  function saveText(txt, filename) {
    options.mkdirSync(dirname(filename), { recursive: true })
    options.writeFileSync(filename, txt)
  }

  const /** @type {typeof defaultLogger} */ log = options.defaultLogger ?? defaultLogger

  //############################################################################
  // Numbers

  
  await log.begin('Opening debug.log')
  let debug_log
  try {
    debug_log = loadText(options.input)
  } catch (error) {
    return await log.error(`Can't open input file "${options.input}". Use option "--input=path/to/debug.log"`)
  }

  const time_arr = getModLoadTimeTuples(debug_log)

  if(!time_arr.length) {
    if(!debug_log.match(/\[main\/DEBUG\] \[FML\]/)) {
      return await log.error(`The file "${options.input}" does not contain rich debugging information. It is most likely not actual debug.log.\n\nHint:\nSome MC launchers disable generating of debug.log file by default. Find out how to enable it.`)
    } else {
      return await log.error(`The file "${options.input}" not full. Your Minecraft not loaded completely or file is corrupted.`)
    }
  }

  const get_totalLoadTime    = memoize(() => Math.max(0,...[...debug_log.matchAll(/\[FML\]: Bar Finished: Loading took (.*)s/g)].map(([,v])=>parseFloat(v))))
  const get_totalLoadTimeMin = memoize(() => {const min = Math.floor(get_totalLoadTime() / 60); return `${min}:${Math.floor(get_totalLoadTime()) - min*60}`})
  const get_totalModsTime    = memoize(() => _.sumBy(time_arr, '1'))
  const get_totalStuffTime   = memoize(() => get_totalLoadTime() - get_totalModsTime())
  

  await log.begin('Looking for JEI plugins')
  const jeiPlugins = [...debug_log.matchAll(/\[jei\]: Registered +plugin: (.*) in (\d+) ms/g)]
      .map(/** @return {[string, number]} */([, pluginName, time]) => [pluginName, parseInt(time)/1000])
      .sort(([,a],[,b])=>b-a)

  const showPlugins = options.plugins
  var get_jei_plugins = memoizeWrap(()=>jeiPlugins
    .slice(0,showPlugins)
    .concat([[
      'Other '+(jeiPlugins.length-showPlugins)+' Plugins',
      _.sumBy(jeiPlugins.slice(showPlugins),'1')
    ]])
    .map(([a,b])=>num(b)+': '+a)
  )

  //############################################################################
  // Chart 1
  await log.begin('Mods loading time')
  const pieMods = options.detailed
  const instantMods = time_arr.filter(m=>m[1]<0.1)
  const fastMods    = time_arr.filter(m=>m[1]>=0.1 && m[1]<=1.0)
  const otherMods   = time_arr.slice(pieMods).filter(m=>m[1]>1.0)
  const modLoadArray = time_arr
    .slice(0, pieMods)
    .map(/** @return {[string, number, string]} */([modName, total])=>[colorHash.hex(modName).slice(1), total, modName])
    .concat([
      ['444444', _(otherMods).sumBy('1'),   otherMods.length   + ' Other mods'],
      ['333333', _(fastMods).sumBy('1'),    fastMods.length    + ' \'Fast\' mods (load 1.0s - 0.1s)'],
      ['222222', _(instantMods).sumBy('1'), instantMods.length + ' \'Instant\' mods (load %3C 0.1s)'],
    ])

  /**
   * @param {string} entryName
   * @param {string} description
   * @param {number} timeReduce
   */
  function spliceModLoadArray(entryName, description, timeReduce) {
    const entry = modLoadArray.find(e=>e[2]===entryName)
    if(!entry) return

    if(!timeReduce || isNaN(timeReduce)) return
    const [eColor, eTime, eName] = entry

    modLoadArray.splice(
      modLoadArray.indexOf(entry),
      1,
      [eColor, eTime-timeReduce, eName],
      [
        Color('#'+eColor).darken(0.1).hex().slice(1),
        timeReduce,
        eName + ` (${description})`
      ]
    )
  }

  // Split JEI
  spliceModLoadArray('Just Enough Items', 'Ingredient Filter', parseFloat(
    debug_log.match(/\[jei\]: Building ingredient filter took (\d+\.\d+) s/)?.[1]
  ))
  spliceModLoadArray('Just Enough Items', 'Plugins', _.sumBy(jeiPlugins,'1'))

  // Split CraftTweaker
  try {
    spliceModLoadArray('CraftTweaker2', 'Script Loading', parseFloat(
      loadText('crafttweaker.log')
      .match(/\[INITIALIZATION\]\[CLIENT\]\[INFO\] Completed script loading in: (\d+)ms/m)[1]
    ) / 1000)
  } catch (error) {
    await log.warn(`Can't open crafttweaker.log file "${options.ctlog}". Use option "--ctlog=path/to/crafttweaker.log"`)
  }

  // Split Tcon
  spliceModLoadArray(
    'Tinkers\' Construct',
    'Oredict Melting',
    parseFloat(
      debug_log.match(/Oredict melting recipes finished in (\d+\.\d+) ms/)?.[1]
    ) / 1000
  )

  var get_mods_loading_time_parsed = memoizeWrap(()=>modLoadArray
    .map(([col, time, name])=>`${col} ${num(time)}s ${name}`)
  )
  

  //############################################################################
  // Chart 2
  await log.begin('FML steps details')
  const showDetails = 12
  const detailedNames = time_arr
    .map(([m])=>m)
    .filter(m=>![
      'Just Enough Items',
      'Minecraft Forge',
      'Forge Mod Loader',
    ].includes(m))
    .slice(0,showDetails)
  const maxNameLen = _.maxBy(detailedNames, 'length').length
  const detailedLines = detailedNames.map(modName=>`${
      modName.padEnd(maxNameLen)
    } |${
      chart_obj[modName].map(num).join('|')
    }`)

  var get_fml_steps_details = memoizeWrap(()=>[
    ''.padEnd(maxNameLen+2) + fml_steps.map((_,i)=>(i+1+'  ').padStart(6)).join(' '),
    ...detailedLines
  ])

  //############################################################################
  // Chart ??
  await log.begin('FML stuff')
  const fmlStuffLookupsRgx = '('+
  `Loading sounds
  Loading Resource - SoundHandler
  ModelLoader: blocks
  ModelLoader: items
  ModelLoader: baking
  Applying remove recipe actions
  Applying remove furnace recipe actions
  Indexing ingredients`
  .split('\n').map(l=>escapeRegex(l.trim())).join('|')
  +')'
  const fmlSomethingTook = [...debug_log.matchAll(/\[Client thread\/DEBUG\] \[FML\]: (.*) took (\d+\.\d+)s/g)]
  const fmlStuffBars = fmlSomethingTook
    .map(/** @return {[string, number]} */([, name, time]) => [name, parseFloat(time)])
    .filter(([name])=>name.match(new RegExp('Bar Finished: '+fmlStuffLookupsRgx)))

  const otherFmlStuffTime = get_totalStuffTime() - _.sumBy(fmlStuffBars, '1')
  fmlStuffBars.push(['Other',otherFmlStuffTime])

  let colPointer = Color('orange').rotate(-20).darken(0.4)

  var get_fml_stuff_table = memoizeWrap(()=>
  fmlStuffBars.map(([name,time],i)=>`${
    i!=fmlStuffBars.length-1
      ? (colPointer=colPointer.rotate(4)).hex().slice(1)
      : '444444'
  } ${
    num(time)+'s'
  } ${
    name.replace(/Bar Finished: /,'')
  }`)
  )

  

  // ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗███████╗
  // ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝
  //    ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  ███████╗
  //    ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ╚════██║
  //    ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗███████║
  //    ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝

  /*

  Note for image scripts:
  - Newlines are ignored
  - This characters cant be used: +<"%#

  */

  /**
   * 
   * @param {number} w Image width
   * @param {number} h Image height
   * @param {string} c JavaScript object in string form
   */
  function quickchartTemplate(name, w, h, c) {
    return /* html */`${name ? '# '+name:''}
<p align="center">
<img src="https://quickchart.io/chart?${w?`w=${w}&`:''}${h?`h=${h}&`:''}c=${
  options.nospaces ? c.replace(/\s+/gm,'%20') : c
}"/>
</p>

<br>
`
  }

  /**
   * Create array of templates
   * @returns {string[]}
   */
  var composeTempelates = () => [

  /* html */`## Minecraft load time benchmark
${options.modpack ? '\n### ' + options.modpack : ''}

---

<p align="center" style="font-size:160%;">
MC total load time:<br>
${num(get_totalLoadTime())+' sec'}
<br>
<sup><sub>(
${get_totalLoadTimeMin()+' min'}
)</sub></sup>
</p>

<br>
`,

  ///////////////////////////////////////////////////////////////
  // Wide bar with two values
  ///////////////////////////////////////////////////////////////
  quickchartTemplate(null, 400, 30, /* js */`{
  type: 'horizontalBar',
  data: {
    datasets: [
      {label:      'MODS:', data: [${num(get_totalModsTime() )}]},
      {label: 'FML stuff:', data: [${num(get_totalStuffTime())}]}
    ]
  },
  options: {
    scales: {
      xAxes: [{display: false,stacked: true}],
      yAxes: [{display: false,stacked: true}],
    },
    elements: {rectangle: {borderWidth: 2}},
    legend: {display: false,},
    plugins: {datalabels: {color: 'white',formatter: (value, context) =>
      [context.dataset.label, value].join(' ')
    }}
  }
}`),

  ///////////////////////////////////////////////////////////////
  // Pie Chart with most loaded mods
  ///////////////////////////////////////////////////////////////
  quickchartTemplate('Mods Loading Time', 400, 300, /* js */`{
  type: 'outlabeledPie',
  options: {
    cutoutPercentage: 25,
    plugins: {
      legend: !1,
      outlabels: {
        stretch: 5,
        padding: 1,
        text: (v,i)=>[
          v.labels[v.dataIndex],' ',
          (v.percent*1000|0)/10,
          String.fromCharCode(37)].join('')
      }
    }
  },
  data: {...
${get_mods_loading_time_parsed()}
    .split(';').reduce((a, l) => {
      l.match(/(\\w{6}) *(\\d*\\.\\d*)s (.*)/)
      .slice(1).map((a, i) => [[String.fromCharCode(35),a].join(''), parseFloat(a), a][i])
      .forEach((s, i) => 
        [a.datasets[0].backgroundColor, a.datasets[0].data, a.labels][i].push(s)
      );
      return a
    }, {
      labels: [],
      datasets: [{
        backgroundColor: [],
        data: [],
        borderColor: 'rgba(22,22,22,0.3)',
        borderWidth: 1
      }]
    })
  }
}`),

  ///////////////////////////////////////////////////////////////
  // Colored Columns for each mod
  ///////////////////////////////////////////////////////////////
  quickchartTemplate('Top Mods Details (except JEI, FML and Forge)', 400, 450, /* js */`{
  options: {
    scales: {
      xAxes: [{stacked: true}],
      yAxes: [{stacked: true}],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: 'white',
        backgroundColor: 'rgba(46, 140, 171, 0.6)',
        borderColor: 'rgba(41, 168, 194, 1.0)',
        borderWidth: 0.5,
        borderRadius: 3,
        padding: 0,
        font: {size:10},
        formatter: (v,ctx) => 
          ctx.datasetIndex!=ctx.chart.data.datasets.length-1 ? null
            : [((ctx.chart.data.datasets.reduce((a,b)=>a- -b.data[ctx.dataIndex],0)*10)|0)/10,'s'].join('')
      },
      colorschemes: {
        scheme: 'office.Damask6'
      }
    }
  },
  type: 'bar',
  data: {...(() => {
    let a = { labels: [], datasets: [] };
${get_fml_steps()}
    .split(';')
      .map(l => l.match(/\\d: (.*)/).slice(1))
      .forEach(([name]) => a.datasets.push({ label: name, data: [] }));
${get_fml_steps_details()}
    .split(';').slice(1)
      .map(l => l.split('|').map(s => s.trim()))
      .forEach(([name, ...arr], i) => {
        a.labels.push(name);
        arr.forEach((v, j) => a.datasets[j].data[i] = v)
      }); return a
  })()}
}`),

  ///////////////////////////////////////////////////////////////
  // Blue chart with horisontal bars
  ///////////////////////////////////////////////////////////////
  quickchartTemplate('TOP JEI Registered Plugis', 700, null, /* js */`{
  options: {
    elements: { rectangle: { borderWidth: 1 } },
    legend: false
  },
  type: 'horizontalBar',
    data: {...(() => {
      let a = {
        labels: [], datasets: [{
          backgroundColor: 'rgba(0, 99, 132, 0.5)',
          borderColor: 'rgb(0, 99, 132)',
          data: []
        }]
      };
${get_jei_plugins()}
        .split(';')
        .map(l => l.split(':'))
        .forEach(([time, name]) => {
          a.labels.push(name);
          a.datasets[0].data.push(time)
        })
        ; return a
    })()
  }
}`),

  ///////////////////////////////////////////////////////////////
  // Yellow donut with FML parts
  ///////////////////////////////////////////////////////////////
  quickchartTemplate('FML Stuff', 500, 400, /* js */`{
  options: {
    rotation: Math.PI,
    cutoutPercentage: 55,
    plugins: {
      legend: !1,
      outlabels: {
        stretch: 5,
        padding: 1,
        text: (v)=>v.labels
      },
      doughnutlabel: {
        labels: [
          {
            text: 'FML stuff:',
            color: 'rgba(128, 128, 128, 0.5)',
            font: {size: 18}
          },
          {
            text: [${num(get_totalStuffTime())},'s'].join(''),
            color: 'rgba(128, 128, 128, 1)',
            font: {size: 22}
          }
        ]
      },
    }
  },
  type: 'outlabeledPie',
  data: {...(() => {
    let a = {
      labels: [],
      datasets: [{
        backgroundColor: [],
        data: [],
        borderColor: 'rgba(22,22,22,0.3)',
        borderWidth: 2
      }]
    };
${get_fml_stuff_table()}
    .split(';')
      .map(l => l.match(/(\\w{6}) *(\\d*\\.\\d*)s (.*)/))
      .forEach(([, col, time, name]) => {
        a.labels.push([name, ' ', time, 's'].join(''));
        a.datasets[0].data.push(parseFloat(time));
        a.datasets[0].backgroundColor.push([String.fromCharCode(35), col].join(''))
      })
      ; return a
  })()}
}`),


  ]



  //############################################################################
  //############################################################################

  await log.begin('Writing file')

  try {
    saveText(
      composeTempelates().join('\n'),
      options.output
    )
  } catch (error) {
    await log.error(`Can't save output file "${options.output}". Use option "--output=path/to/benchmark.md"`)
  }


  options.unlisted && console.log(
    '\nFML timings:\n'+
    [...debug_log.matchAll(/\[Client thread\/DEBUG\] \[FML\]: (.*) took (\d+\.\d+)s/g)]
    .map(/** @return {[string, number]} */([, stepName, time]) => [stepName, parseFloat(time)])
    .filter(([,time]) => time > 0.5)
    .filter(([stepName])=>
      !stepName.match(new RegExp('Bar Step: '+fml_steps_rgx+'.*')) &&
      !stepName.match(new RegExp('Bar Finished: '+fml_steps_rgx.replace(/ - /g,''))) &&
      !stepName.match(new RegExp('Bar Finished: '+fmlStuffLookupsRgx))
    )
    .map(([stepName, time]) => `${stepName.padEnd(60)}: ${num(time)}s`)
    .join('\n')
  )

  log.result(`Load Time total: ${get_totalLoadTime()}`)

}

// @ts-ignore
if(import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) parseDebugLog()
