import { findItem, items, slots } from "../../data/mock/adventureItems.ts";
import { gradeAnswers } from "../../utils/scoring.mjs";
import type { AdventureItem } from "../../data/mock/adventureItems";
import type {
  AdventureState,
  Expedition,
  ExpeditionRun,
  StageOutcome,
} from "../../types/adventure";

export const MAX_HEALTH = 5;
export const HEART_INTERVAL = 10 * 60_000;
export const STAGE_COINS = 15;

export const initialAdventure: AdventureState = {
  health: MAX_HEALTH,
  nextHeartAt: null,
  coins: 0,
  inventory: {},
  loadout: {},
  runs: {},
  clearedCampaigns: [],
  attempts: [],
};

export function settleHealth(
  state: AdventureState,
  now: number,
): AdventureState {
  if (state.nextHeartAt === null || now < state.nextHeartAt) return state;
  const restored = 1 + Math.floor((now - state.nextHeartAt) / HEART_INTERVAL);
  const health = Math.min(MAX_HEALTH, state.health + restored);
  return {
    ...state,
    health,
    nextHeartAt:
      health === MAX_HEALTH
        ? null
        : state.nextHeartAt + restored * HEART_INTERVAL,
  };
}

type ExpeditionAction = { expedition: Expedition; key: string };
type RunAction = ExpeditionAction & { index: number; version: string };
export type AdventureAction =
  | { type: "buy" | "repair" | "equip"; itemId: string; unlocked: number }
  | { type: "drink"; itemId: string }
  | ({ type: "start"; version: string } & ExpeditionAction)
  | ({
      type: "answer";
      random: number;
      unlocked: number;
    } & RunAction)
  | ({ type: "select"; answer: number } & RunAction)
  | ({ type: "advance" | "open" } & RunAction);

function updateItem(state: AdventureState, item: AdventureItem, value: number) {
  return { ...state, inventory: { ...state.inventory, [item.id]: value } };
}

function drinkPotion(state: AdventureState, item: AdventureItem) {
  if (
    item.slot !== "potion" ||
    state.health === MAX_HEALTH ||
    !state.inventory[item.id]
  )
    return state;
  const health = Math.min(MAX_HEALTH, state.health + item.effect);
  return updateItem(
    {
      ...state,
      health,
      nextHeartAt: health === MAX_HEALTH ? null : state.nextHeartAt,
    },
    item,
    state.inventory[item.id] - 1,
  );
}

function manageGear(
  state: AdventureState,
  action: Extract<AdventureAction, { itemId: string }>,
): AdventureState {
  const item = findItem(action.itemId);
  if (!item) return state;
  if (action.type === "drink") return drinkPotion(state, item);
  const value = state.inventory[item.id];
  if (action.type === "equip") {
    if (value === undefined || (item.slot === "potion" && value <= 0))
      return state;
    const equipped = state.loadout[item.slot] === item.id;
    return {
      ...state,
      loadout: {
        ...state.loadout,
        [item.slot]: equipped ? undefined : item.id,
      },
    };
  }
  if (item.unlockedAt > action.unlocked) return state;
  if (action.type === "buy") {
    if (
      state.coins < item.price ||
      (item.slot !== "potion" && value !== undefined)
    )
      return state;
    const next =
      item.slot === "potion" ? (value ?? 0) + 1 : (item.durability ?? 1);
    return updateItem(
      { ...state, coins: state.coins - item.price },
      item,
      next,
    );
  }
  if (
    !item.repair ||
    !item.durability ||
    value === undefined ||
    value >= item.durability ||
    state.coins < item.repair
  )
    return state;
  return updateItem(
    { ...state, coins: state.coins - item.repair },
    item,
    item.durability,
  );
}

export function resolvedStage(expedition: Expedition, run: ExpeditionRun) {
  const outcome = run.outcomes[run.index];
  // A saved final-stage miss from the earlier rules already paid its reward.
  return run.index === expedition.stages.length - 1 && !outcome?.correct
    ? undefined
    : outcome;
}

function updateRun(
  state: AdventureState,
  key: string,
  run: ExpeditionRun,
): AdventureState {
  return { ...state, runs: { ...state.runs, [key]: run } };
}

function rewardChest(
  index: number,
  count: number,
  random: number,
  unlocked: number,
): StageOutcome["chest"] {
  const kind =
    index === count - 1
      ? "gear"
      : index === Math.ceil(count / 2) - 1
        ? "potion"
        : undefined;
  if (!kind) return undefined;
  const pool = items.filter((item) =>
    kind === "potion"
      ? item.slot === "potion"
      : (item.slot === "shield" || item.slot === "sword") &&
        item.unlockedAt <= unlocked,
  );
  return { kind, itemId: pool[Math.floor(random * pool.length)].id };
}

export function applyAdventureAction(
  current: AdventureState,
  action: AdventureAction,
  now: number,
): AdventureState {
  let state = settleHealth(current, now);
  if ("itemId" in action) return manageGear(state, action);
  const { key, expedition } = action;
  const run = state.runs[key];
  if (action.type === "start") {
    if (
      state.health === 0 ||
      (run && !run.failed && (!run.finished || expedition.kind === "daily"))
    )
      return state;
    const loadout = Object.fromEntries(
      slots.flatMap((slot) => {
        const id = state.loadout[slot];
        return id && state.inventory[id] > 0 ? [[slot, id]] : [];
      }),
    );
    return updateRun(state, key, {
      version: action.version,
      index: 0,
      startedAt: now,
      loadout,
      outcomes: [],
      finished: false,
      attempts: [],
    });
  }
  if (
    !run ||
    run.finished ||
    run.failed ||
    run.index !== action.index ||
    run.version !== action.version
  )
    return state;

  const outcome = resolvedStage(expedition, run);
  if (action.type === "open") {
    const chest = outcome?.chest;
    if (!chest || chest.opened) return state;
    const loot = findItem(chest.itemId);
    if (!loot) return state;
    const value =
      loot.slot === "potion"
        ? (state.inventory[loot.id] ?? 0) + 1
        : (loot.durability ?? 1);
    return updateRun(updateItem(state, loot, value), key, {
      ...run,
      outcomes: [
        ...run.outcomes.slice(0, run.index),
        { ...outcome, chest: { ...chest, opened: true } },
      ],
    });
  }

  if (action.type === "advance") {
    if (!outcome || (outcome.chest && !outcome.chest.opened)) return state;
    if (run.index + 1 < expedition.stages.length) {
      return updateRun(state, key, {
        ...run,
        index: run.index + 1,
        feedback: undefined,
        selected: undefined,
      });
    }
    const attempts = [
      ...new Set(expedition.stages.map((stage) => stage.lesson)),
    ].map((lesson) => {
      const answers = Object.fromEntries(
        expedition.stages.flatMap((stage, index) =>
          stage.lesson.id === lesson.id
            ? [[stage.question.id, run.outcomes[index].answer]]
            : [],
        ),
      );
      return {
        id: `${run.version}-${lesson.id}`,
        lessonId: lesson.id,
        answers,
        total: lesson.questions.length,
        score: gradeAnswers(lesson.questions, answers),
        completedAt: new Date(now).toISOString(),
        seconds: Math.max(
          1,
          Math.round(
            ((now - run.startedAt) / (1_000 * expedition.stages.length)) *
              lesson.questions.length,
          ),
        ),
      };
    });
    const clearedCampaigns =
      expedition.kind === "campaign" &&
      !state.clearedCampaigns.includes(expedition.id)
        ? [...state.clearedCampaigns, expedition.id]
        : state.clearedCampaigns;
    return updateRun(
      {
        ...state,
        attempts: [...state.attempts, ...attempts],
        clearedCampaigns,
      },
      key,
      {
        ...run,
        finished: true,
        attempts,
      },
    );
  }

  if (
    (action.type !== "answer" && action.type !== "select") ||
    outcome ||
    state.health === 0
  )
    return state;
  const { lesson, question } = expedition.stages[run.index];
  if (action.type === "select") {
    if (
      !Number.isInteger(action.answer) ||
      action.answer < 0 ||
      action.answer >= question.options.length
    )
      return state;
    return updateRun(state, key, { ...run, selected: action.answer });
  }
  const answer = run.selected;
  if (answer === undefined) return state;
  const correct = answer === question.answer;
  const finalStage = run.index === expedition.stages.length - 1;
  const shield = findItem(run.loadout.shield);
  let nextRun = run;
  let skipped = false;
  if (!correct) {
    if (shield && state.inventory[shield.id] > 0) {
      state = updateItem(state, shield, state.inventory[shield.id] - 1);
      skipped = !finalStage;
      nextRun = { ...run, feedback: "shield" };
    } else {
      state = {
        ...state,
        health: state.health - 1,
        nextHeartAt: state.nextHeartAt ?? now + HEART_INTERVAL,
      };
      const potion =
        state.health === 0 && !run.usedPotion
          ? findItem(run.loadout.potion)
          : undefined;
      const restored = potion ? drinkPotion(state, potion) : state;
      nextRun = {
        ...run,
        feedback: "damage",
        usedPotion: run.usedPotion || restored !== state,
        failed: restored.health === 0,
      };
      state = restored;
    }
    if (!skipped) {
      return updateRun(state, key, {
        ...nextRun,
        selected: undefined,
      });
    }
  }
  const savedReward = run.outcomes[run.index];
  if (savedReward) {
    return updateRun(state, key, {
      ...nextRun,
      outcomes: [
        ...run.outcomes.slice(0, run.index),
        { ...savedReward, answer, correct },
      ],
    });
  }
  const sword = findItem(run.loadout.sword);
  const bonus =
    sword && state.inventory[sword.id] > 0
      ? Math.floor((STAGE_COINS * sword.effect) / 100)
      : 0;
  if (sword && bonus) {
    state = updateItem(state, sword, state.inventory[sword.id] - 1);
    const noted = state.notebookLessonIds ?? [];
    if (lesson.pronunciation && !noted.includes(lesson.id)) {
      state = { ...state, notebookLessonIds: [...noted, lesson.id] };
    }
  }
  const coins = STAGE_COINS + bonus;
  const chest = rewardChest(
    run.index,
    expedition.stages.length,
    action.random,
    action.unlocked,
  );
  return updateRun({ ...state, coins: state.coins + coins }, key, {
    ...nextRun,
    outcomes: [
      ...run.outcomes,
      { answer, correct, skipped, coins, bonus, chest },
    ],
  });
}
