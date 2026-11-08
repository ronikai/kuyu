import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROGUE = "C:/Users/PC/Desktop/asset-havuzu/kenney/roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png";
const TINY = "C:/Users/PC/Desktop/asset-havuzu/kenney/tiny-town/Tiles";
const OUT = path.join(process.cwd(), "public/assets/world");
fs.mkdirSync(OUT, { recursive: true });

const sheet = PNG.sync.read(fs.readFileSync(ROGUE));

function cropRogue(col, row, name) {
  const x = col * 17;
  const y = row * 17;
  const out = new PNG({ width: 16, height: 16 });
  PNG.bitblt(sheet, out, x, y, 16, 16, 0, 0);
  fs.writeFileSync(path.join(OUT, `${name}.png`), PNG.sync.write(out));
  console.log(name);
}

cropRogue(5, 0, "grass");
cropRogue(6, 1, "dirt");
cropRogue(5, 2, "wood_floor");
cropRogue(14, 12, "wall_beige");
cropRogue(13, 15, "wall_base");

for (const [src, name] of [
  ["tile_0016.png", "tree"],
  ["tile_0064.png", "roof_red"],
  ["tile_0048.png", "wall_stone"],
  ["tile_0074.png", "door"],
]) {
  fs.copyFileSync(path.join(TINY, src), path.join(OUT, `${name}.png`));
  console.log(name);
}
