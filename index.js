/**
 * @file Collect information about load time from Debug.log
 * and output it in .MD file
 *
 * @author Krutoy242
 * @link https://github.com/Krutoy242
 */

// @ts-check


import { writeFileSync } from 'fs'
import { escapeRegex, loadText, defaultHelper } from '../lib/utils.js'
import _ from 'lodash'
import numeral from 'numeral'
import Color from 'color'
import ColorHash from 'color-hash'
import memoize from 'memoizee'

import { URL, fileURLToPath  } from 'url' // @ts-ignore
function relative(relPath='./') { return fileURLToPath(new URL(relPath, import.meta.url)) }

import yargs from 'yargs'
const argv = yargs(process.argv.slice(2))
  .alias('u', 'unlisted').describe('u', 'Output unlisted tooks in console')
  .alias('i', 'input').describe('i', 'Debug.log path').string('i').default('i', 'logs/debug.log')
  .alias('o', 'output').describe('o', 'Output file path').string('o')
  .argv

// @ts-ignore
const colorHash = new (ColorHash.default)({lightness: [0.2625, 0.375, 0.4875]});

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
 * @param {string} debug_log_path
 * @return {[modName: string, loadTime: number, fileName: string][]}
 */  
(debug_log_path='logs/debug.log') => {
  const debug_log = loadText(debug_log_path)

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
})

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

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
export async function init(h=defaultHelper, options=argv) {

  //############################################################################
  // Numbers

  await h.begin('Parsing debug.log')
  const debug_log = loadText(options['input'])
  const time_arr = getModLoadTimeTuples(options['input'])

  var get_totalLoadTime    = memoize(() => Math.max(0,...[...debug_log.matchAll(/\[FML\]: Bar Finished: Loading took (.*)s/g)].map(([,v])=>parseFloat(v))))
  var get_totalLoadTimeMin = memoize(() => {const min = Math.floor(get_totalLoadTime() / 60); return `${min}:${Math.floor(get_totalLoadTime()) - min*60}`})
  var get_totalModsTime    = memoize(() => _.sumBy(time_arr, '1'))
  var get_totalStuffTime   = memoize(() => get_totalLoadTime() - get_totalModsTime())
  

  await h.begin('Looking for JEI plugins')
  const jeiPlugins = [...debug_log.matchAll(/\[jei\]: Registered +plugin: (.*) in (\d+) ms/g)]
      .map(/** @return {[string, number]} */([, pluginName, time]) => [pluginName, parseInt(time)/1000])
      .sort(([,a],[,b])=>b-a)

  const showPlugins = options['showPlugins'] ?? 15
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
  await h.begin('Mods loading time')
  const pieMods = 20
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
  const ct_scriptTime = parseFloat(
    loadText('crafttweaker.log')
    .match(/\[INITIALIZATION\]\[CLIENT\]\[INFO\] Completed script loading in: (\d+)ms/m)[1]
  ) / 1000
  spliceModLoadArray('CraftTweaker2', 'Script Loading', ct_scriptTime)

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
  await h.begin('FML steps details')
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
  await h.begin('FML stuff')
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
<img src="https://quickchart.io/chart?${w?`w=${w}&`:''}${h?`h=${h}&`:''}c=${c}"/>
</p>

<br>
`
  }

  /**
   * Create array of templates
   * @param {object} options
   * @returns {string[]}
   */
  var composeTempelates = (options) => [

  /* html */`## Minecraft load time benchmark
${options.modpackName ? '\n### ' + options.modpackName : ''}

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

  await h.begin('Writing file')

  writeFileSync(
    relative('data/benchmark.md'),
    composeTempelates(options).join('\n')
  )


  argv['unlisted'] && console.log(
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

  h.result(`Load Time total: ${get_totalLoadTime()}`)

}

// @ts-ignore
if(import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) init()
