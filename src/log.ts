import process from 'node:process'
import chalk from 'chalk'

const logger = {
  begin(s: string, newSteps?: number) {
    this.done()
    if (newSteps) {
      this.steps = newSteps
      this.stepSize = newSteps / 30
    }
    process.stdout.write(`🔹 ${s.trim()}${newSteps ? ` [${newSteps}] ` : ''}`)
    this.isUnfinishedTask = true
  },
  done(s = '') {
    if (!this.isUnfinishedTask)
      return
    process.stdout.write(` ${chalk.gray(`${s} ✔`)}\n`)
    this.isUnfinishedTask = false
  },
  step(s = '.') {
    if (this.steps <= 30 || (this.steps-- % this.stepSize === 0)) {
      process.stdout.write(s)
    }
  },
  result(s = '') {
    this.done()
    process.stdout.write(`✔️ ${chalk.dim.green(`${s}`)}\n`)
  },
  info(s = '') {
    this.done()
    process.stdout.write(`${chalk.dim.green('ℹ')} ${chalk.dim.gray(`${s}`)}\n`)
  },
  warn(...s: string[]) {
    this.done()
    process.stdout.write(`⚠️ ${chalk.dim.yellow(`${s.join('\t')}`)}\n`)
  },
  error(...s: string[]) {
    this.done()
    process.stdout.write(`🛑 ${chalk.dim.red (`${s.join('\t')}`)}\n`)
  },

  isUnfinishedTask: false,
  steps: 0,
  stepSize: 0,
}

export default logger
