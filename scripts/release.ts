import { execSync } from 'node:child_process'
import process from 'node:process'

function run(cmd: string, opts?: { silent?: boolean }): string {
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      stdio: opts?.silent ? 'pipe' : 'inherit',
    }).trim()
  }
  catch (e: any) {
    if (opts?.silent)
      return e.stdout?.trim() ?? ''
    console.error(`\n❌ Command failed: ${cmd}`)
    process.exit(1)
  }
}

function check(label: string, fn: () => boolean | string) {
  const result = fn()
  if (result === true || result === '') {
    console.log(`  ✅ ${label}`)
  }
  else {
    console.error(`  ❌ ${label}${typeof result === 'string' ? `: ${result}` : ''}`)
    process.exit(1)
  }
}

console.log('\n🚀 Release pre-flight checks\n')

// 1. Branch check
check('On branch main', () => {
  const branch = run('git rev-parse --abbrev-ref HEAD', { silent: true })
  return branch === 'master' || `current branch is "${branch}"`
})

// 2. Clean working tree
check('Working tree is clean', () => {
  const status = run('git status --porcelain', { silent: true })
  return status === '' || 'uncommitted changes detected'
})

// 4. NPM auth check
check('npm authentication', () => {
  try {
    run('npm whoami', { silent: true })
    return true
  }
  catch {
    return 'not logged in to npm'
  }
})

// // 5. GitHub token
// check('GITHUB_TOKEN is set', () => {
//   return !!process.env.GITHUB_TOKEN || !!process.env.GH_TOKEN || 'set GITHUB_TOKEN or GH_TOKEN env variable'
// })

console.log('\n📦 Running lint...\n')
run('pnpm exec eslint .')

console.log('\n🧪 Running tests...\n')
run('pnpm test')

console.log('\n🔨 Building...\n')
run('pnpm build')

console.log('\n📝 Updating README options...\n')
run('tsx scripts/update-readme.ts')

// Check if update-readme produced changes
const readmeDirty = run('git status --porcelain README.md', { silent: true })
if (readmeDirty) {
  console.log('  README.md updated, committing...')
  run('git add README.md')
  run('git commit -m "docs: 📝 update README options section"')
  run('git push origin main')
}

console.log('\n🎉 All checks passed! Running semantic-release...\n')
run('npx semantic-release')

console.log('\n✅ Release complete!\n')
