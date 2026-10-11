import quiz from '@/data/quiz.json';

const SCORE_KEY = 'ar-music:quizScore';

export function getQuiz() {
  return quiz;
}

export function getQuestions() {
  return quiz.questions || [];
}

/** Compute score from an answers map { [questionId]: selectedIndex }. */
export function scoreQuiz(answers) {
  const questions = getQuestions();
  let correct = 0;
  const details = questions.map((q) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.answerIndex;
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      selected,
      answerIndex: q.answerIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });
  return {
    correct,
    total: questions.length,
    percent: questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0,
    details,
  };
}

export function saveLastScore(result) {
  try {
    localStorage.setItem(
      SCORE_KEY,
      JSON.stringify({
        correct: result.correct,
        total: result.total,
        percent: result.percent,
        at: Date.now(),
      })
    );
  } catch {
    /* ignore */
  }
}

export function getLastScore() {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
