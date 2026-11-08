import kaplay from "kaplay";
import { loadAssets } from "./assets.js";
import { ROOMS, TILE } from "./levels.js";
import { STORY } from "./story.js";

const k = kaplay({
	width: 640,
	height: 360,
	letterbox: true,
	crisp: true,
	pixelDensity: 1,
	debug: false,
	background: [7, 6, 11],
});

const {
	add, pos, sprite, text, rect, circle, color, opacity, anchor, area, body, z, fixed,
	scene, go, onUpdate, onKeyPress, isKeyDown, play, wait, tween, shake, flash,
	setGravity, setCamScale, setCamPos, get, rand, vec2, rgb, time,
	outline, rotate, scale, lifespan,
} = k;

const dt = () => k.dt();
const W = 320;
const H = 180;

loadAssets(k);
setGravity(0);
setCamScale(2);

const SPEED = 82;
const DASH_SPEED = 250;

const G = {
	hearts: 3,
	maxHearts: 3,
	oil: 100,
	maxOil: 100,
	room: 0,
	combo: 0,
	comboTimer: 0,
	hasFlare: false,
	flareCd: 0,
	memories: 0,
	collectedMemories: {},
	openedChests: {},
	hitStop: 0,
	ambient: null,
	heartTimer: 0,
	solved: {},
	talked: {},
	seen: {},
	uiLocked: false,
	paused: false,
	transitioning: false,
	bossDefeated: false,
	choiceActive: false,
};

function resetRun() {
	G.hearts = 3;
	G.oil = 100;
	G.room = 0;
	G.combo = 0;
	G.comboTimer = 0;
	G.hasFlare = false;
	G.flareCd = 0;
	G.memories = 0;
	G.collectedMemories = {};
	G.openedChests = {};
	G.hitStop = 0;
	G.heartTimer = 0;
	if (G.ambient) {
		G.ambient.stop();
		G.ambient = null;
	}
	G.solved = {};
	G.talked = {};
	G.seen = {};
	G.uiLocked = false;
	G.paused = false;
	G.transitioning = false;
	G.bossDefeated = false;
	G.choiceActive = false;
}

const center = (tx, ty) => vec2(tx * TILE + 8, ty * TILE + 8);

const U = 2; // fixed UI lives in 640x360 screen space; the world is 320x180

function uiText(txt, x, y, size = 6, col = [220, 210, 190], width = undefined, align = "left", font = "pixel") {
	return add([
		text(txt, { size: size * U, font, width: width === undefined ? undefined : width * U, align }),
		pos(x * U, y * U),
		color(rgb(...col)),
		z(10000),
		fixed(),
	]);
}

function uiPanel(x, y, w, h, col = [12, 10, 17], border = [92, 78, 64]) {
	const outer = add([rect(w * U, h * U), pos(x * U, y * U), color(rgb(...border)), opacity(0.9), z(9990), fixed()]);
	const inner = add([rect((w - 2) * U, (h - 2) * U), pos((x + 1) * U, (y + 1) * U), color(rgb(...col)), opacity(0.96), z(9991), fixed()]);
	return [outer, inner];
}

function burst(p, col = [255, 120, 90], count = 8) {
	for (let i = 0; i < count; i++) {
		const a = rand(0, Math.PI * 2);
		const s = rand(18, 55);
		const mote = add([
			rect(rand(1, 2), rand(1, 2)),
			pos(p.x, p.y),
			color(rgb(...col)),
			opacity(rand(0.5, 1)),
			z(900),
			lifespan(rand(0.25, 0.55)),
		]);
		tween(mote.pos, mote.pos.add(vec2(Math.cos(a) * s, Math.sin(a) * s - 10)), 0.45, (v) => (mote.pos = v));
		tween(1, 0, 0.45, (v) => (mote.opacity = v));
	}
}

function floatText(p, txt, col = [255, 210, 120]) {
	const t = add([
		text(txt, { size: 6, font: "pixel" }),
		pos(p.x, p.y - 8),
		anchor("center"),
		color(rgb(...col)),
		opacity(1),
		z(3000),
	]);
	tween(t.pos.y, t.pos.y - 12, 0.8, (v) => (t.pos.y = v));
	tween(1, 0, 0.8, (v) => (t.opacity = v));
	wait(0.85, () => t.destroy());
}

/* ------------------------------------------------------------------ */
/* TITLE                                                               */
/* ------------------------------------------------------------------ */

scene("title", () => {
	setCamScale(2);
	setCamPos(W / 2, H / 2);
	add([rect(W, H), pos(0, 0), color(rgb(7, 6, 11)), z(0)]);

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 2; j++) {
			add([sprite("wall_mid"), pos(128 + i * 16, 78 + j * 16), z(2)]);
		}
	}
	add([sprite("hole"), pos(144, 78), scale(2), z(3)]);
	add([sprite("glow"), pos(160, 96), anchor("center"), scale(2.5), opacity(0.25), z(1)]);
	const titleFog = [];
	for (let i = 0; i < 3; i++) {
		titleFog.push(add([
			sprite("smoke"), pos(rand(0, W), rand(40, 150)), anchor("center"),
			scale(rand(0.3, 0.5)), color(rgb(120, 120, 150)), opacity(rand(0.03, 0.06)), z(1),
		]));
	}

	const ghost = add([
		sprite("ghost", { anim: "idle" }),
		pos(160, 70),
		anchor("center"),
		scale(1.6),
		color(rgb(140, 220, 255)),
		opacity(0.45),
		z(10),
	]);
	ghost.play("idle");

	add([
		text("KUYU", { size: 38, font: "titlefont" }),
		pos(160, 18),
		anchor("top"),
		color(rgb(235, 220, 190)),
		z(20),
	]);
	add([
		text("BİR DİLEK. BİR BEDEL.", { size: 7, font: "pixel" }),
		pos(160, 60),
		anchor("top"),
		color(rgb(170, 145, 120)),
		z(20),
	]);
	add([
		text("Karanlık bir kuyu. Konuşan bir ses. İki final.", { size: 7, font: "pixel", width: 260, align: "center" }),
		pos(160, 126),
		anchor("top"),
		color(rgb(150, 140, 130)),
		z(20),
	]);
	const hint = add([
		text("ENTER İLE İN", { size: 7, font: "pixel" }),
		pos(160, 148),
		anchor("top"),
		color(rgb(255, 205, 130)),
		z(20),
	]);
	add([
		text("J: KILIÇ  •  SHIFT: ATIL  •  E: ETKİLEŞİM  •  Q: KOR", { size: 4.5, font: "pixel" }),
		pos(160, 162),
		anchor("top"),
		color(rgb(125, 110, 95)),
		z(20),
	]);
	add([
		text("0x72 • Kenney • OFL", { size: 4, font: "pixel" }),
		pos(160, 172),
		anchor("top"),
		color(rgb(90, 80, 70)),
		z(20),
	]);

	onUpdate(() => {
		hint.opacity = 0.55 + Math.sin(time() * 4) * 0.35;
		ghost.pos.y = 70 + Math.sin(time() * 0.9) * 4;
		ghost.opacity = 0.28 + Math.sin(time() * 1.6) * 0.12;
		for (const f of titleFog) {
			f.pos.x += 1.5 * dt();
			if (f.pos.x > W + 30) f.pos.x = -30;
		}
	});

	onKeyPress(["enter", "space"], () => {
		play("title_jingle", { volume: 0.4 });
		go("intro");
	});
});

/* ------------------------------------------------------------------ */
/* INTRO                                                               */
/* ------------------------------------------------------------------ */

scene("intro", () => {
	setCamScale(2);
	setCamPos(W / 2, H / 2);
	add([rect(W, H), pos(0, 0), color(rgb(6, 5, 9)), z(0)]);
	add([sprite("vignette"), pos(0, 0), z(50), opacity(0.9)]);

	let index = 0;
	let chars = 0;
	let done = false;
	const lineObj = add([
		text("", { size: 9, font: "pixel", width: 270, align: "center" }),
		pos(W / 2, 62),
		anchor("top"),
		color(rgb(222, 210, 190)),
		z(60),
	]);
	const hint = add([
		text("ENTER", { size: 5, font: "pixel" }),
		pos(W / 2, 152),
		anchor("top"),
		color(rgb(150, 120, 90)),
		z(60),
	]);

	function showLine() {
		chars = 0;
		done = false;
		lineObj.text = "";
	}

	function advance() {
		if (!done) {
			chars = STORY.intro[index].length;
			lineObj.text = STORY.intro[index];
			done = true;
			return;
		}
		index++;
		if (index >= STORY.intro.length) {
			go("game", { room: 0 });
			return;
		}
		play("talk", { volume: 0.25 });
		showLine();
	}

	showLine();
	onUpdate(() => {
		if (done) return;
		chars += dt() * 42;
		const full = STORY.intro[index];
		const n = Math.min(full.length, Math.floor(chars));
		lineObj.text = full.slice(0, n);
		if (n >= full.length) done = true;
		hint.opacity = 0.5 + Math.sin(time() * 4) * 0.3;
	});
	onKeyPress(["enter", "space", "e"], advance);
});

/* ------------------------------------------------------------------ */
/* GAME                                                                */
/* ------------------------------------------------------------------ */

scene("game", (data = {}) => {
	G.room = data.room ?? G.room;
	G.transitioning = false;
	G.uiLocked = true;
	G.paused = false;
	G.choiceActive = false;
	G.combo = 0;
	G.comboTimer = 0;
	setCamScale(2);
	setCamPos(W / 2, H / 2);
	if (!G.ambient) G.ambient = play("ambient", { loop: true, volume: 0.16 });

	const room = { ...ROOMS[G.room], ...STORY.rooms[G.room] };
	const grid = room.map.map((r) => r.split(""));

	add([rect(W, H), pos(0, 0), color(rgb(7, 6, 11)), z(0)]);
	const fadeIn = add([rect(W * U, H * U), pos(0, 0), color(rgb(0, 0, 0)), opacity(1), z(20000), fixed()]);
	tween(1, 0, 0.45, (v) => (fadeIn.opacity = v));
	wait(0.5, () => fadeIn.destroy());

	const walls = [];
	const blockers = [];
	const plates = [];
	const spikes = [];
	const enemies = [];
	const braziers = [];
	const projectiles = [];
	const collapsers = [];
	let gate = null;
	let gateOpen = false;
	let gateVisual = null;
	let miniBossSpawned = false;
	let crate = null;
	let crateGX = -1;
	let crateGY = -1;
	let npc = null;
	let exitObj = null;
	let boss = null;
	let bossBar = null;
	let bossBarBg = null;
	let dialogue = null;
	let caption = null;
	let player = null;
	let enemyGrace = 3.0;
	let pauseObjs = [];

	const floorAt = (tx, ty) => {
		if (tx < 0 || ty < 0 || tx >= 20 || ty >= 11) return false;
		const c = grid[ty][tx];
		return c !== "#" && c !== "~";
	};

	const floorTints = {
		well: [185, 174, 196], chapel: [150, 185, 190], market: [198, 176, 146],
		bridge: [150, 170, 205], silentfire: [190, 150, 130], bottom: [190, 130, 135],
	};
	const wallTints = {
		well: [178, 166, 190], chapel: [155, 188, 194], market: [196, 172, 145],
		bridge: [155, 172, 205], silentfire: [195, 155, 132], bottom: [192, 138, 142],
	};

	function addFloor(tx, ty) {
		const p = vec2(tx * TILE, ty * TILE);
		const v = (tx * 7 + ty * 13) % 8 + 1;
		const floor = add([sprite(`floor_${v}`), pos(p.x, p.y), z(1), color(rgb(...(floorTints[room.name] || floorTints.well))), opacity(1)]);
		if ((tx + ty) % 3 === 0) {
			add([sprite("grime"), pos(p.x, p.y), z(2), opacity(0.45)]);
		}
		return floor;
	}

	function addWall(tx, ty) {
		const p = vec2(tx * TILE, ty * TILE);
		const wt = wallTints[room.name] || wallTints.well;
		add([sprite("wall_mid"), pos(p.x, p.y), z(p.y + 8), color(rgb(...wt))]);
		add([sprite("wall_top_mid"), pos(p.x, p.y - TILE), z(p.y + 8), color(rgb(wt[0] + 20, wt[1] + 20, wt[2] + 20))]);
		const col = add([
			rect(TILE, TILE),
			pos(p.x + 8, p.y + 8),
			anchor("center"),
			area({ width: TILE, height: TILE }),
			body({ isStatic: true }),
			color(rgb(0, 0, 0)),
			opacity(0),
			z(3),
			"wall",
		]);
		walls.push(col);
	}

	function addPit(tx, ty) {
		const p = vec2(tx * TILE, ty * TILE);
		add([rect(TILE, TILE), pos(p.x, p.y), color(rgb(2, 2, 4)), z(1)]);
		add([sprite("hole"), pos(p.x, p.y), z(2), opacity(0.85)]);
		add([
			rect(TILE, TILE),
			pos(p.x + 8, p.y + 8),
			anchor("center"),
			area({ width: TILE, height: TILE }),
			body({ isStatic: true }),
			color(rgb(0, 0, 0)),
			opacity(0),
			z(3),
			"pit",
		]);
	}

	for (let ty = 0; ty < 11; ty++) {
		for (let tx = 0; tx < 20; tx++) {
			const c = grid[ty][tx];
			if (c === "#") addWall(tx, ty);
			else if (c === "~") addPit(tx, ty);
			else if (c === "x") {
				const floor = addFloor(tx, ty);
				collapsers.push({ tx, ty, floor, triggered: false, hole: null });
			} else addFloor(tx, ty);
		}
	}

	// Force the puzzle gates to be the only way through.
	if (room.name === "chapel" || room.name === "silentfire") {
		addWall(8, 9);
		addWall(10, 9);
	}
	if (room.name === "market") {
		for (const yy of [1, 2, 3, 4, 6, 7, 8, 9]) addWall(16, yy);
	}

	const propsAt = [
		[1, 1, "column"], [18, 1, "column"], [1, 9, "column"], [18, 9, "column"],
		[2, 1, "skull"], [17, 9, "skull"],
	];
	for (const [tx, ty, spr] of propsAt) {
		if (grid[ty][tx] === "#") continue;
		add([sprite(spr), pos(tx * TILE + 8, ty * TILE + 16), anchor("bot"), z(ty * TILE + 15)]);
	}

	if (room.name === "chapel") {
		add([sprite("fountain", { anim: "flow" }), pos(14 * TILE + 8, 3 * TILE + 8), anchor("center"), z(3 * TILE + 8)]);
		for (const b of room.banners) {
			add([sprite(`wall_banner_${b.color}`), pos(b.x * TILE, 0), z(10)]);
		}
		// readable sequence reminder, in fixed screen space
		const seq = room.plateOrder;
		seq.forEach((c, i) => {
			add([rect(12 * U, 12 * U), pos((132 + i * 18) * U, 34 * U), color(rgb(...(c === "red" ? [220, 70, 60] : [70, 130, 220]))), z(10000), fixed(), outline(2, rgb(20, 16, 20), 1)]);
		});
	}
	if (room.name === "bottom") {
		add([sprite("wall_banner_red"), pos(9 * TILE, 0), z(2)]);
		add([sprite("skull"), pos(9 * TILE + 8, 1 * TILE + 8), anchor("center"), z(20)]);
	}

	/* ---------------- gates, plates, crate ---------------- */
	function makeGate(tx, ty, orientation = "h") {
		const p = center(tx, ty);
		gate = add([
			sprite("doors_leaf_closed"),
			pos(p.x, p.y),
			anchor("center"),
			scale(0.5),
			z(p.y + 8),
			area({ width: 16, height: 16 }),
			body({ isStatic: true }),
			"gate",
		]);
		if (orientation === "h") {
			for (const ox of [-1, 1]) {
				blockers.push(add([
					rect(16, 16), pos(p.x + ox * 16, p.y), anchor("center"),
					area({ width: 16, height: 16 }), body({ isStatic: true }),
					color(rgb(0, 0, 0)), opacity(0), z(3), "blocker",
				]));
			}
		} else {
			for (const oy of [-1, 1]) {
				blockers.push(add([
					rect(16, 16), pos(p.x, p.y + oy * 16), anchor("center"),
					area({ width: 16, height: 16 }), body({ isStatic: true }),
					color(rgb(0, 0, 0)), opacity(0), z(3), "blocker",
				]));
			}
		}
	}

	function openGate(silent = false) {
		if (gateOpen) return;
		gateOpen = true;
		if (!silent) play("open", { volume: 0.6 });
		if (gate) {
			const p = gate.pos;
			gate.destroy();
			gate = null;
			gateVisual = add([sprite("doors_leaf_open"), pos(p.x, p.y), anchor("center"), scale(0.5), opacity(0.7), z(p.y + 8)]);
		}
		for (const b of blockers) b.destroy();
		blockers.length = 0;
		flash(rgb(255, 220, 160), 0.18);
	}

	function makePlate(tx, ty, colName) {
		const p = center(tx, ty);
		const plate = add([
			sprite(`button_${colName}_up`),
			pos(p.x, p.y),
			anchor("center"),
			z(p.y + 4),
			"plate",
			{ colName, pressed: false, inside: false },
		]);
		plates.push(plate);
		return plate;
	}

	function pressPlate(plate) {
		if (G.solved[G.room]) return;
		plate.pressed = true;
		plate.use(sprite(`button_${plate.colName}_down`));
		play("select", { volume: 0.35 });
		const seq = plates.filter((p) => p.pressed).map((p) => p.colName);
		const target = room.plateOrder;
		const prefixOk = seq.every((c, i) => c === target[i]);
		if (!prefixOk) {
			play("hurt", { volume: 0.25 });
			shake(4);
			wait(0.55, () => {
				for (const p of plates) {
					p.pressed = false;
					p.use(sprite(`button_${p.colName}_up`));
				}
			});
			return;
		}
		if (seq.length === target.length) {
			G.solved[G.room] = true;
			openGate();
			setObjective("Kapı açıldı. Aşağı in.");
			floatText(player.pos, "SIRALAMA DOĞRU", [255, 220, 150]);
		}
	}

	function pressBridgePlate(p) {
		if (G.solved[G.room]) return;
		p.pressed = true;
		p.use(sprite("button_blue_down"));
		play("select", { volume: 0.35 });
		G.solved[G.room] = true;
		openGate();
		setObjective("KÖPRÜYÜ GEÇ! Kapı 5 saniye açık.");
		floatText(player.pos, "KOŞ!", [255, 220, 150]);
		wait(5, () => {
			G.solved[G.room] = false;
			p.pressed = false;
			p.use(sprite("button_blue_up"));
			if (gateOpen) {
				if (gateVisual) {
					gateVisual.destroy();
					gateVisual = null;
				}
				const p2 = center(7, 5);
				gateOpen = false;
				gate = add([
					sprite("doors_leaf_closed"), pos(p2.x, p2.y), anchor("center"), scale(0.5), z(p2.y + 8),
					area({ width: 16, height: 16 }), body({ isStatic: true }), "gate",
				]);
				shake(5);
				play("break", { volume: 0.35 });
			}
		});
	}

	function makeCrate(tx, ty) {
		const p = center(tx, ty);
		crateGX = tx;
		crateGY = ty;
		crate = add([
			sprite("crate"),
			pos(p.x, p.y),
			anchor("center"),
			z(p.y + 8),
			area({ width: 14, height: 18 }),
			body({ isStatic: true }),
			"crate",
		]);
		return crate;
	}

	function tryPushCrate() {
		if (!crate || G.solved[G.room]) return;
		const d = player.pos.sub(crate.pos);
		let dx = 0;
		let dy = 0;
		if (Math.abs(d.x) > Math.abs(d.y)) dx = d.x < 0 ? 1 : -1;
		else dy = d.y < 0 ? 1 : -1;
		const nx = crateGX + dx;
		const ny = crateGY + dy;
		if (!floorAt(nx, ny)) return;
		crateGX = nx;
		crateGY = ny;
		const target = center(nx, ny);
		tween(crate.pos, target, 0.16, (v) => (crate.pos = v));
		crate.z = target.y + 8;
		play("step", { volume: 0.35 });
		wait(0.18, () => {
			if (room.name === "market" && grid[ny]?.[nx] === "p") {
				G.solved[G.room] = true;
				openGate();
				setObjective("Kapı açıldı. Aşağı in.");
				floatText(crate.pos, "TAŞ BASKIDA", [180, 220, 255]);
			}
		});
	}

	/* ---------------- player ---------------- */
	function spawnPlayer() {
		let sx = 3;
		let sy = 5;
		for (let y = 0; y < 11; y++) {
			for (let x = 0; x < 20; x++) {
				if (grid[y][x] === "P") {
					sx = x;
					sy = y;
				}
			}
		}
		const p = center(sx, sy);
		player = add([
			sprite("hero", { anim: "idle" }),
			pos(p.x, p.y),
			anchor("center"),
			outline(1, rgb(12, 12, 18), 0.9),
			area({ scale: vec2(0.62, 0.42), offset: vec2(0, 7) }),
			body(),
			z(p.y + 14),
			"player",
			{
				facing: vec2(0, 1),
				attackCd: 0,
				atkStep: 0,
				atkTimer: 0,
				dashCd: 0,
				dashTime: 0,
				iframes: 1.4,
				hitAnim: 0,
				walkT: 0,
			},
		]);
		player.play("idle");
		const shadow = add([
			circle(5), pos(p.x, p.y + 13), anchor("center"), scale(1, 0.35),
			color(rgb(0, 0, 0)), opacity(0.35), z(p.y + 13.5),
		]);
		const glow = add([
			sprite("glow"), pos(p.x, p.y + 4), anchor("center"), scale(2.4), opacity(0.22), z(4),
		]);
		player.shadow = shadow;
		player.glow = glow;
		return player;
	}

	/* ---------------- HUD ---------------- */
	const heartObjs = [];
	for (let i = 0; i < 3; i++) {
		heartObjs.push(add([sprite("heart_full"), pos((8 + i * 15) * U, 8 * U), scale(U), z(10000), fixed()]));
	}
	add([rect(52 * U, 7 * U), pos(8 * U, 24 * U), color(rgb(20, 16, 22)), z(10000), fixed(), outline(2, rgb(90, 75, 60), 0.8)]);
	const oilBar = add([rect(50 * U, 5 * U), pos(9 * U, 25 * U), color(rgb(230, 160, 70)), z(10001), fixed()]);
	const oilLabel = uiText("YAĞ", 64, 24, 5, [150, 130, 110]);
	const memoryText = uiText("HATIRA 0/3", 8, 34, 5, [130, 170, 190]);
	const comboText = uiText("", 8, 44, 7, [255, 210, 120]);
	const objectiveText = uiText("", 312, 8, 6, [190, 175, 155], 140, "right");
	objectiveText.use(anchor("topright"));
	const hintText = uiText("", 160, 176, 5, [130, 120, 110]);
	hintText.use(anchor("bot"));
	hintText.text = "WASD / OKLAR • J: KILIÇ • SHIFT: ATIL • E: ETKİLEŞİM";

	const interactPrompt = add([
		text("E", { size: 8, font: "pixel" }), pos(0, 0), anchor("center"),
		color(rgb(255, 220, 140)), opacity(0.9), z(6000),
	]);
	interactPrompt.hidden = true;

	function setObjective(t) {
		objectiveText.text = t;
	}

	function updateHUD() {
		for (let i = 0; i < heartObjs.length; i++) heartObjs[i].hidden = i >= G.hearts;
		oilLabel.text = G.hasFlare ? (G.flareCd > 0 ? "KOR…" : "YAĞ • Q:KOR") : "YAĞ";
		const ratio = G.oil / G.maxOil;
		oilBar.width = Math.max(0, 50 * U * ratio);
		memoryText.text = `HATIRA ${G.memories}/3`;
		if (G.combo >= 2) {
			comboText.text = `KOMBO x${G.combo}`;
			comboText.opacity = 1;
		} else comboText.opacity = 0;
	}

	/* ---------------- dialogue ---------------- */
	function startDialogue(lines, onDone = null) {
		if (dialogue) return;
		G.uiLocked = true;
		const box = add([rect(292 * U, 48 * U), pos(14 * U, 118 * U), color(rgb(10, 9, 14)), opacity(0.96), z(9990), fixed()]);
		const border = add([rect(292 * U, 48 * U), pos(14 * U, 118 * U), color(rgb(110, 92, 70)), opacity(0.55), z(9991), fixed(), outline(2, rgb(110, 92, 70), 0.9)]);
		const t = add([
			text("", { size: 7 * U, font: "pixel", width: 280 * U, align: "left" }),
			pos(22 * U, 126 * U),
			color(rgb(225, 212, 190)),
			z(9992),
			fixed(),
		]);
		const prompt = add([
			text("E / ENTER", { size: 5 * U, font: "pixel" }),
			pos(298 * U, 158 * U),
			anchor("topright"),
			color(rgb(160, 130, 90)),
			z(9992),
			fixed(),
		]);
		dialogue = { lines, index: 0, chars: 0, done: false, t, box, border, prompt, onDone };
		play("talk", { volume: 0.25 });
	}

	function closeDialogue() {
		if (!dialogue) return;
		for (const o of [dialogue.box, dialogue.border, dialogue.t, dialogue.prompt]) o.destroy();
		const cb = dialogue.onDone;
		dialogue = null;
		G.uiLocked = false;
		if (cb) cb();
	}

	function advanceDialogue() {
		if (!dialogue) return;
		const d = dialogue;
		if (!d.done) {
			d.chars = d.lines[d.index].length;
			d.t.text = d.lines[d.index];
			d.done = true;
			return;
		}
		d.index++;
		if (d.index >= d.lines.length) {
			closeDialogue();
			return;
		}
		d.chars = 0;
		d.done = false;
		d.t.text = "";
		play("talk", { volume: 0.2 });
	}

	onUpdate(() => {
		if (!dialogue) return;
		const d = dialogue;
		if (d.done) return;
		d.chars += dt() * 48;
		const full = d.lines[d.index];
		const n = Math.min(full.length, Math.floor(d.chars));
		d.t.text = full.slice(0, n);
		if (n >= full.length) d.done = true;
	});

	/* ---------------- captions ---------------- */
	function showCaption(lines, duration = 4) {
		if (caption) {
			for (const o of caption) o.destroy();
			caption = null;
		}
		const box = add([rect(292 * U, 40 * U), pos(14 * U, 126 * U), color(rgb(8, 7, 11)), opacity(0.78), z(9980), fixed()]);
		const t = add([
			text(lines.join("\n"), { size: 6 * U, font: "pixel", width: 280 * U }),
			pos(22 * U, 131 * U),
			color(rgb(180, 168, 150)),
			z(9981),
			fixed(),
			opacity(0),
		]);
		caption = [box, t];
		tween(0, 1, 0.4, (v) => (t.opacity = v));
		wait(duration, () => {
			tween(1, 0, 0.6, (v) => (t.opacity = v));
			wait(0.7, () => {
				box.destroy();
				t.destroy();
				caption = null;
			});
		});
	}

	function showRoomCard() {
		const title = add([
			text(room.title, { size: 12 * U, font: "titlefont" }),
			pos(160 * U, 58 * U), anchor("top"), color(rgb(235, 220, 190)), opacity(0), z(9995), fixed(),
		]);
		const sub = add([
			text(room.subtitle, { size: 7 * U, font: "pixel", width: 280 * U, align: "center" }),
			pos(160 * U, 82 * U), anchor("top"), color(rgb(160, 140, 120)), opacity(0), z(9995), fixed(),
		]);
		const line = add([rect(180 * U, 1 * U), pos(70 * U, 78 * U), color(rgb(120, 90, 60)), opacity(0), z(9994), fixed()]);
		tween(0, 1, 0.5, (v) => { title.opacity = v; sub.opacity = v; line.opacity = v * 0.7; });
		wait(2.3, () => {
			tween(1, 0, 0.6, (v) => { title.opacity = v; sub.opacity = v; line.opacity = v * 0.7; });
			wait(0.7, () => { title.destroy(); sub.destroy(); line.destroy(); });
		});
	}

	/* ---------------- enemies ---------------- */
	const enemyDefs = {
		goblin: { hp: 2, speed: 28, aggro: 95, scale: vec2(0.8, 0.7), offsetY: 3 },
		skelet: { hp: 3, speed: 27, aggro: 120, scale: vec2(0.8, 0.8), offsetY: 2 },
		imp: { hp: 1, speed: 46, aggro: 145, scale: vec2(0.8, 0.8), offsetY: 2 },
		orc: { hp: 5, speed: 28, aggro: 130, scale: vec2(0.7, 0.7), offsetY: 4 },
		chort: { hp: 4, speed: 22, aggro: 175, scale: vec2(0.7, 0.55), offsetY: 6 },
		bigzombie: { hp: 10, speed: 18, aggro: 150, scale: vec2(0.62, 0.5), offsetY: 10 },
		demon: { hp: 18, speed: 24, aggro: 190, scale: vec2(0.62, 0.5), offsetY: 10 },
	};

	function spawnEnemy(type, tx, ty) {
		const def = enemyDefs[type];
		const p = center(tx, ty);
		const e = add([
			sprite(type, { anim: "idle" }),
			pos(p.x, p.y),
			anchor("center"),
			area({ scale: def.scale, offset: vec2(0, def.offsetY), collisionIgnore: ["player"] }),
			body(),
			z(p.y + 14),
			"enemy",
			{
				enemyType: type,
				hp: def.hp,
				maxHp: def.hp,
				speed: def.speed,
				aggro: def.aggro,
				seed: rand(0, 100),
				dead: false,
				flash: 0,
				chargeCd: rand(1.4, 2.6),
				chargeTime: 0,
				chargeDir: vec2(0, 0),
				shootCd: rand(0.8, 1.8),
				boss: type === "demon",
				phase: 1,
			},
		]);
		e.play("idle");
		enemies.push(e);
		if (type === "demon") boss = e;
		return e;
	}

	function damageEnemy(e, dmg) {
		if (!e || e.dead) return;
		e.hp -= dmg;
		e.flash = 0.12;
		e.color = rgb(255, 120, 110);
		G.hitStop = e.boss ? 0.03 : 0.045;
		play("hit", { volume: 0.45 });
		shake(2);
		burst(e.pos, [220, 70, 60], 6);
		const dir = e.pos.sub(player.pos);
		if (dir.len() > 0) e.pos = e.pos.add(dir.unit().scale(5));
		if (e.hp <= 0) {
			e.dead = true;
			G.combo++;
			G.comboTimer = 1.6;
			if (e.boss) {
				onBossDeath(e);
			} else {
				if (e.enemyType === "bigzombie" && room.name === "silentfire") {
					G.solved[G.room] = true;
					openGate();
					setObjective("Köle düştü. Kapı açıldı.");
					floatText(e.pos, "KAPI AÇILDI", [180, 220, 140]);
				}
				burst(e.pos, [200, 60, 50], 12);
				if (rand(0, 1) < 0.3) spawnOil(e.pos.x, e.pos.y, 18);
				if (rand(0, 1) < 0.12) spawnHeart(e.pos.x, e.pos.y);
				e.destroy();
			}
		}
	}

	function onBossDeath(e) {
		G.bossDefeated = true;
		boss = null;
		e.destroy();
		play("roar", { volume: 0.5 });
		shake(10);
		flash(rgb(255, 200, 150), 0.4);
		burst(e.pos, [255, 120, 80], 30);
		for (const en of enemies) if (!en.dead) en.destroy();
		enemies.length = 0;
		if (bossBar) bossBar.hidden = true;
		if (bossBarBg) bossBarBg.hidden = true;
		setObjective("Bekçi düştü. Seçim senin.");
		G.uiLocked = true;
		const sis = add([
			sprite("sister", { anim: "idle" }), pos(160, 54), anchor("center"),
			scale(1.25), color(rgb(150, 225, 255)), opacity(0.55), z(7000),
		]);
		sis.play("idle");
		add([sprite("glow"), pos(160, 58), anchor("center"), scale(2.2), opacity(0.25), z(6999)]);
		wait(1.2, () => {
			const lines = [...STORY.dialogues.boss];
			if (G.memories >= 3) lines.push("Bekçi: “Üç hatıra taşıyorsun. O zaman onun gerçek adını biliyorsun.”");
			startDialogue(lines, () => showChoice());
		});
	}

	function showChoice() {
		G.choiceActive = true;
		G.uiLocked = true;
		uiPanel(24, 104, 272, 60, [10, 8, 13], [140, 100, 70]);
		uiText("1) KOPYAYI AL", 40, 114, 8, [255, 190, 120]);
		uiText("2) KUYUYU KIR", 40, 132, 8, [160, 210, 230]);
		uiText("Seçim geri alınamaz.", 160, 152, 5, [130, 115, 100]).use(anchor("top"));
		onKeyPress("1", () => { if (G.choiceActive) go("ending", { type: "copy" }); });
		onKeyPress("2", () => { if (G.choiceActive) go("ending", { type: "break" }); });
	}

	function spawnOil(x, y, amount = 30) {
		return add([
			sprite("flask_big_blue"), pos(x, y), anchor("center"), z(500),
			area({ width: 12, height: 14 }), body({ isStatic: true }), "oil", { amount },
		]);
	}

	function spawnHeart(x, y) {
		return add([
			sprite("heart_full"), pos(x, y), anchor("center"), z(500),
			area({ width: 12, height: 12 }), body({ isStatic: true }), "heart", {},
		]);
	}

	function spawnMemory(x, y, idx) {
		add([sprite("glow"), pos(x, y), anchor("center"), scale(0.9), opacity(0.28), z(490)]);
		return add([
			sprite("coin", { anim: "spin" }), pos(x, y), anchor("center"), scale(2),
			z(500), area({ width: 12, height: 12 }), body({ isStatic: true }),
			"memory", { idx },
		]);
	}

	function spawnBrazier(tx, ty) {
		const p = center(tx, ty);
		add([sprite("column"), pos(p.x, p.y + 8), anchor("bot"), z(p.y + 8)]);
		const glow = add([sprite("glow"), pos(p.x, p.y - 9), anchor("center"), scale(0.85), opacity(0.08), z(8400)]);
		const flame = add([sprite("flame"), pos(p.x, p.y - 9), anchor("center"), scale(0.085), opacity(0), color(rgb(255, 150, 70)), z(8500)]);
		const b = { x: p.x, y: p.y, baseY: p.y - 9, flame, glow, lit: false, tx, ty };
		braziers.push(b);
		return b;
	}

	function lightBrazier(b) {
		if (b.lit) return;
		b.lit = true;
		b.flame.opacity = 1;
		b.glow.opacity = 0.5;
		play("break", { volume: 0.28 });
		burst(vec2(b.x, b.baseY), [255, 190, 90], 14);
		floatText(vec2(b.x, b.baseY - 8), "YANDI", [255, 200, 100]);
	}

	function checkBraziers() {
		if (room.name !== "silentfire" || G.solved[G.room] || miniBossSpawned) return;
		if (braziers.length > 0 && braziers.every((b) => b.lit)) {
			miniBossSpawned = true;
			setObjective("Bekçinin kölesi uyandı. Onu yen.");
			floatText(player.pos, "ÜÇ ATEŞ — BİR ŞEY UYANDI", [255, 120, 80]);
			play("roar", { volume: 0.5 });
			shake(8);
			wait(0.6, () => {
				spawnEnemy("bigzombie", 9, 5);
				burst(center(9, 5), [120, 200, 90], 20);
			});
		}
	}

	// map entities
	for (let ty = 0; ty < 11; ty++) {
		for (let tx = 0; tx < 20; tx++) {
			const c = grid[ty][tx];
			if (c === "g" || c === "s" || c === "i" || c === "o" || c === "c" || c === "z" || c === "B") {
				spawnEnemy({ g: "goblin", s: "skelet", i: "imp", o: "orc", c: "chort", z: "bigzombie", B: "demon" }[c], tx, ty);
			}
			if (c === "O") {
				spawnOil(tx * TILE + 8, ty * TILE + 10, 35);
			}
			if (c === "C") {
				const key = `${G.room}:${tx}:${ty}`;
				if (!G.openedChests[key]) {
					const p = center(tx, ty);
					add([
						sprite("chest_full_open_anim_f0"), pos(p.x, p.y), anchor("center"), z(p.y + 6),
						area({ width: 14, height: 14 }), "chest", { opened: false, key },
					]);
				}
			}
			if (c === "F") spawnBrazier(tx, ty);
			if (c === "M") {
				const midx = room.name === "chapel" ? 0 : room.name === "market" ? 1 : 2;
				if (!G.collectedMemories[midx]) spawnMemory(tx * TILE + 8, ty * TILE + 8, midx);
			}
			if (c === "K" && !G.hasFlare) {
				const p = center(tx, ty);
				add([
					sprite("flask_big_yellow"), pos(p.x, p.y), anchor("center"), z(p.y + 6),
					area({ width: 12, height: 14 }), body({ isStatic: true }), "flarepickup",
				]);
			}
		}
	}

	// special entities
	if (room.name === "chapel") {
		makePlate(6, 6, "red");
		makePlate(10, 6, "blue");
		makePlate(14, 6, "red");
		if (!G.solved[G.room]) makeGate(9, 8, "h");
		else openGate(true);
	}
	if (room.name === "silentfire") {
		if (!G.solved[G.room]) makeGate(9, 8, "h");
		else openGate(true);
	}
	if (room.name === "market") {
		makeCrate(8, 5);
		makePlate(12, 5, "blue");
		if (!G.solved[G.room]) makeGate(15, 5, "v");
		else openGate(true);
	}
	if (room.name === "bridge") {
		makePlate(5, 5, "blue");
		makeGate(7, 5, "h");
		for (const [tx, ty] of [[9, 5], [11, 5], [13, 5], [15, 5]]) {
			const p = center(tx, ty);
			const s = add([
				sprite("spikes", { anim: "trap" }), pos(p.x, p.y), anchor("center"),
				z(p.y + 5), "spike", { phase: spikes.length * 0.35 },
			]);
			s.play("trap");
			spikes.push(s);
		}
	}
	if (room.name === "bottom") {
		bossBarBg = add([rect(122 * U, 8 * U), pos(99 * U, 14 * U), color(rgb(24, 18, 20)), z(10000), fixed(), outline(2, rgb(100, 60, 50), 0.9)]);
		bossBar = add([rect(120 * U, 6 * U), pos(100 * U, 15 * U), color(rgb(200, 50, 45)), z(10001), fixed()]);
		uiText("BEKÇİ", 100, 5, 5, [220, 130, 120]);
	}

	// NPC
	if (room.npc) {
		const p = center(4, 2);
		npc = add([
			sprite(room.npc, { anim: "idle" }), pos(p.x, p.y), anchor("center"),
			z(p.y + 14), "npc", { type: room.npc },
		]);
		npc.play("idle");
	}

	// exit
	for (let ty = 0; ty < 11; ty++) {
		for (let tx = 0; tx < 20; tx++) {
			if (grid[ty][tx] === "E") {
				const p = center(tx, ty);
				add([sprite("floor_ladder"), pos(p.x, p.y), anchor("center"), z(3), opacity(0.9)]);
				add([sprite("glow"), pos(p.x, p.y), anchor("center"), scale(1.4), opacity(0.25), z(4)]);
				exitObj = add([
					rect(14, 14), pos(p.x, p.y), anchor("center"), area({ width: 14, height: 14 }),
					color(rgb(0, 0, 0)), opacity(0), z(5), "exit",
				]);
			}
		}
	}

	/* ---------------- lighting / depth ---------------- */
	add([sprite("topshadow"), pos(0, 0), scale(U), z(8000), opacity(0.9), fixed()]);
	const vignette = add([sprite("vignette"), pos(0, 0), scale(U), z(9000), opacity(0.75), fixed()]);
	add([rect(W, H), pos(0, 0), color(rgb(0, 0, 0)), opacity(0.04), z(8999)]);
	const roomTints = {
		well: [55, 35, 28], chapel: [25, 55, 62], market: [65, 45, 25],
		bridge: [25, 35, 65], silentfire: [65, 32, 22], bottom: [70, 20, 30],
	};
	add([rect(W, H), pos(0, 0), color(rgb(...(roomTints[room.name] || roomTints.well))), opacity(0.055), z(10)]);

	const fog = [];
	for (let i = 0; i < 4; i++) {
		const f = add([
			sprite("smoke"), pos(rand(0, W), rand(24, 150)), anchor("center"),
			scale(rand(0.35, 0.6)), color(rgb(120, 120, 150)), opacity(rand(0.035, 0.075)), z(6),
		]);
		fog.push(f);
	}

	function spawnDust() {
		const d = add([
			rect(1, 1), pos(rand(8, W - 8), rand(8, H - 8)),
			color(rgb(200, 180, 140)), opacity(0), z(7),
		]);
		tween(0, 0.35, 1.2, (v) => (d.opacity = v));
		tween(d.pos.y, d.pos.y - rand(6, 14), 3.5, (v) => (d.pos.y = v));
		wait(3.6, () => d.destroy());
		wait(rand(0.25, 0.8), spawnDust);
	}
	spawnDust();

	/* ---------------- init ---------------- */
	player = spawnPlayer();
	updateHUD();
	setObjective(room.objective);
	showRoomCard();
	if (!G.seen[G.room]) {
		G.seen[G.room] = true;
		wait(2.8, () => showCaption(room.enter, 4.5));
	}
	wait(3.2, () => {
		if (!dialogue) G.uiLocked = false;
	});

	/* ---------------- ghost apparition ---------------- */
	function spawnGhost() {
		const x = rand(28, 292);
		const y = rand(34, 96);
		const g = add([
			sprite("ghost", { anim: "idle" }), pos(x, y), anchor("center"),
			scale(rand(1.2, 1.8)), color(rgb(135, 215, 255)), opacity(0), z(7000),
			"ghostfx",
		]);
		g.play("idle");
		play("ghost", { volume: 0.16 });
		tween(0, 0.5, 0.8, (v) => (g.opacity = v));
		tween(y, y - rand(10, 22), 2.4, (v) => (g.pos.y = v));
		wait(1.3, () => tween(0.5, 0, 1.1, (v) => (g.opacity = v)));
		wait(2.5, () => g.destroy());
	}

	function scheduleGhost() {
		wait(rand(7, 14), () => {
			if (!G.paused && !G.uiLocked && room.name !== "bottom") spawnGhost();
			scheduleGhost();
		});
	}
	if (room.name !== "bottom") scheduleGhost();

	if (import.meta.env.DEV) {
		window.__scene = {
			enemies,
			spawnGhost,
			get player() { return player; },
			get attack() { return attack; },
			get braziers() { return braziers; },
		};
	}

	/* ---------------- combat ---------------- */
	function attack() {
		if (G.uiLocked || G.paused || player.attackCd > 0) return;
		player.atkStep = player.atkTimer > 0 ? player.atkStep + 1 : 1;
		if (player.atkStep > 3) player.atkStep = 1;
		player.atkTimer = 0.8;
		player.attackCd = player.atkStep === 3 ? 0.36 : 0.23;
		play("swing", { volume: player.atkStep === 3 ? 0.5 : 0.35 });
		const dir = player.facing;
		const angle = (Math.atan2(dir.y, dir.x) * 180) / Math.PI;
		const finisher = player.atkStep === 3;
		const slash = add([
			sprite("weapon_knight_sword"),
			pos(player.pos.x + dir.x * (finisher ? 18 : 15), player.pos.y + dir.y * (finisher ? 18 : 15)),
			anchor("center"), rotate(angle + (finisher ? 65 : 40)), scale(finisher ? 1.35 : 1),
			color(finisher ? rgb(255, 220, 140) : rgb(255, 255, 255)),
			z(player.z + 2), opacity(0.95), lifespan(0.16),
		]);
		tween(slash.pos, slash.pos.add(dir.scale(finisher ? 10 : 6)), 0.16, (v) => (slash.pos = v));
		tween(1, 0, 0.16, (v) => (slash.opacity = v));

		const comboBonus = G.combo >= 2 ? 2 : 1;
		const reach = finisher ? 46 : 37;
		const dmg = finisher ? 2 : comboBonus;
		for (const e of enemies) {
			if (!e || e.dead) continue;
			const to = e.pos.sub(player.pos);
			const dist = to.len();
			if (dist < reach && dist > 0) {
				const dot = to.unit().dot(dir);
				if (dot > (finisher ? -0.15 : 0.05)) damageEnemy(e, dmg);
			}
		}
		if (finisher) shake(4);
	}

	function flareBurst() {
		if (!G.hasFlare || G.flareCd > 0 || G.uiLocked || G.paused) return;
		G.flareCd = 4;
		G.oil = Math.max(0, G.oil - 12);
		play("break", { volume: 0.5 });
		flash(rgb(255, 230, 160), 0.3);
		shake(5);
		const p = player.pos;
		add([sprite("glow"), pos(p.x, p.y), anchor("center"), scale(6), opacity(0.75), z(6000), lifespan(0.35)]);
		burst(p, [255, 220, 140], 18);
		for (const e of enemies) {
			if (!e || e.dead) continue;
			if (e.pos.dist(p) < 72) {
				e.stun = 1.5;
				damageEnemy(e, 1);
			}
		}
		for (const b of braziers) {
			if (!b.lit && b.x !== undefined && vec2(b.x, b.baseY).dist(p) < 64) lightBrazier(b);
		}
		checkBraziers();
	}

	function spawnProjectile(x, y, dir) {
		const p = add([
			sprite("bomb_f0"), pos(x, y), anchor("center"), z(y + 12),
			area({ width: 10, height: 10 }), "projectile",
			{ vx: dir.x * 62, vy: dir.y * 62, life: 3.2 },
		]);
		projectiles.push(p);
		return p;
	}

	function hurtPlayer(amount = 1, sourcePos = null) {
		if (player.iframes > 0 || G.uiLocked) return;
		G.hearts -= amount;
		G.combo = 0;
		G.comboTimer = 0;
		player.iframes = 1.2;
		player.hitAnim = 0.18;
		play("hurt", { volume: 0.55 });
		shake(7);
		flash(rgb(130, 20, 20), 0.28);
		burst(player.pos, [220, 40, 40], 14);
		if (G.hearts <= 0) {
			G.uiLocked = true;
			wait(0.6, () => go("gameover", { room: G.room }));
		}
	}

	function tryExit() {
		if (!exitObj || G.transitioning || G.uiLocked) return;
		if (player.pos.dist(exitObj.pos) > 12) return;
		G.transitioning = true;
		G.uiLocked = true;
		play("open", { volume: 0.5 });
		flash(rgb(255, 230, 190), 0.25);
		const fadeOut = add([rect(W * U, H * U), pos(0, 0), color(rgb(0, 0, 0)), opacity(0), z(20001), fixed()]);
		tween(0, 1, 0.32, (v) => (fadeOut.opacity = v));
		wait(0.4, () => go("game", { room: G.room + 1 }));
	}

	player.onCollide("oil", (o) => {
		G.oil = Math.min(G.maxOil, G.oil + (o.amount || 30));
		play("pickup", { volume: 0.45 });
		floatText(o.pos, "YAĞ +", [140, 200, 255]);
		o.destroy();
	});
	player.onCollide("heart", (h) => {
		if (G.hearts < G.maxHearts) G.hearts++;
		play("pickup", { volume: 0.5 });
		floatText(h.pos, "CAN +", [255, 120, 140]);
		h.destroy();
	});
	player.onCollide("flarepickup", (f) => {
		G.hasFlare = true;
		play("pickup", { volume: 0.5 });
		floatText(f.pos, "KOR KAZANDIN — Q", [255, 210, 120]);
		f.destroy();
	});
	player.onCollide("memory", (m) => {
		G.collectedMemories[m.idx] = true;
		G.memories = Object.keys(G.collectedMemories).filter((k) => G.collectedMemories[k]).length;
		play("pickup", { volume: 0.55 });
		floatText(m.pos, `HATIRA ${G.memories}/3`, [150, 210, 235]);
		showCaption([STORY.memories[m.idx] || "Bir hatıra."], 4.5);
		burst(m.pos, [120, 200, 255], 12);
		m.destroy();
	});

	/* ---------------- interaction ---------------- */
	onKeyPress(["e", "enter"], () => {
		if (G.paused) return;
		if (dialogue) {
			advanceDialogue();
			return;
		}
		if (G.uiLocked) return;

		for (const c of get("chest")) {
			if (c.opened) continue;
			if (c.pos.dist(player.pos) < 24) {
				c.opened = true;
				if (c.key) G.openedChests[c.key] = true;
				c.use(sprite("chest_open", { anim: "open" }));
				play("open", { volume: 0.5 });
				spawnHeart(c.pos.x, c.pos.y - 6);
				floatText(c.pos, "BİR HATIRA", [255, 200, 130]);
				return;
			}
		}
		if (crate && crate.pos.dist(player.pos) < 26) {
			tryPushCrate();
			return;
		}
		if (npc && npc.pos.dist(player.pos) < 30) {
			if (npc.type === "priest") {
				startDialogue(STORY.dialogues.priest, () => {
					if (!G.talked.priest) {
						G.talked.priest = true;
						if (G.hearts < G.maxHearts) G.hearts++;
						floatText(player.pos, "RAHİP SENİ ONARDI", [255, 220, 170]);
					}
				});
			} else {
				startDialogue(STORY.dialogues.merchant, () => {
					if (!G.talked.merchant) {
						G.talked.merchant = true;
						G.hasFlare = true;
						floatText(player.pos, "KOR KAZANDIN — Q", [255, 210, 120]);
					}
				});
			}
			return;
		}
	});

	onKeyPress(["j", "x"], attack);
	onKeyPress("q", flareBurst);
	onKeyPress("escape", () => {
		if (G.uiLocked || dialogue) return;
		G.paused = !G.paused;
		if (G.paused) {
			const p1 = uiText("DURAKLATILDI", 160, 66, 9, [230, 215, 190]);
			p1.use(anchor("top"));
			const p2 = uiText("ESC: DEVAM", 160, 90, 6, [150, 130, 110]);
			p2.use(anchor("top"));
			const p3 = uiText("Ses ve ışık seni bekliyor.", 160, 102, 5, [110, 100, 90]);
			p3.use(anchor("top"));
			pauseObjs = [...uiPanel(80, 58, 160, 58, [10, 8, 13], [120, 95, 70]), p1, p2, p3];
		} else {
			for (const o of pauseObjs) o.destroy();
			pauseObjs = [];
		}
	});

	/* ---------------- main update ---------------- */
	onUpdate(() => {
		if (G.paused) return;
		const d = dt();
		if (G.hitStop > 0) {
			G.hitStop = Math.max(0, G.hitStop - d);
			return;
		}
		player.attackCd = Math.max(0, player.attackCd - d);
		player.atkTimer = Math.max(0, player.atkTimer - d);
		player.dashCd = Math.max(0, player.dashCd - d);
		player.iframes = Math.max(0, player.iframes - d);
		player.dashTime = Math.max(0, player.dashTime - d);
		G.flareCd = Math.max(0, G.flareCd - d);
		G.comboTimer = Math.max(0, G.comboTimer - d);
		if (G.comboTimer === 0) G.combo = 0;

		if (!G.uiLocked) {
			G.oil = Math.max(0, G.oil - d * 0.65);
			enemyGrace = Math.max(0, enemyGrace - d);
		}

		if (!G.hasFlare) {
			for (const f of get("flarepickup")) {
				if (f.pos.dist(player.pos) < 20) {
					G.hasFlare = true;
					play("pickup", { volume: 0.5 });
					floatText(f.pos, "KOR KAZANDIN — Q", [255, 210, 120]);
					f.destroy();
					break;
				}
			}
		}

		if (!G.uiLocked) {
			let dir = vec2(0, 0);
			if (isKeyDown("left") || isKeyDown("a")) dir.x -= 1;
			if (isKeyDown("right") || isKeyDown("d")) dir.x += 1;
			if (isKeyDown("up") || isKeyDown("w")) dir.y -= 1;
			if (isKeyDown("down") || isKeyDown("s")) dir.y += 1;
			if (player.hitAnim > 0) {
				player.hitAnim = Math.max(0, player.hitAnim - d);
				player.play("hit");
			} else if (dir.len() > 0) {
				dir = dir.unit();
				player.facing = dir;
				player.flipX = dir.x < 0;
				player.play("run");
				player.walkT += d;
				if (player.walkT > 0.28) {
					player.walkT = 0;
					play("step", { volume: 0.12 });
				}
			} else {
				player.play("idle");
			}

			if ((isKeyDown("shift") || isKeyDown("k")) && player.dashCd <= 0 && dir.len() > 0) {
				player.dashTime = 0.18;
				player.dashCd = 0.9;
				player.iframes = Math.max(player.iframes, 0.32);
				play("swing", { volume: 0.25 });
				add([
					sprite("hero", { frame: 4 }), pos(player.pos.x, player.pos.y), anchor("center"),
					opacity(0.35), color(rgb(140, 200, 255)), z(player.z - 1), lifespan(0.2),
				]);
			}

			if (player.dashTime > 0) player.move(player.facing.scale(DASH_SPEED));
			else if (dir.len() > 0) player.move(dir.scale(SPEED));
		}

		player.z = player.pos.y + 14;
		player.shadow.pos = vec2(player.pos.x, player.pos.y + 13);
		player.shadow.z = player.z - 0.5;
		player.glow.pos = vec2(player.pos.x, player.pos.y + 2);
		player.glow.z = 4;
		const oilRatio = G.oil / G.maxOil;
		player.glow.opacity = (0.14 + oilRatio * 0.22) * (0.85 + Math.sin(time() * 7) * 0.15);
		player.glow.scale = vec2(2.0 + oilRatio * 1.3);
		if (player.iframes > 0) player.opacity = 0.45 + Math.sin(time() * 30) * 0.3;
		else player.opacity = 1;

		vignette.opacity = 0.55 + (1 - oilRatio) * 0.32;

		let promptTarget = null;
		let promptLabel = "E";
		if (npc && npc.pos.dist(player.pos) < 30) promptTarget = npc;
		else if (crate && crate.pos.dist(player.pos) < 26) promptTarget = crate;
		else {
			for (const c of get("chest")) {
				if (!c.opened && c.pos.dist(player.pos) < 24) {
					promptTarget = c;
					break;
				}
			}
			if (!promptTarget && G.hasFlare) {
				for (const b of braziers) {
					if (!b.lit && vec2(b.x, b.baseY).dist(player.pos) < 64) {
						promptTarget = { pos: vec2(b.x, b.baseY) };
						promptLabel = "Q";
						break;
					}
				}
			}
		}
		if (promptTarget) {
			interactPrompt.hidden = false;
			interactPrompt.text = promptLabel;
			interactPrompt.pos = vec2(promptTarget.pos.x, promptTarget.pos.y - 24);
			interactPrompt.z = 6000;
		} else {
			interactPrompt.hidden = true;
		}

		if (G.hearts <= 1) {
			G.heartTimer -= d;
			if (G.heartTimer <= 0) {
				G.heartTimer = 0.9;
				play("hurt", { volume: 0.1, speed: 0.55 });
			}
		} else {
			G.heartTimer = 0;
		}
		if (!G.uiLocked) tryExit();

		for (const e of enemies) {
			if (!e || e.dead) continue;
			e.flash = Math.max(0, e.flash - d);
			if (e.flash === 0) e.color = e.boss && e.phase === 2 ? rgb(255, 155, 120) : rgb(255, 255, 255);
			e.z = e.pos.y + (e.boss ? 18 : 12);
		}

		for (const p of plates) {
			const dist = player.pos.dist(p.pos);
			if (dist < 13 && !p.inside && !p.pressed) {
				p.inside = true;
				if (room.name === "bridge") pressBridgePlate(p);
				else pressPlate(p);
			} else if (dist > 20) {
				p.inside = false;
			}
		}

		for (const f of fog) {
			f.pos.x += 2.2 * d;
			if (f.pos.x > W + 40) f.pos.x = -40;
			f.pos.y += Math.sin(time() * 0.4 + f.pos.x * 0.02) * 0.03;
		}

		for (const b of braziers) {
			if (!b.lit) continue;
			const f = Math.sin(time() * 12 + b.tx * 2.1);
			b.flame.opacity = 0.72 + f * 0.24;
			b.flame.scale = vec2(0.08 + f * 0.008, 0.09 - f * 0.005);
			b.flame.pos.y = b.baseY + Math.sin(time() * 3 + b.ty) * 1.2;
			b.glow.opacity = 0.36 + f * 0.08;
		}

		for (const c of collapsers) {
			if (c.triggered || G.uiLocked) continue;
			const cp = center(c.tx, c.ty);
			if (player.pos.dist(cp) < 10) {
				c.triggered = true;
				tween(1, 0.15, 0.28, (v) => (c.floor.opacity = v));
				wait(0.3, () => {
					c.floor.hidden = true;
					c.hole = add([sprite("hole"), pos(cp.x - 8, cp.y - 8), z(2)]);
					burst(cp, [120, 100, 90], 8);
					play("break", { volume: 0.2 });
					if (player.pos.dist(cp) < 10) {
						hurtPlayer(1, cp);
						player.pos = center(3, 5);
						floatText(player.pos, "KÖPRÜ ÇÖKTÜ", [255, 140, 120]);
					}
					wait(2.2, () => {
						if (c.hole) c.hole.destroy();
						c.hole = null;
						c.floor.hidden = false;
						c.floor.opacity = 1;
						c.triggered = false;
					});
				});
			}
		}

		for (const s of spikes) {
			const active = (time() + s.phase) % 1.5 < 0.75;
			s.opacity = active ? 1 : 0.3;
			s.color = active ? rgb(255, 140, 130) : rgb(90, 80, 90);
			if (active && !G.uiLocked && s.pos.dist(player.pos) < 10) hurtPlayer(1, s.pos);
		}

		if (!G.uiLocked) {
			for (const e of enemies) {
				if (!e || e.dead) continue;
				if (enemyGrace > 0) {
					e.play("idle");
					continue;
				}
				if (e.stun > 0) {
					e.stun -= d;
					e.play("idle");
					continue;
				}
				const to = player.pos.sub(e.pos);
				const dist = to.len();
				if (dist < e.aggro && dist > 4) {
					e.play("run");
					e.flipX = to.x < 0;
					if (e.boss) {
						e.chargeCd -= d;
						if (e.hp <= e.maxHp / 2 && e.phase === 1) {
							e.phase = 2;
							e.speed = 38;
							play("roar", { volume: 0.4 });
							shake(6);
							for (const [ox, oy] of [[-3, 2], [3, 2]]) {
								spawnEnemy("imp", Math.max(1, Math.round(e.pos.x / 16) + ox), Math.max(1, Math.round(e.pos.y / 16) + oy));
							}
							for (let a = 0; a < 8; a++) {
								const ang = (a / 8) * Math.PI * 2;
								spawnProjectile(e.pos.x, e.pos.y, vec2(Math.cos(ang), Math.sin(ang)));
							}
						}
						if (e.chargeCd <= 0 && dist < 110) {
							e.chargeCd = 2.8;
							e.chargeTime = 0.5;
							e.chargeDir = to.unit();
							e.color = rgb(255, 120, 90);
							shake(3);
						}
						if (e.chargeTime > 0) {
							e.chargeTime -= d;
							e.play("run");
							e.move(e.chargeDir.scale(120));
						} else {
							e.move(to.unit().scale(e.speed));
						}
					} else if (e.enemyType === "orc") {
						e.chargeCd -= d;
						if (e.chargeCd <= 0 && dist < 120) {
							e.chargeCd = 2.4;
							e.chargeTime = 0.35;
							e.chargeDir = to.unit();
							e.color = rgb(255, 150, 120);
						}
						if (e.chargeTime > 0) {
							e.chargeTime -= d;
							e.move(e.chargeDir.scale(105));
						} else {
							e.move(to.unit().scale(e.speed));
						}
					} else if (e.enemyType === "chort") {
						e.shootCd -= d;
						if (dist < 100) e.move(to.unit().scale(-e.speed));
						else if (dist > 135) e.move(to.unit().scale(e.speed));
						if (e.shootCd <= 0 && dist < 185) {
							e.shootCd = 2.4;
							const aim = player.pos.sub(e.pos);
							if (aim.len() > 0) spawnProjectile(e.pos.x, e.pos.y + 4, aim.unit());
							play("swing", { volume: 0.2 });
						}
					} else if (e.enemyType === "imp") {
						const side = vec2(-to.y, to.x).unit().scale(Math.sin(time() * 5 + e.seed) * 22);
						e.move(to.unit().scale(e.speed).add(side));
					} else if (e.enemyType === "skelet") {
						e.chargeCd -= d;
						if (e.chargeCd <= 0 && dist < 70) {
							e.chargeCd = 2.2;
							e.chargeTime = 0.25;
							e.chargeDir = to.unit();
						}
						if (e.chargeTime > 0) {
							e.chargeTime -= d;
							e.move(e.chargeDir.scale(85));
						} else {
							e.move(to.unit().scale(e.speed));
						}
					} else {
						e.move(to.unit().scale(e.speed));
					}
				} else {
					e.play("idle");
				}
			}
		}

		if (!G.uiLocked && enemyGrace <= 0) {
			for (const e of enemies) {
				if (!e || e.dead) continue;
				if (e.pos.dist(player.pos) < 15) {
					const away = e.pos.sub(player.pos);
					if (away.len() > 0) e.pos = e.pos.add(away.unit().scale(10));
					hurtPlayer(1, e.pos);
					break;
				}
			}
		}

		for (let i = projectiles.length - 1; i >= 0; i--) {
			const pr = projectiles[i];
			if (!pr) {
				projectiles.splice(i, 1);
				continue;
			}
			pr.pos.x += pr.vx * d;
			pr.pos.y += pr.vy * d;
			pr.life -= d;
			pr.z = pr.pos.y + 12;
			pr.flipX = pr.vx < 0;
			const inside = floorAt(Math.floor(pr.pos.x / TILE), Math.floor(pr.pos.y / TILE));
			if (pr.life <= 0 || !inside) {
				burst(pr.pos, [180, 120, 60], 4);
				pr.destroy();
				projectiles.splice(i, 1);
				continue;
			}
			if (!G.uiLocked && pr.pos.dist(player.pos) < 11) {
				hurtPlayer(1, pr.pos);
				burst(pr.pos, [230, 100, 60], 8);
				pr.destroy();
				projectiles.splice(i, 1);
			}
		}

		if (boss && bossBar) bossBar.width = Math.max(0, 120 * U * (boss.hp / boss.maxHp));
		updateHUD();
	});
});

/* ------------------------------------------------------------------ */
/* GAME OVER                                                           */
/* ------------------------------------------------------------------ */

scene("gameover", (data = {}) => {
	setCamScale(2);
	setCamPos(W / 2, H / 2);
	add([rect(W, H), pos(0, 0), color(rgb(8, 3, 6)), z(0)]);
	add([sprite("vignette"), pos(0, 0), z(10), opacity(0.95)]);
	add([sprite("ghost", { anim: "idle" }), pos(160, 46), anchor("center"), scale(2), opacity(0.25), color(rgb(255, 150, 150)), z(5)]);

	add([text("KUYU SENİ TUTTU", { size: 15, font: "titlefont" }), pos(160, 68), anchor("top"), color(rgb(235, 190, 180)), z(20)]);
	add([text("Fenerin söndü. Ama ses hâlâ aşağıda.", { size: 7, font: "pixel", width: 260, align: "center" }), pos(160, 96), anchor("top"), color(rgb(160, 130, 130)), z(20)]);
	add([text("R: BU ODADAN DEVAM    •    ENTER: BAŞTAN", { size: 6, font: "pixel" }), pos(160, 138), anchor("top"), color(rgb(220, 180, 130)), z(20)]);

	onKeyPress("r", () => {
		G.hearts = 3;
		G.oil = 100;
		G.uiLocked = false;
		go("game", { room: data.room ?? G.room });
	});
	onKeyPress("enter", () => {
		resetRun();
		go("game", { room: 0 });
	});
});

/* ------------------------------------------------------------------ */
/* ENDING                                                              */
/* ------------------------------------------------------------------ */

scene("ending", (data = {}) => {
	setCamScale(2);
	setCamPos(W / 2, H / 2);
	if (G.ambient) {
		G.ambient.stop();
		G.ambient = null;
	}
	const ending = STORY.endings[data.type] || STORY.endings.break;
	const lines = [...ending.lines];
	if (G.memories >= 3) {
		lines.push(
			data.type === "copy"
				? "Üç hatırayı taşıdın. Kopya ilk kez gerçek adını söyledi: Zeynep. Ama sesi hâlâ yanlıştı."
				: "Üç hatırayı taşıdın. Kuyunun dibinde gerçek Zeynep’in son sözü kaldı: “Beni bırak.”",
		);
	}
	add([rect(W, H), pos(0, 0), color(rgb(5, 5, 9)), z(0)]);
	add([sprite("vignette"), pos(0, 0), z(10), opacity(0.9)]);
	play("ending_jingle", { volume: 0.4 });

	add([text(ending.title, { size: 11, font: "titlefont" }), pos(160, 20), anchor("top"), color(rgb(235, 215, 180)), z(20)]);
	const lineObj = add([
		text("", { size: 8, font: "pixel", width: 270, align: "center" }),
		pos(160, 46), anchor("top"), color(rgb(205, 195, 180)), z(20),
	]);
	let index = 0;
	let chars = 0;
	let done = false;
	const hint = add([text("ENTER: BAŞA DÖN", { size: 5, font: "pixel" }), pos(160, 160), anchor("top"), color(rgb(140, 120, 95)), z(20)]);
	tween(0, 1, 1.2, (v) => (hint.opacity = v));

	function advance() {
		if (!done) {
			chars = lines[index].length;
			lineObj.text = lines[index];
			done = true;
			return;
		}
		index++;
		if (index >= lines.length) {
			resetRun();
			go("title");
			return;
		}
		chars = 0;
		done = false;
		lineObj.text = "";
	}
	onUpdate(() => {
		if (done) return;
		chars += dt() * 40;
		const full = lines[index];
		const n = Math.min(full.length, Math.floor(chars));
		lineObj.text = full.slice(0, n);
		if (n >= full.length) done = true;
	});
	onKeyPress(["enter", "space", "e"], advance);
});

go("title");

if (import.meta.env.DEV) {
	window.__k = k;
	window.__G = G;
}
