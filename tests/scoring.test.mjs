import test from "node:test";
import assert from "node:assert/strict";
import { gradeAnswers, normalizeSearch } from "../src/utils/scoring.mjs";
const questions = [
  { id: "q1", answer: 0 },
  { id: "q2", answer: 2 },
  { id: "q3", answer: 1 },
];
test("grading counts option zero and does not count unanswered questions", () => {
  assert.equal(gradeAnswers(questions, { q1: 0, q2: 1 }), 1);
  assert.equal(gradeAnswers(questions, {}), 0);
  assert.equal(gradeAnswers(questions, { q1: 0, q2: 2, q3: 1 }), 3);
});
test("search matches Vietnamese with or without accents and case", () => {
  assert.equal(normalizeSearch("  Đời sống & CÀ PHÊ  "), "doi song & ca phe");
  assert.ok(normalizeSearch("Gọi cà phê").includes(normalizeSearch("CA PHE")));
});
