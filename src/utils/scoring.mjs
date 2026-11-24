export function gradeAnswers(questions, answers) {
  return questions.reduce(
    (score, question) =>
      score + Number(answers[question.id] === question.answer),
    0,
  );
}
export function normalizeSearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
