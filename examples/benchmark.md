## Minecraft load time benchmark

---

<p align="center" style="font-size:160%;">
MC total load time:<br>
295 sec
<br>
<sup><sub>(
4:55 min
)</sub></sup>
</p>

<br>
<!--
Note for image scripts:
  - Newlines are ignored
  - This characters cant be used: +<"%#
-->
<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=60&c={
  type: 'horizontalBar',
  data: {
    datasets: [
        {label: 'Mixins\n', data: [ 39.0 ]},
        {label: 'Construction\n', data: [ 59.0 ]},
        {label: 'PreInit\n', data: [139.0 ]},
        {label: 'Init\n', data: [ 54.0 ]},
    ]
  },
  options: {
    layout: { padding: { top: 10 } },
    scales: {
      xAxes: [{display: false, stacked: true}],
      yAxes: [{display: false, stacked: true}],
    },
    elements: {rectangle: {borderWidth: 2}},
    legend: {display: false},
    plugins: {datalabels: {
      color: 'white',
      font: {
        family: 'Consolas',
      },
      formatter: (value, context) =>
        [context.dataset.label, value, 's'].join('')
    }},
    annotation: {
      clip: false,
      annotations: [{
          type: 'line',
          scaleID: 'x-axis-0',
          value: 39,
          borderColor: 'black',
          label: {
            content: 'Window appear',
            fontSize: 8,
            enabled: true,
            xPadding: 8, yPadding: 2,
            yAdjust: -20
          },
        }
      ]
    },
  }
}"/>
</p>

<br>

# Mods Loading Time

<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=300&c={
  type: 'outlabeledPie',
  options: {
    rotation: Math.PI,
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
`
5161a8   8.8 s CraftTweaker2;
436e17   7.28s Had Enough Items;
395E14   0.94s [JEI Ingredient Filter];
395E14   6.67s [JEI Plugins];
8f304e   7.5 s Astral Sorcery;
516fa8   6.23s Ender IO;
813e81   6.5 s OpenComputers;
a651a8   4.81s IndustrialCraft 2;
6e5e17   4.59s Tinkers' Antique;
5E5014   3.0 s [TCon Textures];
3ebaa4   3.59s VintageFix;
359E8B   3.56s [VF Sprite preload];
cd922c   3.26s NuclearCraft;
213664   3.22s Forestry;
3e7d81   2.95s ProbeZS;
8f4d30   2.72s Open Terrain Generator;
3e8160   2.55s The Twilight Forest;
216364   2.48s Thermal Expansion;
30518f   2.37s Patchouli;
308f7e   2.25s Quark: RotN Edition;
444444  38.72s 26 Other mods;
333333  45.9 s 149 'Fast' mods (1.0s - 0.1s);
222222   7.91s 290 'Instant' mods (%3C 0.1s)
`
    .split(';').reduce((a, l) => {
      l.match(/(\w{6}) *(\d*\.\d*) ?s (.*)/s)
      .slice(1).map((a, i) => [[String.fromCharCode(35),a].join(''), a,
        a.length > 15 ? a.split(/(?%3C=.{9})\s(?=\S{5})/).join('\n') : a
      ][i])
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
}"/>
</p>

<br>

# Top Mods Details (except JEI, FML and Forge)

<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=450&c={
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
`
0: Construction;
1: Loading Resources;
2: PreInitialization;
3: Initialization;
4: InterModComms;
5: LoadComplete;
6: ModIdMapping;
7: Other
`
    .split(';')
      .map(l => l.match(/\d: (.*)/).slice(1))
      .forEach(([name]) => a.datasets.push({ label: name, data: [] }));
`
                                   0      1      2      3      4      5      6      7;
  CraftTweaker2                 |  0.30|  0.0 |  2.49|  5.20|  0.0 |  0.7 |  0.0 |  0.0 ;
  Astral Sorcery                |  0.30|  0.0 |  5.51|  1.23|  0.0 |  0.0 |  0.0 |  0.0 ;
  Ender IO                      |  1.48|  0.0 |  3.12|  0.27|  1.33|  0.0 |  0.1 |  0.0 ;
  OpenComputers                 |  0.39|  0.0 |  3.82|  1.78|  0.5 |  0.0 |  0.0 |  0.0 ;
  IndustrialCraft 2             |  0.79|  0.0 |  3.23|  0.78|  0.0 |  0.0 |  0.0 |  0.0 ;
  Tinkers' Antique              |  0.70|  0.0 |  0.10|  0.77|  0.0 |  0.0 |  0.0 |  3.0 ;
  VintageFix                    |  0.1 |  0.0 |  0.0 |  0.1 |  0.0 |  0.0 |  0.0 |  3.56;
  NuclearCraft                  |  0.4 |  0.0 |  2.85|  0.32|  0.0 |  0.0 |  0.3 |  0.0 ;
  Forestry                      |  0.32|  0.0 |  1.76|  1.13|  0.0 |  0.0 |  0.0 |  0.0 ;
  ProbeZS                       |  0.2 |  0.0 |  0.3 |  2.89|  0.0 |  0.0 |  0.0 |  0.0 
`
    .split(';').slice(1)
      .map(l => l.split('|').map(s => s.trim()))
      .forEach(([name, ...arr], i) => {
        a.labels.push(name);
        arr.forEach((v, j) => a.datasets[j].data[i] = v)
      }); return a
  })()}
}"/>
</p>

<br>

# TOP JEI Registered Plugis

<p align="center">
<img src="https://quickchart.io/chart.png?w=700&c={
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
`
1.785: jeresources.jei.JEIConfig;
0.651: com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;
0.579: ic2.jeiIntegration.SubModule;
0.486: com.buuz135.industrial.jei.JEICustomPlugin;
0.485: crazypants.enderio.machines.integration.jei.MachinesPlugin;
0.294: mezz.jei.plugins.vanilla.VanillaPlugin;
0.19 : crazypants.enderio.base.integration.jei.JeiPlugin;
0.182: com.buuz135.thaumicjei.ThaumcraftJEIPlugin;
0.163: cofh.thermalexpansion.plugins.jei.JEIPluginTE;
0.14 : ninjabrain.gendustryjei.GendustryJEIPlugin;
0.108: net.bdew.jeibees.BeesJEIPlugin;
0.087: crafttweaker.mods.jei.JEIAddonPlugin
`
        .split(';')
        .map(l => l.split(':'))
        .forEach(([time, name]) => {
          a.labels.push(name);
          a.datasets[0].data.push(time)
        })
        ; return a
    })()
  }
}"/>
</p>

<br>

# FML Stuff

Loading bars that usually not related to specific mods.

⚠️ Shows only steps that took 1.0 sec or more.

<p align="center">
<img src="https://quickchart.io/chart.png?w=500&h=400&c={
  options: {
    rotation: Math.PI*1.125,
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
            text: '119.88s',
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
`
001799   3.64s Loading Resource - AssetLibrary;
369900   3.47s Preloading 50769 textures;
2C9900   2.5 s Texture loading;
009907   4.18s Posting bake events;
009911  31.69s Setting up dynamic models;
00991C  31.77s Loading Resource - ModelManager;
009982  32.61s Rendering Setup;
300099   1.26s XML Recipes;
3A0099   1.77s InterModComms
`
    .split(';')
      .map(l => l.match(/(\w{6}) *(\d*\.\d*) ?s (.*)/s))
      .forEach(([, col, time, name]) => {
        a.labels.push([
          name.length > 15 ? name.split(/(?%3C=.{9})\s(?=\S{5})/).join('\n') : name
          , ' ', time, 's'
        ].join(''));
        a.datasets[0].data.push(parseFloat(time));
        a.datasets[0].backgroundColor.push([String.fromCharCode(35), col].join(''))
      })
      ; return a
  })()}
}"/>
</p>
