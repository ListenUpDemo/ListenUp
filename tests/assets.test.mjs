import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import stories from "../src/data/mock/us-lessons.json" with { type: "json" };
import timings from "../src/data/mock/usAudioTimings.json" with { type: "json" };
const samples = [
  ["beginner", "coffee-shop"],
  ["beginner", "airport"],
  ["beginner", "weekend"],
  ["intermediate", "meeting"],
  ["intermediate", "bookshop"],
  ["advanced", "remote-work"],
  ...stories.map(({ id }) => [timings[id].folder, id]),
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
    const story = stories.find((story) => story.id === id);
    if (story) {
      const sample = lines[story.sample];
      assert.deepEqual(
        [sample.speaker, sample.text],
        story.lines[story.sample],
      );
      assert.equal(timings[id].start, sample.start);
      assert.equal(timings[id].end, sample.end);
      assert.equal(timings[id].duration, Math.round(duration));
      assert.ok(
        story.questions.every(
          ({ options, answer }) =>
            Number.isInteger(answer) && answer >= 0 && answer < options.length,
        ),
      );
    }
  });
