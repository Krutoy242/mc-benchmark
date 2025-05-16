## Minecraft load time benchmark

---

<p align="center" style="font-size:160%;">
MC total load time:<br>
537 sec
<br>
<sup><sub>(
8:57 min
)</sub></sup>
</p>

<br>
<!--
Note for image scripts:
  - Newlines are ignored
  - This characters cant be used: +<"%#
-->
<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=60&c={%20type:%20'horizontalBar',%20data:%20{%20datasets:%20[%20{label:%20'Mixins\n',%20data:%20[44.00]},%20{label:%20'Construction\n',%20data:%20[91.00]},%20{label:%20'PreInit\n',%20data:%20[277.00]},%20{label:%20'Init\n',%20data:%20[119.00]},%20]%20},%20options:%20{%20layout:%20{%20padding:%20{%20top:%2010%20}%20},%20scales:%20{%20xAxes:%20[{display:%20false,%20stacked:%20true}],%20yAxes:%20[{display:%20false,%20stacked:%20true}],%20},%20elements:%20{rectangle:%20{borderWidth:%202}},%20legend:%20{display:%20false},%20plugins:%20{datalabels:%20{%20color:%20'white',%20font:%20{%20family:%20'Consolas',%20},%20formatter:%20(value,%20context)%20=>%20[context.dataset.label,%20value,%20's'].join('')%20}},%20annotation:%20{%20clip:%20false,%20annotations:%20[{%20type:%20'line',%20scaleID:%20'x-axis-0',%20value:%2044,%20borderColor:%20'black',%20label:%20{%20content:%20'Window%20appear',%20fontSize:%208,%20enabled:%20true,%20xPadding:%208,%20yPadding:%202,%20yAdjust:%20-20%20},%20}%20]%20},%20}%20}"/>
</p>

<br>

# Mods Loading Time

<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=300&c={%20type:%20'outlabeledPie',%20options:%20{%20rotation:%20Math.PI,%20cutoutPercentage:%2025,%20plugins:%20{%20legend:%20!1,%20outlabels:%20{%20stretch:%205,%20padding:%201,%20text:%20(v,i)=>[%20v.labels[v.dataIndex],'%20',%20(v.percent*1000|0)/10,%20String.fromCharCode(37)].join('')%20}%20}%20},%20data:%20{...%20`%20436e17%2014.37s%20Had%20Enough%20Items;%20395E14%201.86s%20[JEI%20Ingredient%20Filter];%20395E14%2014.32s%20[JEI%20Plugins];%205161a8%2011.91s%20CraftTweaker2;%206e5e17%2011.58s%20Tinkers'%20Antique;%205E5014%207.00s%20[TCon%20Textures];%20813e81%209.31s%20OpenComputers;%20516fa8%209.30s%20Ender%20IO;%208f304e%207.87s%20Astral%20Sorcery;%20a651a8%207.62s%20IndustrialCraft%202;%20213664%207.14s%20Forestry;%20cd922c%206.18s%20NuclearCraft;%206e175e%205.31s%20Recurrent%20Complex;%20814a3e%204.91s%20RFTools;%20436e17%204.81s%20Integrated%20Dynamics;%208f4d30%204.76s%20Open%20Terrain%20Generator;%20a86e51%204.28s%20Extra%20Utilities%202;%203e7d81%204.17s%20ProbeZS;%208c2ccd%203.73s%20Immersive%20Engineering;%20444444%20102.52s%2049%20Other%20mods;%20333333%2072.02s%20197%20'Fast'%20mods%20(1.0s%20-%200.1s);%20222222%207.66s%20218%20'Instant'%20mods%20(%3C%200.1s)%20`%20.split(';').reduce((a,%20l)%20=>%20{%20l.match(/(\w{6})%20*(\d*\.\d*)%20?s%20(.*)/s)%20.slice(1).map((a,%20i)%20=>%20[[String.fromCharCode(35),a].join(''),%20a,%20a.length%20>%2015%20?%20a.split(/(?%3C=.{9})\s(?=\S{5})/).join('\n')%20:%20a%20][i])%20.forEach((s,%20i)%20=>%20[a.datasets[0].backgroundColor,%20a.datasets[0].data,%20a.labels][i].push(s)%20);%20return%20a%20},%20{%20labels:%20[],%20datasets:%20[{%20backgroundColor:%20[],%20data:%20[],%20borderColor:%20'rgba(22,22,22,0.3)',%20borderWidth:%201%20}]%20})%20}%20}"/>
</p>

<br>

# Loader steps

Show how much time each mod takes on each game load phase.

JEI/HEI not included, since its load time based on other mods and overal item count.

<p align="center">
<img src="https://quickchart.io/chart.png?w=400&h=450&c={%20options:%20{%20scales:%20{%20xAxes:%20[{stacked:%20true}],%20yAxes:%20[{stacked:%20true}],%20},%20plugins:%20{%20datalabels:%20{%20anchor:%20'end',%20align:%20'top',%20color:%20'white',%20backgroundColor:%20'rgba(46,%20140,%20171,%200.6)',%20borderColor:%20'rgba(41,%20168,%20194,%201.0)',%20borderWidth:%200.5,%20borderRadius:%203,%20padding:%200,%20font:%20{size:10},%20formatter:%20(v,ctx)%20=>%20ctx.datasetIndex!=ctx.chart.data.datasets.length-1%20?%20null%20:%20[((ctx.chart.data.datasets.reduce((a,b)=>a-%20-b.data[ctx.dataIndex],0)*10)|0)/10,'s'].join('')%20},%20colorschemes:%20{%20scheme:%20'office.Damask6'%20}%20}%20},%20type:%20'bar',%20data:%20{...(()%20=>%20{%20let%20a%20=%20{%20labels:%20[],%20datasets:%20[]%20};%20`%200:%20Construction;%201:%20Loading%20Resources;%202:%20PreInitialization;%203:%20Initialization;%204:%20InterModComms;%205:%20LoadComplete;%206:%20ModIdMapping;%207:%20Other%20`%20.split(';')%20.map(l%20=>%20l.match(/\d:%20(.*)/).slice(1))%20.forEach(([name])%20=>%20a.datasets.push({%20label:%20name,%20data:%20[]%20}));%20`%200%201%202%203%204%205%206%207;%20CraftTweaker2%20|%200.13|%200.00|%205.66|%206.04|%200.00|%200.08|%200.00|%200.00;%20Tinkers'%20Antique%20|%202.94|%200.01|%200.22|%201.42|%200.00|%200.00|%200.00|%207.00;%20OpenComputers%20|%200.17|%200.02|%204.92|%203.96|%200.24|%200.00|%200.00|%200.00;%20Ender%20IO%20|%202.38|%200.01|%204.00|%200.72|%202.16|%200.00|%200.02|%200.00;%20Astral%20Sorcery%20|%200.27|%200.01|%205.23|%202.37|%200.00|%200.00|%200.00|%200.00;%20IndustrialCraft%202%20|%201.05|%200.01|%205.23|%201.33|%200.00|%200.00|%200.00|%200.00;%20Forestry%20|%200.49|%200.01|%204.99|%201.65|%200.00|%200.00|%200.00|%200.00;%20NuclearCraft%20|%200.09|%200.01|%205.03|%200.98|%200.00|%200.00|%200.07|%200.00;%20Recurrent%20Complex%20|%200.34|%200.00|%200.88|%204.09|%200.00|%200.00|%200.00|%200.00;%20RFTools%20|%200.06|%200.00|%204.54|%200.27|%200.03|%200.00|%200.00|%200.00;%20[Mod%20Average]%20|%200.10|%200.00|%200.31|%200.18|%200.01|%200.01|%200.00|%200.02%20`%20.split(';').slice(1)%20.map(l%20=>%20l.split('|').map(s%20=>%20s.trim()))%20.forEach(([name,%20...arr],%20i)%20=>%20{%20a.labels.push(name);%20arr.forEach((v,%20j)%20=>%20a.datasets[j].data[i]%20=%20v)%20});%20return%20a%20})()}%20}"/>
</p>

<br>

# TOP JEI Registered Plugis

<p align="center">
<img src="https://quickchart.io/chart.png?w=500&h=200&c={%20options:%20{%20elements:%20{%20rectangle:%20{%20borderWidth:%201%20}%20},%20legend:%20false,%20scales:%20{%20yAxes:%20[{%20ticks:%20{%20fontSize:%209,%20fontFamily:%20'Verdana'%20}}],%20},%20},%20type:%20'horizontalBar',%20data:%20{...(()%20=>%20{%20let%20a%20=%20{%20labels:%20[],%20datasets:%20[{%20backgroundColor:%20'rgba(0,%2099,%20132,%200.5)',%20borderColor:%20'rgb(0,%2099,%20132)',%20data:%20[]%20}]%20};%20`%202.39:%20jeresources.jei.JEIConfig;%201.21:%20com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;%201.01:%20ic2.jeiIntegration.SubModule;%200.88:%20crazypants.enderio.machines.integration.jei.MachinesPlugin;%200.69:%20mezz.jei.plugins.vanilla.VanillaPlugin;%200.58:%20com.buuz135.industrial.jei.JEICustomPlugin;%200.55:%20crazypants.enderio.base.integration.jei.JeiPlugin;%200.42:%20cofh.thermalexpansion.plugins.jei.JEIPluginTE;%200.31:%20lach_01298.qmd.jei.QMDJEI;%200.30:%20com.buuz135.thaumicjei.ThaumcraftJEIPlugin;%200.29:%20ninjabrain.gendustryjei.GendustryJEIPlugin;%200.26:%20net.bdew.jeibees.BeesJEIPlugin;%205.41:%20Other%20`%20.split(';')%20.map(l%20=>%20l.split(':'))%20.forEach(([time,%20name])%20=>%20{%20a.labels.push(name);%20a.datasets[0].data.push(time)%20})%20;%20return%20a%20})()%20}%20}"/>
</p>

<br>

# FML Stuff

Loading bars that usually not related to specific mods.

⚠️ Shows only steps that took 1.0 sec or more.

<p align="center">
<img src="https://quickchart.io/chart.png?w=500&h=400&c={%20options:%20{%20rotation:%20Math.PI*1.125,%20cutoutPercentage:%2055,%20plugins:%20{%20legend:%20!1,%20outlabels:%20{%20stretch:%205,%20padding:%201,%20text:%20(v)=>v.labels%20},%20doughnutlabel:%20{%20labels:%20[%20{%20text:%20'FML%20stuff:',%20color:%20'rgba(128,%20128,%20128,%200.5)',%20font:%20{size:%2018}%20},%20{%20text:%20'215.29s',%20color:%20'rgba(128,%20128,%20128,%201)',%20font:%20{size:%2022}%20}%20]%20},%20}%20},%20type:%20'outlabeledPie',%20data:%20{...(()%20=>%20{%20let%20a%20=%20{%20labels:%20[],%20datasets:%20[{%20backgroundColor:%20[],%20data:%20[],%20borderColor:%20'rgba(22,22,22,0.3)',%20borderWidth:%202%20}]%20};%20`%20739900%201.12s%20Reloading;%20001799%202.39s%20Loading%20Resource%20-%20AssetLibrary;%207D9900%209.66s%20Loading%20sounds;%20739900%209.75s%20Loading%20Resource%20-%20SoundHandler;%204A9900%201.85s%20CCL%20ModelLoading:%20Blocks;%20409900%201.72s%20CCL%20ModelLoading:%20Items;%20369900%206.18s%20Preloading%2050813%20textures;%202C9900%202.13s%20Texture%20loading;%20009907%205.68s%20Posting%20bake%20events;%20009911%2067.97s%20Setting%20up%20dynamic%20models;%2000991C%2068.12s%20Loading%20Resource%20-%20ModelManager;%20009982%2070.36s%20Rendering%20Setup;%20110099%201.13s%20File;%20300099%202.04s%20XML%20Recipes;%203A0099%203.70s%20InterModComms;%20440099%201.81s%20Applying%20add%20recipe%20actions;%20990073%2031.14s%20[VintageFix]:%20Texture%20search%2068517%20sprites;%20990069%206.30s%20Preloaded%2033563%20sprites%20`%20.split(';')%20.map(l%20=>%20l.match(/(\w{6})%20*(\d*\.\d*)%20?s%20(.*)/s))%20.forEach(([,%20col,%20time,%20name])%20=>%20{%20a.labels.push([%20name.length%20>%2015%20?%20name.split(/(?%3C=.{11})\s(?=\S{6})/).join('\n')%20:%20name%20,%20'%20',%20time,%20's'%20].join(''));%20a.datasets[0].data.push(parseFloat(time));%20a.datasets[0].backgroundColor.push([String.fromCharCode(35),%20col].join(''))%20})%20;%20return%20a%20})()}%20}"/>
</p>
