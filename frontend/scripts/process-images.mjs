// Process the six generated source images into optimized web assets.
// - Crops the tiny corner watermark "sparkle" from IMG5/IMG6 (bottom-right corner).
// - Resizes each to a web-friendly size.
// - Converts to WebP for the browser.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const srcDir = join(__dirname, '..', '..', 'imgs')
const outDir = join(__dirname, '..', 'public', 'assets')

mkdirSync(outDir, { recursive: true })

const jobs = [
  // name, out, width, crop watermark corner
  ['IMG1.png', 'hero-vault.webp', 1600, null],
  ['IMG2.png', 'hero-plinth.webp', 1600, null],
  ['IMG3.png', 'texture-contours.webp', 1400, null],
  ['IMG4.png', 'texture-paper.webp', 1400, null],
  ['IMG5.png', 'texture-sage.webp', 1400, 'br'],
  ['IMG6.png', 'texture-charcoal.webp', 1400, 'br'],
]

for (const [name, out, width, crop] of jobs) {
  let img = sharp(join(srcDir, name)).rotate()
  if (crop === 'br') {
    // Remove the bottom-right watermark sparkle: crop ~4% off the right and bottom.
    const meta = await img.metadata()
    const cw = Math.round(meta.width * 0.045)
    const ch = Math.round(meta.height * 0.055)
    img = img.extract({ left: 0, top: 0, width: meta.width - cw, height: meta.height - ch })
  }
  await img
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(join(outDir, out))
  console.log('wrote', out)
}
