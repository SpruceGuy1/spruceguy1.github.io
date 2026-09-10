function findAnswerableQuestion(questions, skill, questionId) {
  if (typeof skill !== "string" || typeof questionId !== "string") {
    return null;
  }

  const skillQuestions = Object.hasOwn(questions, skill)
    ? questions[skill]
    : null;
  if (!Array.isArray(skillQuestions)) {
    return null;
  }

  return (
    skillQuestions.find(
      (question) => question.id === questionId && question.rega,
    ) || null
  );
}

function validateAnswer(questions, skill, questionId, answer) {
  const question = findAnswerableQuestion(questions, skill, questionId);
  if (!question || typeof answer !== "string" || answer.length > 500) {
    return { correct: false, question: null };
  }

  const pattern = new RegExp(question.rega, question.flags);
  return { correct: pattern.test(answer), question };
}

function calculateReward(completedQuestionIds, question) {
  const completed = new Set(
    Array.isArray(completedQuestionIds) ? completedQuestionIds : [],
  );
  const awarded = !completed.has(question.id);
  completed.add(question.id);

  return {
    awarded,
    completedQuestionIds: [...completed],
    xp: completed.size,
    ingotsAwarded: awarded ? question.special?.ingots || 1 : 0,
  };
}

module.exports = { calculateReward, validateAnswer };
