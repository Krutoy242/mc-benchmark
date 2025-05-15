## Minecraft load time benchmark

---

<p align="center" style="font-size:160%;">
MC total load time:<br>
285 sec
<br>
<sup><sub>(
4:45 min
)</sub></sup>
</p>

<br>
<!--
Note for image scripts:
  - Newlines are ignored
  - This characters cant be used: +<"%#
-->
<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=60&c={type:'horizontalBar',data:{datasets:[{label:'Mixins\n',data:[36.0]},{label:'Construction\n',data:[58.0]},{label:'PreInit\n',data:[137.0]},{label:'Init\n',data:[52.0]},]},options:{layout:{padding:{top:10}},scales:{xAxes:[{display:false,stacked:true}],yAxes:[{display:false,stacked:true}],},elements:{rectangle:{borderWidth:2}},legend:{display:false},plugins:{datalabels:{color:'white',font:{family:'Consolas',},formatter:(value,context)=>[context.dataset.label,value,'s'].join('')}},annotation:{clip:false,annotations:[{type:'line',scaleID:'x-axis-0',value:36,borderColor:'black',label:{content:'Windowappear',fontSize:8,enabled:true,xPadding:8,yPadding:2,yAdjust:-20},}]},}}"/>
</p>

<br>

# Mods Loading Time

<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=300&c={ type: 'outlabeledPie', options: { rotation: Math.PI, cutoutPercentage: 25, plugins: { legend: !1, outlabels: { stretch: 5, padding: 1, text: (v,i)=>[ v.labels[v.dataIndex],' ', (v.percent*1000|0)/10, String.fromCharCode(37)].join('') } } }, data: {... `  5161a8   7.71s CraftTweaker2;  436e17   7.19s Had Enough Items;  395E14   1.20s [JEI Ingredient Filter];  395E14   6.75s [JEI Plugins];  516fa8   6.73s Ender IO;  8f304e   6.8 s Astral Sorcery;  6e5e17   5.73s Tinkers' Antique;  5E5014   4.0 s [TCon Textures];  813e81   5.36s OpenComputers;  a651a8   5.24s IndustrialCraft 2;  213664   3.9 s Forestry;  216364   2.98s Thermal Expansion;  cd922c   2.96s NuclearCraft;  436e17   2.81s Integrated Dynamics;  ba3eb8   2.60s Cyclic;  308f7e   2.34s Quark: RotN Edition;  3e7d81   2.17s ProbeZS;  3e8160   2.10s The Twilight Forest;  3e68ba   1.99s AE2 Unofficial Extended Life;  444444  30.63s 21 Other mods;  333333  45.35s 145 'Fast' mods (1.0s - 0.1s);  222222   8.5 s 300 'Instant' mods (%3C 0.1s)  ` .split(';').reduce((a, l) => { l.match(/(\w{6}) *(\d*\.\d*) ?s (.*)/s) .slice(1).map((a, i) => [[String.fromCharCode(35),a].join(''), a, a.length > 15 ? a.split(/(?%3C=.{9})\s(?=\S{5})/).join('\n') : a ][i]) .forEach((s, i) => [a.datasets[0].backgroundColor, a.datasets[0].data, a.labels][i].push(s) ); return a }, { labels: [], datasets: [{ backgroundColor: [], data: [], borderColor: 'rgba(22,22,22,0.3)', borderWidth: 1 }] }) } }"/>
</p>

<br>

# Loader steps

Show how much time each mod takes on each game load phase.

JEI/HEI not included, since its load time based on other mods and overal item count.

<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=450&c={ options: { scales: { xAxes: [{stacked: true}], yAxes: [{stacked: true}], }, plugins: { datalabels: { anchor: 'end', align: 'top', color: 'white', backgroundColor: 'rgba(46, 140, 171, 0.6)', borderColor: 'rgba(41, 168, 194, 1.0)', borderWidth: 0.5, borderRadius: 3, padding: 0, font: {size:10}, formatter: (v,ctx) => ctx.datasetIndex!=ctx.chart.data.datasets.length-1 ? null : [((ctx.chart.data.datasets.reduce((a,b)=>a- -b.data[ctx.dataIndex],0)*10)|0)/10,'s'].join('') }, colorschemes: { scheme: 'office.Damask6' } } }, type: 'bar', data: {...(() => { let a = { labels: [], datasets: [] }; `  0: Construction;  1: Loading Resources;  2: PreInitialization;  3: Initialization;  4: InterModComms;  5: LoadComplete;  6: ModIdMapping;  7: Other ` .split(';') .map(l => l.match(/\d: (.*)/).slice(1)) .forEach(([name]) => a.datasets.push({ label: name, data: [] })); `  0 1 2 3 4 5 6 7;  CraftTweaker2                 |  0.8 |  0.0 |  2.98|  4.58|  0.0 |  0.5 |  0.0 |  0.0 ;  Ender IO                      |  1.93|  0.0 |  3.34|  0.26|  1.17|  0.0 |  0.1 |  0.0 ;  Astral Sorcery                |  0.18|  0.0 |  4.64|  1.25|  0.0 |  0.0 |  0.0 |  0.0 ;  Tinkers' Antique              |  0.79|  0.0 |  0.13|  0.80|  0.0 |  0.0 |  0.0 |  4.0 ;  OpenComputers                 |  0.16|  0.0 |  3.53|  1.60|  0.5 |  0.0 |  0.0 |  0.0 ;  IndustrialCraft 2             |  0.82|  0.0 |  3.77|  0.64|  0.0 |  0.0 |  0.0 |  0.0 ;  Forestry                      |  0.31|  0.0 |  2.12|  0.64|  0.0 |  0.0 |  0.0 |  0.0 ;  Thermal Expansion             |  0.4 |  0.0 |  0.70|  2.20|  0.1 |  0.0 |  0.2 |  0.0 ;  NuclearCraft                  |  0.5 |  0.0 |  2.51|  0.36|  0.0 |  0.0 |  0.3 |  0.0 ;  Integrated Dynamics           |  0.14|  0.0 |  2.63|  0.3 |  0.0 |  0.0 |  0.0 |  0.0 ;  [Mod Average]                 |  0.6 |  0.0 |  0.16|  0.7 |  0.0 |  0.0 |  0.0 |  0.0  ` .split(';').slice(1) .map(l => l.split('|').map(s => s.trim())) .forEach(([name, ...arr], i) => { a.labels.push(name); arr.forEach((v, j) => a.datasets[j].data[i] = v) }); return a })()} }"/>
</p>

<br>

# TOP JEI Registered Plugis

<p align="center">
<img src="https://quickchart.io/chart.png?w=500&h=200&c={ options: { elements: { rectangle: { borderWidth: 1 } }, legend: false, scales: { yAxes: [{ ticks: { fontSize: 9, fontFamily: 'Verdana' }}], }, }, type: 'horizontalBar', data: {...(() => { let a = { labels: [], datasets: [{ backgroundColor: 'rgba(0, 99, 132, 0.5)', borderColor: 'rgb(0, 99, 132)', data: [] }] }; `  1.859: jeresources.jei.JEIConfig;  0.798: com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;  0.539: com.buuz135.industrial.jei.JEICustomPlugin;  0.45 : crazypants.enderio.machines.integration.jei.MachinesPlugin;  0.424: ic2.jeiIntegration.SubModule;  0.332: mezz.jei.plugins.vanilla.VanillaPlugin;  0.219: crazypants.enderio.base.integration.jei.JeiPlugin;  0.169: cofh.thermalexpansion.plugins.jei.JEIPluginTE;  0.149: com.buuz135.thaumicjei.ThaumcraftJEIPlugin;  0.124: ninjabrain.gendustryjei.GendustryJEIPlugin;  0.122: net.bdew.jeibees.BeesJEIPlugin;  0.086: thaumicenergistics.integration.jei.ThEJEI;  1.481999999999996: Other  ` .split(';') .map(l => l.split(':')) .forEach(([time, name]) => { a.labels.push(name); a.datasets[0].data.push(time) }) ; return a })() } }"/>
</p>

<br>

# FML Stuff

Loading bars that usually not related to specific mods.

⚠️ Shows only steps that took 1.0 sec or more.

<p align="center">
<img src="https://quickchart.io/chart.png?w=500&h=400&c={ options: { rotation: Math.PI*1.125, cutoutPercentage: 55, plugins: { legend: !1, outlabels: { stretch: 5, padding: 1, text: (v)=>v.labels }, doughnutlabel: { labels: [ { text: 'FML stuff:', color: 'rgba(128, 128, 128, 0.5)', font: {size: 18} }, { text: '122.46s', color: 'rgba(128, 128, 128, 1)', font: {size: 22} } ] }, } }, type: 'outlabeledPie', data: {...(() => { let a = { labels: [], datasets: [{ backgroundColor: [], data: [], borderColor: 'rgba(22,22,22,0.3)', borderWidth: 2 }] }; `  739900   1.0 s Reloading;  001799   2.65s Loading Resource - AssetLibrary;  369900   3.58s Preloading 50769 textures;  2C9900   2.13s Texture loading;  009907   5.40s Posting bake events;  009911  33.69s Setting up dynamic models;  00991C  33.76s Loading Resource - ModelManager;  009982  34.53s Rendering Setup;  300099   1.12s XML Recipes;  3A0099   1.57s InterModComms;  8C0099  13.81s [VintageFix]: Texture search 68429 sprites;  960099   3.68s Preloaded 33519 sprites  ` .split(';') .map(l => l.match(/(\w{6}) *(\d*\.\d*) ?s (.*)/s)) .forEach(([, col, time, name]) => { a.labels.push([ name.length > 15 ? name.split(/(?%3C=.{11})\s(?=\S{6})/).join('\n') : name , ' ', time, 's' ].join('')); a.datasets[0].data.push(parseFloat(time)); a.datasets[0].backgroundColor.push([String.fromCharCode(35), col].join('')) }) ; return a })()} }"/>
</p>
