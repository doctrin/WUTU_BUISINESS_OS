import fs   from 'fs'
import path  from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src  = path.join(__dirname, 'pre-commit')
const dest = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit')

try {
  fs.copyFileSync(src, dest)
  fs.chmodSync(dest, 0o755)
  console.log('✅ Git hooks 설치 완료 (.git/hooks/pre-commit)')
} catch (err) {
  console.warn('⚠️  Git hooks 설치 실패:', err.message)
}
