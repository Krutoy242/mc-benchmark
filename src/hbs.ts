import type logger from './log.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'
import helpers from './helpers.hbs.js'

export async function compose(data: any, log: typeof logger, nondefaultTemplate: string | undefined): Promise<string> {
  log.begin('Loading Handlebars template')
  const templatePath = nondefaultTemplate || path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'template.hbs',
  )
  const templateRaw = fs.readFileSync(templatePath, 'utf-8')

  log.info('Compiling template')
  const hbs = Handlebars.create()
  for (const [name, fnc] of Object.entries(helpers)) {
    hbs.registerHelper(name, fnc as any)
  }
  const template = hbs.compile(templateRaw)

  log.info('Applying data to template')
  return template(data)
}
