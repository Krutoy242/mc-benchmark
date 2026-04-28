import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'
import Handlebars from 'handlebars'
import helpers from './helpers.hbs.js'

export async function compose(data: any, nondefaultTemplate: string | undefined): Promise<string> {
  consola.start('Loading Handlebars template')
  const templatePath = nondefaultTemplate || path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'template.hbs',
  )
  const templateRaw = fs.readFileSync(templatePath, 'utf-8')

  consola.info('Compiling template')
  const hbs = Handlebars.create()
  for (const [name, fnc] of Object.entries(helpers)) {
    hbs.registerHelper(name, fnc as any)
  }
  const template = hbs.compile(templateRaw)

  consola.info('Applying data to template')
  return template(data)
}
