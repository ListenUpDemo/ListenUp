import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const samples = [
  ["beginner", "coffee-shop"],
  ["beginner", "airport"],
  ["beginner", "weekend"],
  ["intermediate", "meeting"],
  ["intermediate", "bookshop"],
  ["advanced", "remote-work"],
];
for (const [level, id] of samples)
  test(`${id}: playable PCM WAV and transcript timing stay in sync`, () => {
    const audio = fs.readFileSync(`public/assets/audio/${level}/${id}.wav`);
    assert.equal(audio.toString("ascii", 0, 4), "RIFF");
    assert.equal(audio.toString("ascii", 8, 12), "WAVE");
    const duration = audio.readUInt32LE(40) / audio.readUInt32LE(28);
    assert.ok(duration > 20 && duration < 120);
    const lines = JSON.parse(
      fs
        .readFileSync(`public/assets/transcripts/${id}.json`, "utf8")
        .replace(/^\uFEFF/, ""),
    );
    assert.ok(lines.length >= 5);
    let end = 0;
    for (const line of lines) {
      assert.ok(line.start >= end - 0.02 && line.end > line.start);
      assert.ok(line.text && line.speaker);
      end = line.end;
    }
    assert.ok(Math.abs(end - duration) < 0.1);
  });
