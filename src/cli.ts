#!/usr/bin/env node

import process from 'node:process'
import yargs from 'yargs'
import parseDebugLog from '.'
import logger from './log'

const argv = yargs(process.argv.slice(2))
  .positional('input', { type: 'string', describe: 'Debug.log path', default: 'logs/debug.log' })
  .option('ctlog', { alias: 'c', type: 'string', describe: 'crafttweaker.log path', default: 'crafttweaker.log' })
  .option('data', { alias: 'a', type: 'string', describe: 'Output of gathered .json data' })
  .option('detailed', { alias: 'd', type: 'number', describe: 'Count of detailed mods in main pie chart', default: 16 })
  .option('template', { alias: 't', type: 'string', describe: 'Non-default template path' })
  .option('modpack', { alias: 'm', type: 'string', describe: 'Modpack name in header' })
  .option('verbose', { alias: 'v', type: 'count', describe: 'Verbose level -v INFO or -vv DEBUG' })
  .option('cwd', { type: 'string', describe: 'Minecraft directory to OPEN files from', default: './' })
  .version(false)
  .wrap(null)
  .command('[input]', '')
  .parseSync()

export type Args = typeof argv

logger.level -= argv.verbose

await parseDebugLog(argv)
