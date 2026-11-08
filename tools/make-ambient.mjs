import fs from "node:fs";

const SR = 22050;
const DUR = 12;
const n = SR * DUR;
const buf = Buffer.alloc(44 + n * 2);

function wavHeader() {
	buf.write("RIFF", 0);
	buf.writeUInt32LE(36 + n * 2, 4);
	buf.write("WAVE", 8);
	buf.write("fmt ", 12);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20);
	buf.writeUInt16LE(1, 22);
	buf.writeUInt32LE(SR, 24);
	buf.writeUInt32LE(SR * 2, 28);
	buf.writeUInt16LE(2, 32);
	buf.writeUInt16LE(16, 34);
	buf.write("data", 36);
	buf.writeUInt32LE(n * 2, 40);
}

wavHeader();
for (let i = 0; i < n; i++) {
	const t = i / SR;
	const lfo = 0.65 + 0.35 * Math.sin(2 * Math.PI * t * 0.0833333);
	const drone =
		0.16 * Math.sin(2 * Math.PI * 55 * t) +
		0.10 * Math.sin(2 * Math.PI * 82.5 * t + 0.6) +
		0.055 * Math.sin(2 * Math.PI * 110 * t + 1.7) +
		0.03 * Math.sin(2 * Math.PI * 27.5 * t);
	const air = 0.012 * Math.sin(2 * Math.PI * 440 * t) * Math.sin(2 * Math.PI * 0.05 * t);
	const s = (drone * lfo + air) * 0.9;
	buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s * 32767))), 44 + i * 2);
}

fs.mkdirSync("public/assets/ambient", { recursive: true });
fs.writeFileSync("public/assets/ambient/drone.wav", buf);
console.log("wrote public/assets/ambient/drone.wav", buf.length, "bytes");
