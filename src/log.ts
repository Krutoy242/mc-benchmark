import process from 'node:process'
import chalkWeak from 'chalk'

const chalk = chalkWeak.constructor({ level: process.stderr.isTTY ? 3 : 0 })

const logger = {
  begin(s: string, newSteps?: number) {
    this.done()
    if (newSteps) {
      this.steps = 0
      this.maxSteps = newSteps
    }
    this.isUnfinishedTask = true
    if (this.level <= 1)
      process.stderr.write(`🔹 ${s.trim()}${newSteps ? ` [${newSteps}] ` : ''}`)
  },
  done(s = '') {
    if (!this.isUnfinishedTask)
      return
    this.isUnfinishedTask = false
    if (this.level <= 1)
      process.stderr.write(` ${chalk.gray(`${s} ✔`)}\n`)
  },
  step(s = '.') {
    if (this.steps % (Math.floor(this.maxSteps / 10)) === 0) {
      if (this.level <= 1)
        process.stderr.write(s)
    }
    this.steps++
  },
  result(s = '') {
    this.done()
    if (this.level <= 1)
      process.stderr.write(`✔️ ${chalk.dim.green(`${s}`)}\n`)
  },
  info(s = '') {
    this.done()
    if (this.level <= 0)
      process.stderr.write(`${chalk.dim.green('ℹ')} ${chalk.dim.gray(`${s}`)}\n`)
  },
  warn(...s: string[]) {
    this.done()
    if (this.level <= 2)
      process.stderr.write(`⚠️ ${chalk.dim.yellow(`${s.join('\t')}`)}\n`)
  },
  error(...s: string[]) {
    this.done()
    if (this.level <= 3)
      process.stderr.write(`🛑 ${chalk.dim.red (`${s.join('\t')}`)}\n`)
  },

  isUnfinishedTask: false,
  steps: 0,
  maxSteps: 0,
  level: 2,
}

export default logger
