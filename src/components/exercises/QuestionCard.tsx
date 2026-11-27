import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { Question } from "../../types";
export default function QuestionCard({
  question,
  index,
  value,
  checked,
  inactive = false,
  onChange,
}: {
  question: Question;
  index: number;
  value: number | undefined;
  checked: boolean;
  inactive?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="question-card card">
      <span className="eyebrow">CÂU HỎI {index + 1}</span>
      <fieldset>
        <legend>{question.prompt}</legend>
        <div className="answer-options">
          {question.options.map((option, i) => (
            <label
              key={option}
              className={`answer-option ${value === i ? "selected" : ""} ${checked && i === question.answer ? "correct" : ""} ${checked && value === i && i !== question.answer ? "incorrect" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                value={i}
                checked={value === i}
                disabled={checked || inactive}
                onChange={() => onChange(i)}
              />
              <span className="option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{option}</span>
              {checked && i === question.answer ? (
                <CheckCircle2 size={20} />
              ) : checked && value === i ? (
                <XCircle size={20} />
              ) : null}
            </label>
          ))}
        </div>
      </fieldset>
      {checked && (
        <div
          className={`answer-feedback ${value === question.answer ? "correct-feedback" : "incorrect-feedback"}`}
          role="status"
        >
          <strong>
            {value === question.answer ? (
              <CheckCircle2 size={19} />
            ) : (
              <XCircle size={19} />
            )}{" "}
            {value === question.answer
              ? "Chính xác! Bạn nghe tốt lắm."
              : `Chưa đúng. Đáp án đúng là ${question.options[question.answer]}.`}
          </strong>
          <p>
            <Lightbulb size={16} />
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
