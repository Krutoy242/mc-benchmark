## Minecraft load time benchmark

---

<p align="center" style="font-size:160%;">
MC total load time:<br>
255 sec
<br>
<sup><sub>(
4:15 min
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
        {label: 'Mixins\n', data: [ 31.0 ]},
        {label: 'Construction\n', data: [ 50.0 ]},
        {label: 'PreInit\n', data: [125.0 ]},
        {label: 'Init\n', data: [ 46.0 ]},
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
          value: 31,
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
5161a8   6.62s CraftTweaker2;
436e17   6.62s Had Enough Items;
395E14   1.19s [JEI Ingredient Filter];
395E14   5.75s [JEI Plugins];
516fa8   5.93s Ender IO;
8f304e   5.25s Astral Sorcery;
813e81   5.9 s OpenComputers;
a651a8   4.57s IndustrialCraft 2;
6e5e17   4.51s Tinkers' Antique;
5E5014   3.0 s [TCon Textures];
3ebaa4   3.30s VintageFix;
359E8B   3.27s [VF Sprite preload];
213664   2.90s Forestry;
cd922c   2.79s NuclearCraft;
308f7e   2.30s Quark: RotN Edition;
216364   2.23s Thermal Expansion;
436e17   2.22s Integrated Dynamics;
a86e51   2.7 s Extra Utilities 2;
ba3eb8   1.95s Cyclic;
3e8160   1.86s The Twilight Forest;
444444  29.11s 22 Other mods;
333333  41.20s 141 'Fast' mods (1.0s - 0.1s);
222222   7.88s 303 'Instant' mods (%3C 0.1s)
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

# Loader steps

Show how much time each mod takes on each game load phase.

JEI/HEI not included, since its load time based on other mods and overal item count.

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
CraftTweaker2                 |  0.12|  0.0 |  2.38|  4.6 |  0.0 |  0.6 |  0.0 |  0.0 ;
Ender IO                      |  1.69|  0.0 |  2.77|  0.27|  1.17|  0.0 |  0.1 |  0.0 ;
Astral Sorcery                |  0.15|  0.0 |  4.18|  0.91|  0.0 |  0.0 |  0.0 |  0.0 ;
OpenComputers                 |  0.11|  0.0 |  3.41|  1.50|  0.4 |  0.0 |  0.0 |  0.0 ;
IndustrialCraft 2             |  0.79|  0.0 |  3.16|  0.61|  0.0 |  0.0 |  0.0 |  0.0 ;
Tinkers' Antique              |  0.70|  0.0 |  0.10|  0.70|  0.0 |  0.0 |  0.0 |  3.0 ;
VintageFix                    |  0.1 |  0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  0.0 |  3.27;
Forestry                      |  0.26|  0.0 |  1.77|  0.86|  0.0 |  0.0 |  0.0 |  0.0 ;
NuclearCraft                  |  0.5 |  0.0 |  2.36|  0.34|  0.0 |  0.0 |  0.3 |  0.0 ;
Quark: RotN Edition           |  0.2 |  0.0 |  2.18|  0.10|  0.0 |  0.0 |  0.0 |  0.0 ;
[Mod Average]                 |  0.5 |  0.0 |  0.14|  0.6 |  0.0 |  0.0 |  0.0 |  0.1 
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
<img src="https://quickchart.io/chart.png?w=500&h=200&c={
  options: {
    elements: { rectangle: { borderWidth: 1 } },
    legend: false,
    scales: {
      yAxes: [{ ticks: { fontSize: 9, fontFamily: 'Verdana' }}],
    },
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
1.531: jeresources.jei.JEIConfig;
0.719: com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;
0.412: crazypants.enderio.machines.integration.jei.MachinesPlugin;
0.358: com.buuz135.industrial.jei.JEICustomPlugin;
0.33 : ic2.jeiIntegration.SubModule;
0.299: mezz.jei.plugins.vanilla.VanillaPlugin;
0.199: crazypants.enderio.base.integration.jei.JeiPlugin;
0.157: cofh.thermalexpansion.plugins.jei.JEIPluginTE;
0.135: com.buuz135.thaumicjei.ThaumcraftJEIPlugin;
0.093: ninjabrain.gendustryjei.GendustryJEIPlugin;
0.088: net.bdew.jeibees.BeesJEIPlugin;
0.076: thaumicenergistics.integration.jei.ThEJEI;
1.3619999999999963: Other
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
            text: '103.96s',
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
001799   2.47s Loading Resource - AssetLibrary;
369900   3.22s Preloading 50769 textures;
2C9900   2.5 s Texture loading;
0D9900   1.4 s Texture mipmap and upload;
009907   4.8 s Posting bake events;
009911  30.17s Setting up dynamic models;
00991C  30.25s Loading Resource - ModelManager;
009982  30.90s Rendering Setup;
300099   1.13s XML Recipes;
3A0099   1.58s InterModComms;
994400  12.58s [VintageFix]: Texture search
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
