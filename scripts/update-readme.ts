import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

const readme = readFileSync('README.md', 'utf-8')
const rawHelp = execSync('npx tsx src/cli.ts --help', { encoding: 'utf-8', env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } }).trim()
// Strip ANSI escape codes
// eslint-disable-next-line no-control-regex
const helpOutput = rawHelp.replace(/\x1B\[[0-9;]*m/g, '')

const startMarker = '<!-- OPTIONS_START -->'
const endMarker = '<!-- OPTIONS_END -->'

const newSection = `${startMarker}\n\`\`\`\n${helpOutput}\n\`\`\`\n${endMarker}`

if (!readme.includes(startMarker) || !readme.includes(endMarker)) {
  console.error('README.md is missing OPTIONS_START/OPTIONS_END markers')
  process.exit(1)
}

const updated = readme.replace(
  new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`),
  newSection,
)

writeFileSync('README.md', updated)
console.log('README.md options section updated')
