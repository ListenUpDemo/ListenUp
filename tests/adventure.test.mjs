import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAdventureAction,
  HEART_INTERVAL,
  initialAdventure,
  settleHealth,
} from "../src/features/adventure/engine.ts";

const now = 1_000_000;
const questions = Array.from({ length: 3 }, (_, index) => ({
  id: `q${index}`,
  options: ["A", "B", "C", "D"],
  answer: 0,
}));
const lesson = { id: "lesson", questions };
const expedition = {
  id: "campaign",
  kind: "campaign",
  stages: questions.map((question) => ({ kind: "question", lesson, question })),
};
const key = "campaign:campaign";
const version = "run-1";
const prepare = (state = initialAdventure, map = expedition, id = key) =>
  applyAdventureAction(
    state,
    { type: "start", expedition: map, key: id, version },
    now,
  );
const act = (state, type, index, props = {}) =>
  applyAdventureAction(
    state,
    { type, index, expedition, key, version, ...props },
    now,
  );
const answer = (state, index, value, props = {}) =>
  act(state, "answer", index, {
    answer: value,
    random: 0,
    unlocked: 0,
    ...props,
  });

test("sinh mệnh hồi mỗi 10 phút, kể cả thời gian ứng dụng đóng", () => {
  const state = answer(prepare(), 0, 1);
  assert.equal(state.health, 4);
  assert.equal(state.nextHeartAt, now + HEART_INTERVAL);
  assert.equal(settleHealth(state, now + HEART_INTERVAL - 1).health, 4);
  const healed = settleHealth(
    { ...state, health: 1 },
    now + 2 * HEART_INTERVAL,
  );
  assert.equal(healed.health, 3);
  assert.equal(healed.nextHeartAt, now + 3 * HEART_INTERVAL);
  const full = settleHealth(healed, now + 10 * HEART_INTERVAL);
  assert.equal(full.health, 5);
  assert.equal(full.nextHeartAt, null);
});

test("khiên loại câu sai hai lần và ngừng chặn khi chỉ còn hai lựa chọn", () => {
  const state = prepare({
    ...initialAdventure,
    inventory: { "shield-3": 6, "sword-1": 5 },
    loadout: { shield: "shield-3", sword: "sword-1" },
  });
  const blockedOnce = answer(state, 0, 1);
  const blockedTwice = answer(blockedOnce, 0, 2);
  assert.equal(blockedTwice.health, 5);
  assert.equal(blockedTwice.coins, 0);
  assert.equal(blockedTwice.inventory["shield-3"], 4);
  assert.deepEqual(blockedTwice.runs[key].eliminated, [1, 2]);
  assert.equal(answer(blockedTwice, 0, 1), blockedTwice);

  const failed = answer(blockedTwice, 0, 3);
  assert.equal(failed.health, 4);
  assert.equal(failed.inventory["shield-3"], 4);
  assert.equal(failed.inventory["sword-1"], 4);
  assert.equal(failed.coins, 18);
  assert.equal(answer(failed, 0, 0), failed);
});

test("rương mở một lần, phục hồi độ bền và hoàn tất lượt làm có index 0", () => {
  let state = prepare({ ...initialAdventure, inventory: { "shield-1": 0 } });
  state = act(answer(state, 0, 0), "advance", 0);
  state = answer(state, 1, 0, { random: 0.99 });
  assert.equal(act(state, "advance", 1), state);
  state = act(state, "open", 1);
  assert.equal(state.inventory["potion-5"], 1);
  assert.equal(act(state, "open", 1), state);
  state = act(state, "advance", 1);
  state = act(answer(state, 2, 0), "open", 2);
  assert.equal(state.inventory["shield-1"], 2);
  const completed = act(state, "advance", 2);
  assert.equal(completed.attempts[0].score, 3);
  assert.deepEqual(completed.clearedCampaigns, [expedition.id]);
  assert.equal(act(completed, "advance", 2), completed);
});

test("túi đồ khóa theo lượt, thuốc không vượt tối đa và bảo dưỡng rẻ hơn mua", () => {
  const stocked = {
    ...initialAdventure,
    health: 4,
    coins: 200,
    nextHeartAt: now + HEART_INTERVAL,
    inventory: { "potion-3": 1, "sword-1": 0 },
    loadout: { potion: "potion-3" },
  };
  const shop = (state, type, itemId, unlocked = 0) =>
    applyAdventureAction(state, { type, itemId, unlocked }, now);
  const run = prepare(stocked);
  const repaired = shop(run, "repair", "sword-1");
  assert.equal(repaired.coins, 180);
  assert.equal(repaired.inventory["sword-1"], 5);
  const equipped = shop(repaired, "equip", "sword-1");
  assert.equal(equipped.loadout.sword, "sword-1");
  assert.equal(equipped.runs[key].loadout.sword, undefined);
  assert.equal(shop(equipped, "buy", "cat-1"), equipped);
  assert.equal(shop(equipped, "buy", "cat-1", 1).inventory["cat-1"], 1);
  const healed = act(equipped, "heal", 0);
  assert.equal(healed.health, 5);
  assert.equal(healed.inventory["potion-3"], 0);
  assert.equal(healed.nextHeartAt, null);
});

test("ải hằng ngày không thể bắt đầu lại sau khi đã hoàn thành", () => {
  const daily = { ...expedition, id: "daily-2026-11-28", kind: "daily" };
  const id = "daily:daily-2026-11-28";
  let state = prepare(initialAdventure, daily, id);
  for (let index = 0; index < 3; index++) {
    const props = { expedition: daily, key: id };
    state = answer(state, index, 0, props);
    if (index > 0) state = act(state, "open", index, props);
    state = act(state, "advance", index, props);
  }
  assert.equal(state.runs[id].finished, true);
  assert.equal(state.clearedCampaigns.length, 0);
  assert.equal(prepare(state, daily, id), state);
});
