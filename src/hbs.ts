import type logger from './log'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'

export async function compose(data: any, log: typeof logger, nondefaultTemplate: string | undefined): Promise<string> {
  await log.begin('Loading Handlebars template')
  const templatePath = nondefaultTemplate || path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'template.hbs',
  )
  const templateRaw = fs.readFileSync(templatePath, 'utf-8')

  await log.info('Compiling template')
  const template = Handlebars.compile(templateRaw)

  await log.info('Loading helpers')
  // @ts-expect-error any
  const helpers = await import('./helpers.hbs.js')

  for (const [name, fnc] of Object.entries(helpers.default)) {
    Handlebars.registerHelper(name, fnc as any)
  }

  await log.info('Applying data to template')
  return template(data)
}
