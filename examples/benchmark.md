## Minecraft load time benchmark


---

<p align="center" style="font-size:160%;">
MC total load time:<br>
776.66 sec
<br>
<sup><sub>(
12:56 min
)</sub></sup>
</p>

<br>


<p align="center">
<img src="https://quickchart.io/chart?w=400&h=30&c={
  type: 'horizontalBar',
  data: {
    datasets: [
      {label:      'MODS:', data: [513.21]},
      {label: 'FML stuff:', data: [263.45]}
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
}"/>
</p>

<br>

# Mods Loading Time
<p align="center">
<img src="https://quickchart.io/chart?w=400&h=300&c={
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
`
3e76ba  19.66s Just Enough Items;
386AA7  33.40s Just Enough Items (Plugins);
386AA7  31.65s Just Enough Items (Ingredient Filter);
9e2174   4.67s Tinkers' Construct;
8E1E68  34.16s Tinkers' Construct (Oredict Melting);
516fa8  19.67s Ender IO;
8c2ccd  19.57s Immersive Engineering;
5161a8   9.41s CraftTweaker2;
495797   7.92s CraftTweaker2 (Script Loading);
214d9e  17.15s Minecraft Forge;
a651a8  12.17s IndustrialCraft 2;
8f3087  11.47s Forge Mod Loader;
81493e  11.12s Block Drops;
813e81   9.51s OpenComputers;
7c813e   9.09s Thaumcraft;
8f304e   8.58s Astral Sorcery;
538f30   8.15s Animania;
8f6c30   6.18s Dynamic Surroundings;
176e43   5.96s Thaumic Additions: Reconstructed;
6e175e   5.34s Recurrent Complex;
213664   5.33s Forestry;
436e17   4.66s Integrated Dynamics;
308f53   4.27s Village Names;
a86e51   4.18s Extra Utilities 2;
444444 117.33s 56 Other mods;
333333  90.79s 326 'Fast' mods (load 1.0s - 0.1s);
222222   1.81s 36 'Instant' mods (load %3C 0.1s)
`
    .split(';').reduce((a, l) => {
      l.match(/(\w{6}) *(\d*\.\d*)s (.*)/)
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
<img src="https://quickchart.io/chart?w=400&h=450&c={
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
1: Construction;
2: Loading Resources;
3: PreInitialization;
4: Initialization;
5: InterModComms$IMC;
6: PostInitialization;
7: LoadComplete;
8: ModIdMapping
`
    .split(';')
      .map(l => l.match(/\d: (.*)/).slice(1))
      .forEach(([name]) => a.datasets.push({ label: name, data: [] }));
`
                                     1      2      3      4      5      6      7      8  ;
Tinkers' Construct               |  1.18|  0.01|  0.19|  0.08|  0.01| 37.34|  0.02|  0.00;
Ender IO                         |  1.96|  0.01|  4.80|  0.64|  4.13|  6.91|  0.02|  1.19;
Immersive Engineering            |  0.91|  0.01|  1.32|  1.07|  0.00| 16.25|  0.02|  0.00;
CraftTweaker2                    |  0.61|  0.00|  3.94|  0.03|  0.00| 12.71|  0.03|  0.00;
IndustrialCraft 2                |  0.78|  0.02|  9.00|  0.98|  0.00|  1.38|  0.02|  0.00;
Block Drops                      |  0.04|  0.00|  0.03|  0.02|  0.00| 11.02|  0.02|  0.00;
OpenComputers                    |  0.20|  0.02|  5.85|  3.18|  0.23|  0.02|  0.02|  0.00;
Thaumcraft                       |  0.63|  0.01|  0.24|  0.46|  0.01|  7.72|  0.02|  0.00;
Astral Sorcery                   |  0.26|  0.01|  5.47|  1.60|  0.00|  1.22|  0.02|  0.00;
Animania                         |  0.41|  0.00|  3.82|  0.13|  0.00|  3.76|  0.02|  0.00;
Dynamic Surroundings             |  0.22|  0.01|  0.26|  0.17|  0.00|  0.08|  5.43|  0.00;
Thaumic Additions: Reconstructed |  0.18|  0.00|  0.73|  0.41|  0.00|  4.62|  0.02|  0.00
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
<img src="https://quickchart.io/chart?w=700&c={
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
  4.62: crazypants.enderio.machines.integration.jei.MachinesPlugin;
  3.69: com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;
  3.40: li.cil.oc.integration.jei.ModPluginOpenComputers;
  3.01: cofh.thermalexpansion.plugins.jei.JEIPluginTE;
  2.61: mezz.jei.plugins.vanilla.VanillaPlugin;
  1.83: com.github.sokyranthedragon.mia.integrations.jer.JeiJerIntegration$1;
  1.79: com.buuz135.industrial.jei.JEICustomPlugin;
  1.47: jeresources.jei.JEIConfig;
  1.32: forestry.factory.recipes.jei.FactoryJeiPlugin;
  1.21: ic2.jeiIntegration.SubModule;
  0.81: com.buuz135.thaumicjei.ThaumcraftJEIPlugin;
  0.75: knightminer.tcomplement.plugin.jei.JEIPlugin;
  0.67: nc.integration.jei.NCJEI;
  0.65: mctmods.smelteryio.library.util.jei.JEI;
  0.53: crazypants.enderio.base.integration.jei.JeiPlugin;
  5.05: Other 118 Plugins
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
<p align="center">
<img src="https://quickchart.io/chart?w=500&h=400&c={
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
            text: [263.45,'s'].join(''),
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
993A00   2.37s Loading sounds;
994400   2.43s Loading Resource - SoundHandler;
994F00  56.83s ModelLoader: blocks;
995900  10.73s ModelLoader: items;
996300  11.04s ModelLoader: baking;
996D00   6.13s Applying remove recipe actions;
997700   5.26s Applying remove furnace recipe actions;
998200  31.57s Indexing ingredients;
444444 137.09s Other
`
    .split(';')
      .map(l => l.match(/(\w{6}) *(\d*\.\d*)s (.*)/))
      .forEach(([, col, time, name]) => {
        a.labels.push([name, ' ', time, 's'].join(''));
        a.datasets[0].data.push(parseFloat(time));
        a.datasets[0].backgroundColor.push([String.fromCharCode(35), col].join(''))
      })
      ; return a
  })()}
}"/>
</p>

<br>
