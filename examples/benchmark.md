## Minecraft load time benchmark

---

<p align="center" style="font-size:160%;">
MC total load time:<br>
282 sec
<br>
<sup><sub>(
4:42 min
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
        {label: 'Mixins\n', data: [ 34.0 ]},
        {label: 'Construction\n', data: [ 56.0 ]},
        {label: 'PreInit\n', data: [138.0 ]},
        {label: 'Init\n', data: [ 50.0 ]},
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
          value: 34,
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
5161a8   2.74s CraftTweaker2;
45528F   7.31s [CT Script\nLoading];
436e17   1.40s Had Enough\nItems;
395E14   1.13s [JEI Ingredient\nFilter];
395E14   6.8 s [JEI Plugins];
813e81   6.7 s OpenComputers;
8f304e   5.87s Astral Sorcery;
a651a8   4.84s IndustrialCraft 2;
516fa8   4.49s Ender IO;
3ebaa4   0.1 s VintageFix;
359E8B   4.12s [VF Sprite\npreload];
6e5e17   0.89s Tinkers' Antique;
5E5014   3.0 s [TCon Textures];
cd922c   2.89s NuclearCraft;
213664   2.52s Forestry;
308f7e   2.42s Quark: RotN\nEdition;
436e17   2.20s Integrated\nDynamics;
ba3eb8   2.16s Cyclic;
3e8160   2.3 s The Twilight\nForest;
a0ba3e   1.97s HammerLib;
8f4d30   1.85s Open Terrain\nGenerator;
444444  26.4 s 19 Other mods;
333333  37.61s 133 'Fast' mods\n(1.0s -\n0.1s);
222222   8.37s 315 'Instant' mods (%3C\n0.1s)
`
    .split(';').reduce((a, l) => {
      l.match(/(\w{6}) *(\d*\.\d*) ?s (.*)/s)
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
4: Other
`
    .split(';')
      .map(l => l.match(/\d: (.*)/).slice(1))
      .forEach(([name]) => a.datasets.push({ label: name, data: [] }));
`
                                   0      1      2      3      4;
  CraftTweaker2                 |  0.10|  0.0 |  2.63|  0.0 |  7.31;
  OpenComputers                 |  0.16|  0.0 |  4.16|  1.73|  0.0 ;
  Astral Sorcery                |  0.19|  0.0 |  4.97|  0.70|  0.0 ;
  IndustrialCraft 2             |  0.82|  0.0 |  3.48|  0.53|  0.0 ;
  Ender IO                      |  1.37|  0.0 |  2.90|  0.21|  0.0 ;
  VintageFix                    |  0.1 |  0.0 |  0.0 |  0.0 |  4.12;
  Tinkers&#x27; Antique              |  0.75|  0.0 |  0.12|  0.1 |  3.0 ;
  NuclearCraft                  |  0.5 |  0.0 |  2.64|  0.19|  0.0 ;
  Forestry                      |  0.30|  0.0 |  1.82|  0.39|  0.0 ;
  Quark: RotN Edition           |  0.2 |  0.0 |  2.34|  0.5 |  0.0 
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
1.405: jeresources.jei.JEIConfig;
0.706: com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;
0.516: crazypants.enderio.machines.integration.jei.MachinesPlugin;
0.49 : com.buuz135.thaumicjei.ThaumcraftJEIPlugin;
0.365: ic2.jeiIntegration.SubModule;
0.357: com.buuz135.industrial.jei.JEICustomPlugin;
0.28 : mezz.jei.plugins.vanilla.VanillaPlugin;
0.176: crazypants.enderio.base.integration.jei.JeiPlugin;
0.175: cofh.thermalexpansion.plugins.jei.JEIPluginTE;
0.084: ninjabrain.gendustryjei.GendustryJEIPlugin;
0.079: net.bdew.jeibees.BeesJEIPlugin;
0.075: thaumicenergistics.integration.jei.ThEJEI
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
            text: '143.91s',
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
739900   1.12s Reloading;
001799   2.73s Loading Resource -\nAssetLibrary;
2C9900   4.2 s Preloading\n51365\ntextures;
229900   2.60s Texture loading;
039900   1.18s Texture mipmap and\nupload;
009911   4.98s Posting bake\nevents;
00991C  34.6 s Setting up\ndynamic\nmodels;
009926  34.12s Loading Resource -\nModelManager;
00998C  34.85s Rendering Setup;
444444  19.40s Other
`
    .split(';')
      .map(l => l.match(/(\w{6}) *(\d*\.\d*) ?s (.*)/s))
      .forEach(([, col, time, name]) => {
        a.labels.push([name, ' ', time, 's'].join(''));
        a.datasets[0].data.push(parseFloat(time));
        a.datasets[0].backgroundColor.push([String.fromCharCode(35), col].join(''))
      })
      ; return a
  })()}
}"/>
</p>
