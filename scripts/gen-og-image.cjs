const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;
const markSize = 220;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#FAFAF7"/>
  <rect x="0" y="0" width="${WIDTH}" height="10" fill="#FF5A1F"/>
  <text x="${WIDTH / 2}" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="44" fill="#16181D">Become the <tspan fill="#FF5A1F">Answer</tspan></text>
  <text x="${WIDTH / 2}" y="475" text-anchor="middle" font-family="Arial, sans-serif" font-weight="400" font-size="24" fill="#3A3F4A">Answer Engine Optimization, practiced in the open</text>
</svg>
`;

const markPath = path.join(__dirname, '../src/assets/brand/mark.svg');

async function run() {
  const markPng = await sharp(markPath).resize(markSize, markSize).png().toBuffer();
  const base = sharp(Buffer.from(svg));
  const out = await base
    .composite([{ input: markPng, left: Math.round((WIDTH - markSize) / 2), top: 120 }])
    .png()
    .toBuffer();
  const outPath = path.join(__dirname, '../public/og-default.png');
  fs.writeFileSync(outPath, out);
  console.log('wrote', outPath, out.length, 'bytes');

  const logoPng = await sharp(markPath).resize(512, 512).png().toBuffer();
  const logoPath = path.join(__dirname, '../public/logo.png');
  fs.writeFileSync(logoPath, logoPng);
  console.log('wrote', logoPath, logoPng.length, 'bytes');
}

run().catch((e) => { console.error(e); process.exit(1); });
