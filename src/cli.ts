#!/usr/bin/env node

import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import parseDebugLog from './index.js'

const main = defineCommand({
  meta: {
    name: 'mc-benchmark',
    description: 'Build charts about load time of Minecraft modpack.',
  },
  args: {
    input: {
      type: 'positional',
      description: 'debug.log path',
      default: 'logs/debug.log',
    },
    ctlog: {
      type: 'string',
      description: 'crafttweaker.log path',
      default: 'crafttweaker.log',
      alias: 'c',
    },
    data: {
      type: 'string',
      description: 'Output of gathered .json data',
      alias: 'a',
    },
    detailed: {
      type: 'string',
      description: 'Count of detailed mods in main pie chart',
      default: '16',
      alias: 'd',
    },
    template: {
      type: 'string',
      description: 'Non-default template path',
      alias: 't',
    },
    modpack: {
      type: 'string',
      description: 'Modpack name in header',
      alias: 'm',
    },
    verbose: {
      type: 'boolean',
      description: 'Verbose level -v INFO or -vv DEBUG',
      alias: 'v',
    },
    cwd: {
      type: 'string',
      description: 'Minecraft directory to OPEN files from',
      default: './',
    },
    nospaces: {
      type: 'boolean',
      description: 'Replace all space characters "\\s" in image code. Useful for posting on GitHub.',
      default: false,
      alias: 'n',
    },
  },
  async run({ args }) {
    consola.options.stdout = process.stderr
    consola.options.stderr = process.stderr
    // @ts-expect-error fancy is missing in types
    consola.options.fancy = process.stderr.isTTY

    // Manual count of verbose flags
    const verboseCount = process.argv.filter(arg => arg === '-v' || arg === '-vv' || arg === '--verbose').reduce((acc, arg) => {
      if (arg === '-vv')
        return acc + 2
      return acc + 1
    }, 0)

    consola.level = Math.max(1, 2 + verboseCount)

    await parseDebugLog({
      ...args,
      detailed: Number.parseInt(args.detailed),
      verbose: verboseCount,
    })
  },
})

runMain(main)
