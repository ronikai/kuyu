import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const DESKTOP = "C:/Users/PC/Desktop";
const SRC = path.join(DESKTOP, "asset-havuzu/0x72/extracted/0x72_DungeonTilesetII_v1.7/frames");
const KENNEY = path.join(DESKTOP, "asset-havuzu/kenney");
const OUT = path.join(process.cwd(), "public/assets");
const OUT_0X72 = path.join(OUT, "0x72");
const OUT_KENNEY = path.join(OUT, "kenney");

fs.mkdirSync(path.join(OUT_0X72, "tiles"), { recursive: true });
fs.mkdirSync(path.join(OUT_0X72, "props"), { recursive: true });
fs.mkdirSync(path.join(OUT_0X72, "weapons"), { recursive: true });
fs.mkdirSync(path.join(OUT_0X72, "ui"), { recursive: true });
fs.mkdirSync(path.join(OUT_0X72, "chars"), { recursive: true });
fs.mkdirSync(path.join(OUT_KENNEY, "sfx"), { recursive: true });
fs.mkdirSync(path.join(OUT_KENNEY, "font"), { recursive: true });
fs.mkdirSync(path.join(OUT_KENNEY, "music"), { recursive: true });
fs.mkdirSync(path.join(OUT, "licenses"), { recursive: true });
fs.mkdirSync(path.join(OUT, "fx"), { recursive: true });

const readPng = (file) => PNG.sync.read(fs.readFileSync(file));

function packStrip(files, outName) {
  const pngs = files.map((f) => readPng(path.join(SRC, f)));
  const w = pngs[0].width;
  const h = pngs[0].height;
  for (const p of pngs) {
    if (p.width !== w || p.height !== h) {
      throw new Error(`Frame size mismatch in ${outName}: ${p.width}x${p.height} vs ${w}x${h}`);
    }
  }
  const out = new PNG({ width: w * pngs.length, height: h });
  pngs.forEach((p, i) => {
    PNG.bitblt(p, out, 0, 0, w, h, i * w, 0);
  });
  const dest = path.join(OUT_0X72, "chars", outName);
  fs.writeFileSync(dest, PNG.sync.write(out));
  console.log(`packed ${outName} -> ${out.width}x${out.height} (${pngs.length} frames)`);
  return { width: w, height: h, frames: pngs.length };
}

const anims = {
  hero: {
    idle: ["knight_m_idle_anim_f0.png", "knight_m_idle_anim_f1.png", "knight_m_idle_anim_f2.png", "knight_m_idle_anim_f3.png"],
    run: ["knight_m_run_anim_f0.png", "knight_m_run_anim_f1.png", "knight_m_run_anim_f2.png", "knight_m_run_anim_f3.png"],
    hit: ["knight_m_hit_anim_f0.png"],
  },
  sister: {
    idle: ["elf_f_idle_anim_f0.png", "elf_f_idle_anim_f1.png", "elf_f_idle_anim_f2.png", "elf_f_idle_anim_f3.png"],
    run: ["elf_f_run_anim_f0.png", "elf_f_run_anim_f1.png", "elf_f_run_anim_f2.png", "elf_f_run_anim_f3.png"],
    hit: ["elf_f_hit_anim_f0.png"],
  },
  priest: {
    idle: ["wizzard_m_idle_anim_f0.png", "wizzard_m_idle_anim_f1.png", "wizzard_m_idle_anim_f2.png", "wizzard_m_idle_anim_f3.png"],
    run: ["wizzard_m_run_anim_f0.png", "wizzard_m_run_anim_f1.png", "wizzard_m_run_anim_f2.png", "wizzard_m_run_anim_f3.png"],
    hit: ["wizzard_m_hit_anim_f0.png"],
  },
  merchant: {
    idle: ["dwarf_m_idle_anim_f0.png", "dwarf_m_idle_anim_f1.png", "dwarf_m_idle_anim_f2.png", "dwarf_m_idle_anim_f3.png"],
    run: ["dwarf_m_run_anim_f0.png", "dwarf_m_run_anim_f1.png", "dwarf_m_run_anim_f2.png", "dwarf_m_run_anim_f3.png"],
    hit: ["dwarf_m_hit_anim_f0.png"],
  },
  ghost: {
    idle: ["angel_idle_anim_f0.png", "angel_idle_anim_f1.png", "angel_idle_anim_f2.png", "angel_idle_anim_f3.png"],
    run: ["angel_run_anim_f0.png", "angel_run_anim_f1.png", "angel_run_anim_f2.png", "angel_run_anim_f3.png"],
  },
  goblin: {
    idle: ["goblin_idle_anim_f0.png", "goblin_idle_anim_f1.png", "goblin_idle_anim_f2.png", "goblin_idle_anim_f3.png"],
    run: ["goblin_run_anim_f0.png", "goblin_run_anim_f1.png", "goblin_run_anim_f2.png", "goblin_run_anim_f3.png"],
  },
  skelet: {
    idle: ["skelet_idle_anim_f0.png", "skelet_idle_anim_f1.png", "skelet_idle_anim_f2.png", "skelet_idle_anim_f3.png"],
    run: ["skelet_run_anim_f0.png", "skelet_run_anim_f1.png", "skelet_run_anim_f2.png", "skelet_run_anim_f3.png"],
  },
  imp: {
    idle: ["imp_idle_anim_f0.png", "imp_idle_anim_f1.png", "imp_idle_anim_f2.png", "imp_idle_anim_f3.png"],
    run: ["imp_run_anim_f0.png", "imp_run_anim_f1.png", "imp_run_anim_f2.png", "imp_run_anim_f3.png"],
  },
  orc: {
    idle: ["orc_warrior_idle_anim_f0.png", "orc_warrior_idle_anim_f1.png", "orc_warrior_idle_anim_f2.png", "orc_warrior_idle_anim_f3.png"],
    run: ["orc_warrior_run_anim_f0.png", "orc_warrior_run_anim_f1.png", "orc_warrior_run_anim_f2.png", "orc_warrior_run_anim_f3.png"],
  },
  demon: {
    idle: ["big_demon_idle_anim_f0.png", "big_demon_idle_anim_f1.png", "big_demon_idle_anim_f2.png", "big_demon_idle_anim_f3.png"],
    run: ["big_demon_run_anim_f0.png", "big_demon_run_anim_f1.png", "big_demon_run_anim_f2.png", "big_demon_run_anim_f3.png"],
  },
};

const manifest = {};
for (const [name, groups] of Object.entries(anims)) {
  const files = [];
  const ranges = {};
  let cursor = 0;
  for (const [anim, list] of Object.entries(groups)) {
    ranges[anim] = { from: cursor, to: cursor + list.length - 1 };
    cursor += list.length;
    files.push(...list);
  }
  manifest[name] = { ...packStrip(files, `${name}.png`), anims: ranges };
}

// static tiles / props
const single = {
  tiles: [
    "floor_1", "floor_2", "floor_3", "floor_4", "floor_5", "floor_6", "floor_7", "floor_8",
    "floor_stairs", "floor_ladder", "hole",
  ],
  props: [
    "wall_mid", "wall_top_mid", "wall_left", "wall_right", "wall_top_left", "wall_top_right",
    "wall_banner_red", "wall_banner_blue", "wall_banner_yellow", "wall_hole_1", "wall_hole_2", "wall_goo", "wall_goo_base",
    "column", "column_wall", "crate", "skull",
    "button_red_up", "button_red_down", "button_blue_up", "button_blue_down",
    "lever_left", "lever_right",
    "flask_big_blue", "flask_big_red", "flask_big_green", "flask_big_yellow",
    "flask_blue", "flask_red", "flask_green", "flask_yellow",
    "doors_frame_left", "doors_frame_right", "doors_frame_top", "doors_leaf_closed", "doors_leaf_open",
    "chest_empty_open_anim_f0", "chest_empty_open_anim_f1", "chest_empty_open_anim_f2",
    "chest_full_open_anim_f0", "chest_full_open_anim_f1", "chest_full_open_anim_f2",
    "floor_spikes_anim_f0", "floor_spikes_anim_f1", "floor_spikes_anim_f2", "floor_spikes_anim_f3",
    "wall_fountain_mid_blue_anim_f0", "wall_fountain_basin_blue_anim_f0", "wall_fountain_top_1",
  ],
  weapons: ["weapon_knight_sword", "weapon_regular_sword", "weapon_rusty_sword"],
  ui: ["ui_heart_full", "ui_heart_empty", "ui_heart_half"],
};

for (const [folder, names] of Object.entries(single)) {
  for (const n of names) {
    const src = path.join(SRC, `${n}.png`);
    if (!fs.existsSync(src)) {
      console.warn(`missing ${n}.png`);
      continue;
    }
    fs.copyFileSync(src, path.join(OUT_0X72, folder, `${n}.png`));
  }
}

// animated props as strips
packStrip(
  ["chest_empty_open_anim_f0.png", "chest_empty_open_anim_f1.png", "chest_empty_open_anim_f2.png"],
  "../props/chest_open.png",
);
packStrip(
  ["floor_spikes_anim_f0.png", "floor_spikes_anim_f1.png", "floor_spikes_anim_f2.png", "floor_spikes_anim_f3.png"],
  "../props/spikes.png",
);
packStrip(
  ["coin_anim_f0.png", "coin_anim_f1.png", "coin_anim_f2.png", "coin_anim_f3.png"],
  "../props/coin.png",
);
packStrip(
  ["wall_fountain_mid_blue_anim_f0.png", "wall_fountain_mid_blue_anim_f1.png", "wall_fountain_mid_blue_anim_f2.png"],
  "../props/fountain.png",
);

// Kenney audio/font
const sfxMap = {
  swing: path.join(KENNEY, "impact-sounds/Audio/impactSoft_medium_000.ogg"),
  hit: path.join(KENNEY, "impact-sounds/Audio/impactPunch_medium_000.ogg"),
  hurt: path.join(KENNEY, "impact-sounds/Audio/impactPunch_heavy_000.ogg"),
  step: path.join(KENNEY, "impact-sounds/Audio/footstep_concrete_001.ogg"),
  break: path.join(KENNEY, "impact-sounds/Audio/impactGlass_heavy_000.ogg"),
  pickup: path.join(KENNEY, "interface-sounds/Audio/confirmation_002.ogg"),
  open: path.join(KENNEY, "interface-sounds/Audio/open_001.ogg"),
  ghost: path.join(KENNEY, "interface-sounds/Audio/bong_001.ogg"),
  select: path.join(KENNEY, "interface-sounds/Audio/select_001.ogg"),
  talk: path.join(KENNEY, "interface-sounds/Audio/click_002.ogg"),
  roar: path.join(KENNEY, "impact-sounds/Audio/impactMetal_heavy_000.ogg"),
};
for (const [name, src] of Object.entries(sfxMap)) {
  if (!fs.existsSync(src)) {
    console.warn(`missing sfx ${src}`);
    continue;
  }
  fs.copyFileSync(src, path.join(OUT_KENNEY, "sfx", `${name}.ogg`));
}

const font = path.join(KENNEY, "kenney-fonts/Fonts/Kenney Pixel.ttf");
if (fs.existsSync(font)) fs.copyFileSync(font, path.join(OUT_KENNEY, "font", "pixel.ttf"));

const jingle = path.join(KENNEY, "music-jingles/Audio/8-Bit jingles/jingles_NES08.ogg");
if (fs.existsSync(jingle)) fs.copyFileSync(jingle, path.join(OUT_KENNEY, "music", "ending.ogg"));
const titleJingle = path.join(KENNEY, "music-jingles/Audio/8-Bit jingles/jingles_NES00.ogg");
if (fs.existsSync(titleJingle)) fs.copyFileSync(titleJingle, path.join(OUT_KENNEY, "music", "title.ogg"));

// licenses
const license0x72 = path.join(DESKTOP, "asset-havuzu/0x72/extracted/0x72_DungeonTilesetII_v1.7/README");
if (fs.existsSync(license0x72)) fs.copyFileSync(license0x72, path.join(OUT, "licenses", "0x72_README.txt"));
const kenneyLicense = path.join(KENNEY, "tiny-dungeon/License.txt");
if (fs.existsSync(kenneyLicense)) fs.copyFileSync(kenneyLicense, path.join(OUT, "licenses", "kenney_CC0.txt"));

// generated fx sprites
function makePng(w, h, fill) {
  const p = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (w * y + x) << 2;
      const [r, g, b, a] = fill(x, y);
      p.data[idx] = r;
      p.data[idx + 1] = g;
      p.data[idx + 2] = b;
      p.data[idx + 3] = a;
    }
  }
  return p;
}

// warm glow
const glow = makePng(128, 128, (x, y) => {
  const dx = (x - 63.5) / 63.5;
  const dy = (y - 63.5) / 63.5;
  const d = Math.sqrt(dx * dx + dy * dy);
  const a = Math.max(0, 1 - d);
  const alpha = Math.pow(a, 2.2);
  return [255, 196, 110, Math.round(alpha * 210)];
});
fs.writeFileSync(path.join(OUT, "fx", "glow.png"), PNG.sync.write(glow));

// vignette: transparent center, black edges (320x180 game units)
const vig = makePng(320, 180, (x, y) => {
  const dx = (x - 159.5) / 160;
  const dy = (y - 89.5) / 90;
  const d = Math.sqrt(dx * dx * 0.85 + dy * dy);
  const a = Math.min(1, Math.max(0, (d - 0.38) / 0.55));
  return [4, 3, 8, Math.round(Math.pow(a, 1.4) * 225)];
});
fs.writeFileSync(path.join(OUT, "fx", "vignette.png"), PNG.sync.write(vig));

// top shadow (depth illusion)
const top = makePng(320, 70, (x, y) => {
  const a = Math.pow(1 - y / 70, 1.8);
  return [3, 2, 6, Math.round(a * 170)];
});
fs.writeFileSync(path.join(OUT, "fx", "topshadow.png"), PNG.sync.write(top));

// floor grime overlay tile
const grime = makePng(16, 16, (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  const v = n - Math.floor(n);
  return [0, 0, 0, v > 0.55 ? Math.round((v - 0.55) * 90) : 0];
});
fs.writeFileSync(path.join(OUT, "fx", "grime.png"), PNG.sync.write(grime));

fs.writeFileSync(path.join(OUT_0X72, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("done");
