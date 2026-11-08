export function loadAssets(k) {
	const chars = {
		hero: 9,
		sister: 9,
		priest: 9,
		merchant: 9,
		ghost: 8,
		goblin: 8,
		skelet: 8,
		imp: 8,
		orc: 8,
		chort: 8,
		bigzombie: 8,
		demon: 8,
	};

	for (const [name, frames] of Object.entries(chars)) {
		const anims = {
			idle: { from: 0, to: 3, loop: true, speed: name === "ghost" ? 5 : 7 },
			run: { from: 4, to: 7, loop: true, speed: 11 },
		};
		if (frames === 9) anims.hit = { from: 8, to: 8, speed: 1 };
		k.loadSprite(name, `assets/0x72/chars/${name}.png`, { sliceX: frames, anims });
	}

	for (let i = 1; i <= 8; i++) {
		k.loadSprite(`floor_${i}`, `assets/0x72/tiles/floor_${i}.png`);
	}
	k.loadSprite("floor_stairs", "assets/0x72/tiles/floor_stairs.png");
	k.loadSprite("floor_ladder", "assets/0x72/tiles/floor_ladder.png");
	k.loadSprite("hole", "assets/0x72/tiles/hole.png");

	const props = [
		"wall_mid", "wall_top_mid", "wall_left", "wall_right", "wall_top_left", "wall_top_right",
		"wall_banner_red", "wall_banner_blue", "wall_banner_yellow", "wall_hole_1", "wall_hole_2",
		"wall_goo", "wall_goo_base", "column", "column_wall", "crate", "skull",
		"button_red_up", "button_red_down", "button_blue_up", "button_blue_down",
		"lever_left", "lever_right",
		"flask_big_blue", "flask_big_red", "flask_big_green", "flask_big_yellow",
		"flask_blue", "flask_red", "flask_green", "flask_yellow",
		"bomb_f0", "bomb_f1", "bomb_f2",
		"doors_frame_left", "doors_frame_right", "doors_frame_top",
		"doors_leaf_closed", "doors_leaf_open",
		"chest_empty_open_anim_f0", "chest_empty_open_anim_f1", "chest_empty_open_anim_f2",
		"chest_full_open_anim_f0", "chest_full_open_anim_f1", "chest_full_open_anim_f2",
		"floor_spikes_anim_f0", "floor_spikes_anim_f1", "floor_spikes_anim_f2", "floor_spikes_anim_f3",
		"wall_fountain_mid_blue_anim_f0", "wall_fountain_basin_blue_anim_f0", "wall_fountain_top_1",
	];
	for (const p of props) k.loadSprite(p, `assets/0x72/props/${p}.png`);

	k.loadSprite("chest_open", "assets/0x72/props/chest_open.png", {
		sliceX: 3,
		anims: { open: { from: 0, to: 2, speed: 8 } },
	});
	k.loadSprite("spikes", "assets/0x72/props/spikes.png", {
		sliceX: 4,
		anims: { trap: { from: 0, to: 3, loop: true, speed: 8 } },
	});
	k.loadSprite("coin", "assets/0x72/props/coin.png", {
		sliceX: 4,
		anims: { spin: { from: 0, to: 3, loop: true, speed: 10 } },
	});
	k.loadSprite("fountain", "assets/0x72/props/fountain.png", {
		sliceX: 3,
		anims: { flow: { from: 0, to: 2, loop: true, speed: 5 } },
	});

	k.loadSprite("heart_full", "assets/0x72/ui/ui_heart_full.png");
	k.loadSprite("heart_empty", "assets/0x72/ui/ui_heart_empty.png");
	k.loadSprite("sword_icon", "assets/0x72/weapons/weapon_knight_sword.png");
	k.loadSprite("weapon_knight_sword", "assets/0x72/weapons/weapon_knight_sword.png");
	k.loadSprite("weapon_regular_sword", "assets/0x72/weapons/weapon_regular_sword.png");
	k.loadSprite("weapon_rusty_sword", "assets/0x72/weapons/weapon_rusty_sword.png");

	for (const w of ["grass", "dirt", "water", "flowers", "wood_floor", "wall_beige", "wall_base", "tree", "roof_red", "wall_stone", "door", "bed", "table", "chair", "shelf", "window", "town_bg"]) {
		k.loadSprite(w, `assets/world/${w}.png`);
	}

	k.loadSprite("glow", "assets/fx/glow.png");
	k.loadSprite("vignette", "assets/fx/vignette.png");
	k.loadSprite("topshadow", "assets/fx/topshadow.png");
	k.loadSprite("grime", "assets/fx/grime.png");
	k.loadSprite("flame", "assets/fx/flame.png");
	k.loadSprite("smoke", "assets/fx/smoke.png");
	k.loadSprite("spark", "assets/fx/spark.png");

	k.loadFont("pixel", "assets/kenney/font/vt323.ttf");
	k.loadFont("titlefont", "assets/kenney/font/pressstart.ttf");

	const sfx = ["swing", "hit", "hurt", "step", "break", "pickup", "open", "ghost", "select", "talk", "roar"];
	for (const s of sfx) k.loadSound(s, `assets/kenney/sfx/${s}.ogg`);
	for (const s of ["swing2", "slice", "step2", "door", "coins", "click2", "pot", "creak", "book", "cloth"]) {
		k.loadSound(s, `assets/kenney/sfx2/${s}.ogg`);
	}
	k.loadSound("ending_jingle", "assets/kenney/music/ending.ogg");
	k.loadSound("title_jingle", "assets/kenney/music/title.ogg");
	k.loadSound("ambient", "assets/ambient/drone.wav");
}
