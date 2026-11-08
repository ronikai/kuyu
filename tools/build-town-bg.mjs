import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const W = 40, H = 24, T = 16;
const ROOT = process.cwd();
const WORLD = path.join(ROOT, "public/assets/world");
const PROPS = path.join(ROOT, "public/assets/0x72/props");
const TILES = path.join(ROOT, "public/assets/0x72/tiles");

const cache = new Map();
function img(name, folder = WORLD) {
	const key = path.join(folder, `${name}.png`);
	if (!cache.has(key)) cache.set(key, PNG.sync.read(fs.readFileSync(key)));
	return cache.get(key);
}

const dst = new PNG({ width: W * T, height: H * T });
for (let i = 3; i < dst.data.length; i += 4) dst.data[i] = 255;

function blend(dst, dx, dy, r, g, b, a) {
	if (dx < 0 || dy < 0 || dx >= dst.width || dy >= dst.height) return;
	const i = (dst.width * dy + dx) << 2;
	const sa = a / 255;
	const da = dst.data[i + 3] / 255;
	const oa = sa + da * (1 - sa);
	if (oa <= 0) return;
	dst.data[i] = Math.round((r * sa + dst.data[i] * da * (1 - sa)) / oa);
	dst.data[i + 1] = Math.round((g * sa + dst.data[i + 1] * da * (1 - sa)) / oa);
	dst.data[i + 2] = Math.round((b * sa + dst.data[i + 2] * da * (1 - sa)) / oa);
	dst.data[i + 3] = Math.round(oa * 255);
}

function drawImage(src, dx, dy, scale = 1) {
	for (let y = 0; y < src.height; y++) {
		for (let x = 0; x < src.width; x++) {
			const si = (src.width * y + x) << 2;
			const a = src.data[si + 3];
			if (!a) continue;
			const r = src.data[si], g = src.data[si + 1], b = src.data[si + 2];
			for (let sy = 0; sy < scale; sy++) {
				for (let sx = 0; sx < scale; sx++) {
					blend(dst, dx + x * scale + sx, dy + y * scale + sy, r, g, b, a);
				}
			}
		}
	}
}

function tile(name, tx, ty, scale = 1, folder = WORLD) {
	drawImage(img(name, folder), tx * T, ty * T, scale);
}

function rect(x, y, w, h, r, g, b, a) {
	for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) blend(dst, x + xx, y + yy, r, g, b, a);
}

// grass base
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) tile("grass", x, y);

// paths
for (let y = 2; y < H - 1; y++) for (const x of [19, 20, 21]) tile("dirt", x, y);
for (let x = 2; x < W - 2; x++) for (const y of [11, 12, 13]) tile("dirt", x, y);
for (const px of [6, 14, 27, 33]) for (let y = 6; y <= 13; y++) tile("dirt", px, y);
for (const px of [6, 33]) for (let y = 18; y <= 22; y++) tile("dirt", px, y);

// pond + shore
rect(3 * T - 2, 19 * T - 2, 6 * T + 4, 4 * T + 4, 90, 70, 50, 40);
for (let y = 19; y <= 22; y++) for (let x = 3; x <= 8; x++) tile("water", x, y);

// houses
const houses = [[5, 3], [13, 3], [26, 3], [32, 3], [5, 15], [32, 15]];
for (const [hx, hy] of houses) {
	rect((hx + 2) * T - 32, (hy + 3) * T - 6, 64, 10, 0, 0, 0, 70);
	for (let y = 0; y < 2; y++) for (let x = 0; x < 4; x++) tile("roof_red", hx + x, hy + y);
	for (let x = 0; x < 4; x++) tile("wall_stone", hx + x, hy + 2);
	tile("door", hx + 1, hy + 2);
}

// trees (border + decorative) are added as live sprites in-game for depth
if (false) {
for (let x = 0; x < W; x++) {
	for (const y of [0, H - 1]) {
		const s = 1.25;
		const px = x * T + 8;
		const py = (y + 1) * T;
		rect(px - 10, py - 6, 20, 8, 0, 0, 0, 55);
		drawImage(img("tree"), px - 8 * s, py - 16 * s, s);
	}
}
for (let y = 0; y < H; y++) {
	for (const x of [0, W - 1]) {
		const s = 1.25;
		const px = x * T + 8;
		const py = (y + 1) * T;
		rect(px - 10, py - 6, 20, 8, 0, 0, 0, 55);
		drawImage(img("tree"), px - 8 * s, py - 16 * s, s);
	}
}
const trees = [[2, 7, 1.8], [9, 2, 1.6], [17, 2, 1.6], [24, 2, 1.6], [30, 8, 1.8], [37, 8, 1.8], [2, 17, 1.6], [9, 18, 1.5], [30, 19, 1.7], [37, 18, 1.6]];
for (const [x, y, s] of trees) {
	const px = x * T + 8;
	const py = (y + 1) * T;
	rect(px - 10, py - 6, 20, 8, 0, 0, 0, 60);
	drawImage(img("tree"), px - 8 * s, py - 16 * s, s);
}

}

// flowers
const flowers = [[3, 5], [9, 4], [17, 4], [24, 4], [30, 4], [36, 4], [2, 10], [12, 10], [16, 10], [24, 10], [28, 10], [36, 10], [3, 14], [10, 14], [24, 14], [28, 14], [12, 18], [16, 18], [24, 18], [28, 18]];
for (const [x, y] of flowers) tile("flowers", x, y);

// lamps
for (const [x, y] of [[18, 10], [22, 10], [18, 14], [22, 14]]) {
	drawImage(img("column", PROPS), x * T, (y + 1) * T - 48, 1);
}

// crates / stalls
drawImage(img("crate", PROPS), 15 * T, 10 * T - 8, 1);
drawImage(img("crate", PROPS), 25 * T, 10 * T - 8, 1);

// well
const ring = [[19, 11], [20, 11], [21, 11], [19, 12], [21, 12], [19, 13], [21, 13]];
for (const [x, y] of ring) tile("wall_stone", x, y);
drawImage(img("hole", TILES), 20 * T, 12 * T, 1);

// finish
fs.writeFileSync(path.join(WORLD, "town_bg.png"), PNG.sync.write(dst));
console.log("wrote town_bg.png", dst.width, dst.height);
