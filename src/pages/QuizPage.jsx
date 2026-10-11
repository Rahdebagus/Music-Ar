import { useMemo } from 'react';
import { QuizRunner } from '@/features/quiz/QuizRunner.jsx';
import { getQuiz, getLastScore } from '@/features/quiz/quizService.js';

export function QuizPage() {
  const quiz = getQuiz();
  const last = useMemo(() => getLastScore(), []);

  return (
    <div className="container-page py-4">
      <header className="mb-5 text-center">
        <p className="mx-auto max-w-xl text-sm text-wood-600">
          {quiz.description}
        </p>
        {last && (
          <p className="mt-3 inline-block rounded-full bg-wood-100 px-4 py-1 text-xs font-medium text-wood-700">
            Skor terakhir: {last.correct}/{last.total} ({last.percent}%)
          </p>
        )}
      </header>

      <QuizRunner />
    </div>
  );
}
