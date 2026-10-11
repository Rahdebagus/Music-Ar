import { useMemo, useState } from 'react';
import {
  getQuiz,
  scoreQuiz,
  saveLastScore,
} from './quizService.js';
import { Button } from '@/components/ui/Button.jsx';
import { useProgress } from '@/hooks/useProgress.js';
import { cn } from '@/utils/cn.js';

/**
 * One-question-at-a-time quiz with progress bar, review of answers, score,
 * and retry. Saves the last score + marks progress in localStorage.
 */
export function QuizRunner() {
  const quiz = useMemo(() => getQuiz(), []);
  const questions = quiz.questions;
  const { markQuizCompleted } = useProgress();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const current = questions[step];
  const selected = answers[current?.id];
  const progress = Math.round(((step + (result ? 1 : 0)) / questions.length) * 100);

  function choose(index) {
    setAnswers((prev) => ({ ...prev, [current.id]: index }));
  }

  function next() {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function finish() {
    const res = scoreQuiz(answers);
    setResult(res);
    saveLastScore(res);
    markQuizCompleted();
  }

  function retry() {
    setAnswers({});
    setResult(null);
    setStep(0);
  }

  if (result) {
    return <QuizResult result={result} onRetry={retry} />;
  }

  return (
    <div className="card-surface p-6">
      {/* progress */}
      <div className="mb-5">
        <div className="mb-1 flex justify-between text-xs font-medium text-wood-500">
          <span>
            Soal {step + 1} dari {questions.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-wood-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-wood-900">{current.question}</h2>

      <div className="mt-4 space-y-2">
        {current.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm transition-colors',
              selected === i
                ? 'border-brand-500 bg-brand-50 text-brand-900'
                : 'border-wood-200 bg-white hover:bg-wood-50'
            )}
          >
            <span
              className={cn(
                'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                selected === i
                  ? 'bg-brand-600 text-white'
                  : 'bg-wood-100 text-wood-600'
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← Sebelumnya
        </Button>
        <Button onClick={next} disabled={selected == null}>
          {step === questions.length - 1 ? 'Selesai' : 'Berikutnya →'}
        </Button>
      </div>
    </div>
  );
}

function QuizResult({ result, onRetry }) {
  const good = result.percent >= 70;
  return (
    <div className="space-y-5">
      <div
        className={cn(
          'rounded-card p-6 text-center text-white',
          good ? 'bg-brand-600' : 'bg-wood-700'
        )}
      >
        <div className="text-4xl">{good ? '🎉' : '💪'}</div>
        <h2 className="mt-2 text-2xl font-bold">
          Skor kamu: {result.correct}/{result.total}
        </h2>
        <p className="mt-1 text-white/85">
          {result.percent}% benar — {good ? 'Hebat!' : 'Ayo coba lagi!'}
        </p>
        <div className="mt-4">
          <Button variant="accent" onClick={onRetry}>
            ↻ Ulangi Kuis
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {result.details.map((d, i) => (
          <div
            key={d.id}
            className={cn(
              'card-surface border-l-4 p-4',
              d.isCorrect ? 'border-l-brand-500' : 'border-l-red-400'
            )}
          >
            <p className="text-sm font-semibold text-wood-900">
              {i + 1}. {d.question}
            </p>
            <p className="mt-2 text-sm">
              <span className={d.isCorrect ? 'text-brand-700' : 'text-red-600'}>
                {d.isCorrect ? '✓ Benar' : '✗ Kurang tepat'}
              </span>
              {!d.isCorrect && d.selected != null && (
                <span className="text-wood-500">
                  {' '}— jawabanmu: {d.options[d.selected]}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-wood-700">
              <span className="font-medium text-wood-900">
                Jawaban benar:
              </span>{' '}
              {d.options[d.answerIndex]}
            </p>
            {d.explanation && (
              <p className="mt-1 text-sm text-wood-600">{d.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
