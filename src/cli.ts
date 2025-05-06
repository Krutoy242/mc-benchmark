#!/usr/bin/env node

import process from 'node:process'
import yargs from 'yargs'
import parseDebugLog from '.'

const argv = yargs(process.argv.slice(2))
  .option('input', {
    alias: 'i',
    type: 'string',
    describe: 'Debug.log path',
    default: 'logs/debug.log',
  })
  .option('ctlog', {
    alias: 'c',
    type: 'string',
    describe: 'crafttweaker.log path',
    default: 'crafttweaker.log',
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    describe: 'Output file path',
    default: 'benchmark.md',
  })
  .option('data', {
    alias: 'a',
    type: 'string',
    describe: 'Output of gathered .json data',
  })
  .option('nospaces', {
    alias: 'n',
    type: 'boolean',
    describe: 'Replace all space characters "\\s" in image code. Useful for posting on GitHub.',
    default: false,
  })
  .option('detailed', {
    alias: 'd',
    type: 'number',
    describe: 'Count of detailed mods in main pie chart',
    default: 20,
  })
  .option('modpack', {
    alias: 'm',
    type: 'string',
    describe: 'Modpack name in header',
  })
  .option('cwd', {
    type: 'string',
    describe: 'Minecraft directory to OPEN files from',
    default: './',
  })
  // .option('unlisted', {
  //   alias: 'u',
  //   type: 'boolean',
  //   describe: 'Output unlisted tooks in console',
  //   default: false,
  // })
  .version(false)
  .wrap(null)
  .parseSync()

export type Args = typeof argv

await parseDebugLog(argv)
