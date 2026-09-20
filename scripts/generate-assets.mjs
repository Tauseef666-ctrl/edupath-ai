import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand");

const MARK_TILE = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="epg" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="12" fill="url(#epg)"/>
  <path d="M 13.5 33.5 L 24 22.5 L 34.5 12.5" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.65"/>
  <circle cx="13.5" cy="33.5" r="4.25" fill="#ffffff"/>
  <circle cx="24" cy="22.5" r="5.5" fill="#ffffff"/>
  <circle cx="34.5" cy="12.5" r="6.75" fill="none" stroke="#ffffff" stroke-width="2.25"/>
  <circle cx="34.5" cy="12.5" r="2.5" fill="#ffffff"/>
</svg>`;

const MARK_FLAT = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="epgf" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <path d="M 13.5 33.5 L 24 22.5 L 34.5 12.5" stroke="url(#epgf)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
  <circle cx="13.5" cy="33.5" r="4" fill="#6366f1"/>
  <circle cx="24" cy="22.5" r="5.25" fill="#6366f1"/>
  <circle cx="34.5" cy="12.5" r="6.75" fill="none" stroke="#6366f1" stroke-width="2.25"/>
  <circle cx="34.5" cy="12.5" r="2.4" fill="#6366f1"/>
</svg>`;

const WORDMARK = `<svg width="196" height="48" viewBox="0 0 196 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${MARK_TILE.replace('<svg width="48" height="48" viewBox="0 0 48 48"', '<svg width="48" height="48" viewBox="0 0 48 48"').replace(/width="48" height="48" viewBox="0 0 48 48" fill="none"/, 'width="48" height="48" viewBox="0 0 48 48" fill="none"')}
  <text x="60" y="30" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" letter-spacing="-0.02em" fill="#0f172a">EduPath</text>
  <text x="160" y="30" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" letter-spacing="-0.02em" fill="#6366f1">AI</text>
</svg>`;

const OG = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0b1020"/>
      <stop offset="0.55" stop-color="#10142a"/>
      <stop offset="1" stop-color="#171533"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(290 315) rotate(90) scale(360)">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="epo" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(120 190) scale(2.6)">
    <rect width="48" height="48" rx="12" fill="url(#epo)"/>
    <path d="M 13.5 33.5 L 24 22.5 L 34.5 12.5" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.65"/>
    <circle cx="13.5" cy="33.5" r="4.25" fill="#ffffff"/>
    <circle cx="24" cy="22.5" r="5.5" fill="#ffffff"/>
    <circle cx="34.5" cy="12.5" r="6.75" fill="none" stroke="#ffffff" stroke-width="2.25"/>
    <circle cx="34.5" cy="12.5" r="2.5" fill="#ffffff"/>
  </g>
  <text x="290" y="252" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="84" font-weight="800" letter-spacing="-0.03em" fill="#ffffff">EduPath <tspan fill="#a5b4fc">AI</tspan></text>
  <text x="292" y="330" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="40" font-weight="600" letter-spacing="-0.01em" fill="#dfe5f5">Your learning path should adapt to you.</text>
  <circle cx="292" cy="420" r="6" fill="#818cf8"/>
  <path d="M 292 420 L 380 420" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>
  <text x="402" y="430" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="500" fill="#9aa6c8">Adaptive learning &amp; skill-gap agent · Agentic AI Hackathon 2026</text>
</svg>`;

const OUTPUTS = [
  { name: "edupath-mark.svg", content: MARK_FLAT },
  { name: "edupath-mark-tile.svg", content: MARK_TILE },
  { name: "edupath-wordmark.svg", content: WORDMARK },
  { name: "edupath-logo.svg", content: WORDMARK },
  { name: "og-image.svg", content: OG },
];

await mkdir(brandDir, { recursive: true });

for (const out of OUTPUTS) {
  await writeFile(join(brandDir, out.name), out.content, "utf8");
  console.log("wrote", "public/brand/" + out.name);
}

const pngTasks = [
  { name: "favicon.png", svg: MARK_TILE, size: 64 },
  { name: "apple-touch-icon.png", svg: MARK_TILE, size: 180 },
  { name: "og-image.png", svg: OG, size: 1200 },
];

await mkdir(join(root, "src", "app"), { recursive: true });
await writeFile(join(root, "src", "app", "icon.svg"), MARK_TILE, "utf8");
console.log("wrote", "src/app/icon.svg");

for (const task of pngTasks) {
  const buf = await sharp(Buffer.from(task.svg)).resize(task.size, task.size).png().toBuffer();
  if (task.name === "favicon.png") {
    await writeFile(join(root, "src", "app", "icon.png"), buf);
    console.log("wrote", "src/app/icon.png");
  } else if (task.name === "apple-touch-icon.png") {
    await writeFile(join(root, "src", "app", "apple-icon.png"), buf);
    console.log("wrote", "src/app/apple-icon.png");
  } else {
    await writeFile(join(root, "public", "brand", task.name), buf);
    console.log("wrote", "public/brand/og-image.png");
  }
}

console.log("done");