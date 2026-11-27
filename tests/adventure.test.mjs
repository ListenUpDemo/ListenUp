import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAdventureAction,
  HEART_INTERVAL,
  initialAdventure,
  resolvedStage,
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
  act(
    act(state, "select", index, { ...props, answer: value }),
    "answer",
    index,
    {
      random: 0,
      unlocked: 0,
      ...props,
    },
  );

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

test("khiên giữ sinh mệnh và cho bỏ qua chặng thường mà vẫn lưu câu đã chọn", () => {
  const state = prepare({
    ...initialAdventure,
    inventory: { "shield-1": 2, "sword-1": 5 },
    loadout: { shield: "shield-1", sword: "sword-1" },
  });
  const skipped = answer(state, 0, 1);
  assert.equal(skipped.health, 5);
  assert.equal(skipped.coins, 18);
  assert.equal(skipped.inventory["shield-1"], 1);
  assert.equal(skipped.inventory["sword-1"], 4);
  assert.deepEqual(resolvedStage(expedition, skipped.runs[key]), {
    answer: 1,
    correct: false,
    skipped: true,
    coins: 18,
    bonus: 3,
    chest: undefined,
  });
  assert.equal(answer(skipped, 0, 2), skipped);
  const middle = answer(act(skipped, "advance", 0), 1, 0);
  const final = act(act(middle, "open", 1), "advance", 1);
  const completed = act(act(answer(final, 2, 0), "open", 2), "advance", 2);
  assert.equal(completed.attempts[0].answers.q0, 1);
  assert.equal(completed.attempts[0].score, 2);
});

test("chặng thường với khiên hết độ bền trừ sinh mệnh và phải trả lời đúng", () => {
  const run = prepare({
    ...initialAdventure,
    inventory: { "shield-1": 2 },
    loadout: { shield: "shield-1" },
  });
  const state = { ...run, inventory: { "shield-1": 0 } };
  const miss = answer(state, 0, 1);
  assert.equal(miss.health, 4);
  assert.equal(miss.coins, 0);
  assert.equal(miss.runs[key].feedback, "damage");
  assert.equal(resolvedStage(expedition, miss.runs[key]), undefined);
  assert.equal(act(miss, "answer", 0, { random: 0, unlocked: 0 }), miss);
  assert.equal(act(miss, "advance", 0), miss);
  assert.equal(answer(miss, 0, 0).coins, 15);
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
  const healed = shop(equipped, "drink", "potion-3");
  assert.equal(healed.health, 5);
  assert.equal(healed.inventory["potion-3"], 0);
  assert.equal(healed.nextHeartAt, null);
  assert.equal(healed.runs[key].usedPotion, undefined);
  assert.equal(shop(healed, "drink", "potion-3"), healed);
});

test("khiên ở chặng cuối chỉ giữ sinh mệnh, chặng chỉ trả thưởng khi đúng", () => {
  const run = prepare({
    ...initialAdventure,
    inventory: { "shield-1": 2, "sword-1": 5 },
    loadout: { shield: "shield-1", sword: "sword-1" },
  });
  let state = act(answer(run, 0, 0), "advance", 0);
  state = act(act(answer(state, 1, 0), "open", 1), "advance", 1);
  const blocked = answer(answer(state, 2, 1), 2, 1);
  assert.equal(blocked.health, 5);
  assert.equal(blocked.inventory["shield-1"], 0);
  assert.equal(blocked.runs[key].feedback, "shield");
  assert.equal(resolvedStage(expedition, blocked.runs[key]), undefined);
  const miss = answer(blocked, 2, 2);
  assert.equal(miss.health, 4);
  assert.equal(miss.coins, state.coins);
  assert.deepEqual(miss.inventory, blocked.inventory);
  assert.equal(miss.runs[key].feedback, "damage");
  assert.equal(resolvedStage(expedition, miss.runs[key]), undefined);
  assert.equal(act(miss, "advance", 2), miss);
  assert.equal(act(miss, "open", 2), miss);
  const correct = answer(miss, 2, 0);
  assert.equal(correct.coins, state.coins + 18);
  assert.equal(correct.inventory["sword-1"], state.inventory["sword-1"] - 1);
  assert.equal(resolvedStage(expedition, correct.runs[key]).correct, true);
});

test("thuốc tự cứu một lần mỗi lượt, hết sinh mệnh lần nữa đánh dấu thất bại", () => {
  const low = {
    ...initialAdventure,
    health: 1,
    nextHeartAt: now + HEART_INTERVAL,
    inventory: { "potion-1": 2 },
    loadout: { potion: "potion-1" },
  };
  const state = prepare(low);
  const revived = answer(state, 0, 1);
  assert.equal(revived.health, 1);
  assert.equal(revived.inventory["potion-1"], 1);
  assert.equal(revived.runs[key].usedPotion, true);
  assert.equal(resolvedStage(expedition, revived.runs[key]), undefined);
  const failed = answer(revived, 0, 1);
  assert.equal(failed.health, 0);
  assert.equal(failed.inventory["potion-1"], 1);
  assert.equal(failed.runs[key].failed, true);
  assert.equal(failed.runs[key].finished, false);
  assert.equal(failed.attempts.length, 0);
  assert.equal(failed.coins, revived.coins);
  assert.equal(prepare(failed), failed);
  const healed = applyAdventureAction(
    failed,
    { type: "drink", itemId: "potion-1" },
    now,
  );
  assert.equal(act(healed, "advance", 1), healed);
  const retry = prepare(healed);
  assert.equal(retry.runs[key].failed, undefined);
  assert.equal(retry.runs[key].index, 0);
  assert.equal(retry.runs[key].usedPotion, undefined);
});

test("chặng cuối lưu trước bản cập nhật phải trả lời đúng mà không trả lại vàng hoặc rương", () => {
  let state = prepare();
  state = act(answer(state, 0, 0), "advance", 0);
  state = act(act(answer(state, 1, 0), "open", 1), "advance", 1);
  state = act(answer(state, 2, 0), "open", 2);
  state.runs[key].outcomes[2] = {
    ...state.runs[key].outcomes[2],
    answer: 1,
    correct: false,
  };
  assert.equal(act(state, "advance", 2), state);
  const corrected = answer(state, 2, 0);
  assert.equal(corrected.coins, state.coins);
  assert.equal(act(corrected, "open", 2), corrected);
  const completed = act(corrected, "advance", 2);
  assert.equal(completed.attempts[0].score, 3);
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
