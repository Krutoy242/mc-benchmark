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
<img src="https://quickchart.io/chart?w=400&h=30&c={%20type:%20'horizontalBar',%20data:%20{%20datasets:%20[%20{label:%20'MODS:',%20data:%20[513.21]},%20{label:%20'FML%20stuff:',%20data:%20[263.45]}%20]%20},%20options:%20{%20scales:%20{%20xAxes:%20[{display:%20false,stacked:%20true}],%20yAxes:%20[{display:%20false,stacked:%20true}],%20},%20elements:%20{rectangle:%20{borderWidth:%202}},%20legend:%20{display:%20false,},%20plugins:%20{datalabels:%20{color:%20'white',formatter:%20(value,%20context)%20=>%20[context.dataset.label,%20value].join('%20')%20}}%20}%20}"/>
</p>

<br>

# Mods Loading Time
<p align="center">
<img src="https://quickchart.io/chart?w=400&h=300&c={%20type:%20'outlabeledPie',%20options:%20{%20cutoutPercentage:%2025,%20plugins:%20{%20legend:%20!1,%20outlabels:%20{%20stretch:%205,%20padding:%201,%20text:%20(v,i)=>[%20v.labels[v.dataIndex],'%20',%20(v.percent*1000|0)/10,%20String.fromCharCode(37)].join('')%20}%20}%20},%20data:%20{...%20`%203e76ba%2019.66s%20Just%20Enough%20Items;%20386AA7%2033.40s%20Just%20Enough%20Items%20(Plugins);%20386AA7%2031.65s%20Just%20Enough%20Items%20(Ingredient%20Filter);%209e2174%204.67s%20Tinkers'%20Construct;%208E1E68%2034.16s%20Tinkers'%20Construct%20(Oredict%20Melting);%20516fa8%2019.67s%20Ender%20IO;%208c2ccd%2019.57s%20Immersive%20Engineering;%205161a8%209.41s%20CraftTweaker2;%20495797%207.92s%20CraftTweaker2%20(Script%20Loading);%20214d9e%2017.15s%20Minecraft%20Forge;%20a651a8%2012.17s%20IndustrialCraft%202;%208f3087%2011.47s%20Forge%20Mod%20Loader;%2081493e%2011.12s%20Block%20Drops;%20813e81%209.51s%20OpenComputers;%207c813e%209.09s%20Thaumcraft;%208f304e%208.58s%20Astral%20Sorcery;%20538f30%208.15s%20Animania;%208f6c30%206.18s%20Dynamic%20Surroundings;%20176e43%205.96s%20Thaumic%20Additions:%20Reconstructed;%206e175e%205.34s%20Recurrent%20Complex;%20213664%205.33s%20Forestry;%20436e17%204.66s%20Integrated%20Dynamics;%20308f53%204.27s%20Village%20Names;%20a86e51%204.18s%20Extra%20Utilities%202;%20444444%20117.33s%2056%20Other%20mods;%20333333%2090.79s%20326%20'Fast'%20mods%20(load%201.0s%20-%200.1s);%20222222%201.81s%2036%20'Instant'%20mods%20(load%20%3C%200.1s)%20`%20.split(';').reduce((a,%20l)%20=>%20{%20l.match(/(\w{6})%20*(\d*\.\d*)s%20(.*)/)%20.slice(1).map((a,%20i)%20=>%20[[String.fromCharCode(35),a].join(''),%20parseFloat(a),%20a][i])%20.forEach((s,%20i)%20=>%20[a.datasets[0].backgroundColor,%20a.datasets[0].data,%20a.labels][i].push(s)%20);%20return%20a%20},%20{%20labels:%20[],%20datasets:%20[{%20backgroundColor:%20[],%20data:%20[],%20borderColor:%20'rgba(22,22,22,0.3)',%20borderWidth:%201%20}]%20})%20}%20}"/>
</p>

<br>

# Top Mods Details (except JEI, FML and Forge)
<p align="center">
<img src="https://quickchart.io/chart?w=400&h=450&c={%20options:%20{%20scales:%20{%20xAxes:%20[{stacked:%20true}],%20yAxes:%20[{stacked:%20true}],%20},%20plugins:%20{%20datalabels:%20{%20anchor:%20'end',%20align:%20'top',%20color:%20'white',%20backgroundColor:%20'rgba(46,%20140,%20171,%200.6)',%20borderColor:%20'rgba(41,%20168,%20194,%201.0)',%20borderWidth:%200.5,%20borderRadius:%203,%20padding:%200,%20font:%20{size:10},%20formatter:%20(v,ctx)%20=>%20ctx.datasetIndex!=ctx.chart.data.datasets.length-1%20?%20null%20:%20[((ctx.chart.data.datasets.reduce((a,b)=>a-%20-b.data[ctx.dataIndex],0)*10)|0)/10,'s'].join('')%20},%20colorschemes:%20{%20scheme:%20'office.Damask6'%20}%20}%20},%20type:%20'bar',%20data:%20{...(()%20=>%20{%20let%20a%20=%20{%20labels:%20[],%20datasets:%20[]%20};%20`%201:%20Construction;%202:%20Loading%20Resources;%203:%20PreInitialization;%204:%20Initialization;%205:%20InterModComms$IMC;%206:%20PostInitialization;%207:%20LoadComplete;%208:%20ModIdMapping%20`%20.split(';')%20.map(l%20=>%20l.match(/\d:%20(.*)/).slice(1))%20.forEach(([name])%20=>%20a.datasets.push({%20label:%20name,%20data:%20[]%20}));%20`%201%202%203%204%205%206%207%208%20;%20Tinkers'%20Construct%20|%201.18|%200.01|%200.19|%200.08|%200.01|%2037.34|%200.02|%200.00;%20Ender%20IO%20|%201.96|%200.01|%204.80|%200.64|%204.13|%206.91|%200.02|%201.19;%20Immersive%20Engineering%20|%200.91|%200.01|%201.32|%201.07|%200.00|%2016.25|%200.02|%200.00;%20CraftTweaker2%20|%200.61|%200.00|%203.94|%200.03|%200.00|%2012.71|%200.03|%200.00;%20IndustrialCraft%202%20|%200.78|%200.02|%209.00|%200.98|%200.00|%201.38|%200.02|%200.00;%20Block%20Drops%20|%200.04|%200.00|%200.03|%200.02|%200.00|%2011.02|%200.02|%200.00;%20OpenComputers%20|%200.20|%200.02|%205.85|%203.18|%200.23|%200.02|%200.02|%200.00;%20Thaumcraft%20|%200.63|%200.01|%200.24|%200.46|%200.01|%207.72|%200.02|%200.00;%20Astral%20Sorcery%20|%200.26|%200.01|%205.47|%201.60|%200.00|%201.22|%200.02|%200.00;%20Animania%20|%200.41|%200.00|%203.82|%200.13|%200.00|%203.76|%200.02|%200.00;%20Dynamic%20Surroundings%20|%200.22|%200.01|%200.26|%200.17|%200.00|%200.08|%205.43|%200.00;%20Thaumic%20Additions:%20Reconstructed%20|%200.18|%200.00|%200.73|%200.41|%200.00|%204.62|%200.02|%200.00%20`%20.split(';').slice(1)%20.map(l%20=>%20l.split('|').map(s%20=>%20s.trim()))%20.forEach(([name,%20...arr],%20i)%20=>%20{%20a.labels.push(name);%20arr.forEach((v,%20j)%20=>%20a.datasets[j].data[i]%20=%20v)%20});%20return%20a%20})()}%20}"/>
</p>

<br>

# TOP JEI Registered Plugis
<p align="center">
<img src="https://quickchart.io/chart?w=700&c={%20options:%20{%20elements:%20{%20rectangle:%20{%20borderWidth:%201%20}%20},%20legend:%20false%20},%20type:%20'horizontalBar',%20data:%20{...(()%20=>%20{%20let%20a%20=%20{%20labels:%20[],%20datasets:%20[{%20backgroundColor:%20'rgba(0,%2099,%20132,%200.5)',%20borderColor:%20'rgb(0,%2099,%20132)',%20data:%20[]%20}]%20};%20`%204.62:%20crazypants.enderio.machines.integration.jei.MachinesPlugin;%203.69:%20com.rwtema.extrautils2.crafting.jei.XUJEIPlugin;%203.40:%20li.cil.oc.integration.jei.ModPluginOpenComputers;%203.01:%20cofh.thermalexpansion.plugins.jei.JEIPluginTE;%202.61:%20mezz.jei.plugins.vanilla.VanillaPlugin;%201.83:%20com.github.sokyranthedragon.mia.integrations.jer.JeiJerIntegration$1;%201.79:%20com.buuz135.industrial.jei.JEICustomPlugin;%201.47:%20jeresources.jei.JEIConfig;%201.32:%20forestry.factory.recipes.jei.FactoryJeiPlugin;%201.21:%20ic2.jeiIntegration.SubModule;%200.81:%20com.buuz135.thaumicjei.ThaumcraftJEIPlugin;%200.75:%20knightminer.tcomplement.plugin.jei.JEIPlugin;%200.67:%20nc.integration.jei.NCJEI;%200.65:%20mctmods.smelteryio.library.util.jei.JEI;%200.53:%20crazypants.enderio.base.integration.jei.JeiPlugin;%205.05:%20Other%20118%20Plugins%20`%20.split(';')%20.map(l%20=>%20l.split(':'))%20.forEach(([time,%20name])%20=>%20{%20a.labels.push(name);%20a.datasets[0].data.push(time)%20})%20;%20return%20a%20})()%20}%20}"/>
</p>

<br>

# FML Stuff
<p align="center">
<img src="https://quickchart.io/chart?w=500&h=400&c={%20options:%20{%20rotation:%20Math.PI,%20cutoutPercentage:%2055,%20plugins:%20{%20legend:%20!1,%20outlabels:%20{%20stretch:%205,%20padding:%201,%20text:%20(v)=>v.labels%20},%20doughnutlabel:%20{%20labels:%20[%20{%20text:%20'FML%20stuff:',%20color:%20'rgba(128,%20128,%20128,%200.5)',%20font:%20{size:%2018}%20},%20{%20text:%20[263.45,'s'].join(''),%20color:%20'rgba(128,%20128,%20128,%201)',%20font:%20{size:%2022}%20}%20]%20},%20}%20},%20type:%20'outlabeledPie',%20data:%20{...(()%20=>%20{%20let%20a%20=%20{%20labels:%20[],%20datasets:%20[{%20backgroundColor:%20[],%20data:%20[],%20borderColor:%20'rgba(22,22,22,0.3)',%20borderWidth:%202%20}]%20};%20`%20993A00%202.37s%20Loading%20sounds;%20994400%202.43s%20Loading%20Resource%20-%20SoundHandler;%20994F00%2056.83s%20ModelLoader:%20blocks;%20995900%2010.73s%20ModelLoader:%20items;%20996300%2011.04s%20ModelLoader:%20baking;%20996D00%206.13s%20Applying%20remove%20recipe%20actions;%20997700%205.26s%20Applying%20remove%20furnace%20recipe%20actions;%20998200%2031.57s%20Indexing%20ingredients;%20444444%20137.09s%20Other%20`%20.split(';')%20.map(l%20=>%20l.match(/(\w{6})%20*(\d*\.\d*)s%20(.*)/))%20.forEach(([,%20col,%20time,%20name])%20=>%20{%20a.labels.push([name,%20'%20',%20time,%20's'].join(''));%20a.datasets[0].data.push(parseFloat(time));%20a.datasets[0].backgroundColor.push([String.fromCharCode(35),%20col].join(''))%20})%20;%20return%20a%20})()}%20}"/>
</p>

<br>
