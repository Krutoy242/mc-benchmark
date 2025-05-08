import { readFileSync, writeFileSync } from 'node:fs'

const template = readFileSync('src/template.hbs', 'utf8')
const nospaces = template.replace(/<img src="([\s\S]+?)"\/>/g, m => m.replace(/\s*\n\s*/g, '%20'))
writeFileSync('src/template-nospaces.hbs', nospaces)
