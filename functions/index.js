const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const questions = require("./questions.json");
const { calculateReward, validateAnswer } = require("./rewards");

initializeApp();

function normalizeDisplayName(value) {
  if (value === undefined || value === null || value === "") {
    return "Player";
  }
  if (typeof value !== "string") {
    throw new HttpsError("invalid-argument", "Display name must be text.");
  }

  const displayName = value.trim();
  if (
    displayName.length === 0 ||
    [...displayName].length > 40 ||
    /[\u0000-\u001f\u007f]/u.test(displayName)
  ) {
    throw new HttpsError("invalid-argument", "Display name is invalid.");
  }
  return displayName;
}

exports.submitFerbingoAnswer = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in to earn rewards.");
  }

  const {
    skill,
    questionId,
    answer,
    displayName: requestedName,
  } = request.data || {};
  const validation = validateAnswer(questions, skill, questionId, answer);
  if (!validation.correct) {
    return { correct: false, awarded: false, ingotsAwarded: 0 };
  }

  const displayName = normalizeDisplayName(requestedName);
  const db = getFirestore();
  const scoreReference = db.collection("ferbingo_scores").doc(request.auth.uid);
  const leaderboardReference = db
    .collection("ferbingo_leaderboard")
    .doc(request.auth.uid);

  const reward = await db.runTransaction(async (transaction) => {
    const scoreSnapshot = await transaction.get(scoreReference);
    const nextReward = calculateReward(
      scoreSnapshot.data()?.completedQuestionIds,
      validation.question,
    );

    transaction.set(scoreReference, {
      completedQuestionIds: nextReward.completedQuestionIds,
      xp: nextReward.xp,
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.set(leaderboardReference, {
      displayName,
      xp: nextReward.xp,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return nextReward;
  });

  return {
    correct: true,
    awarded: reward.awarded,
    xp: reward.xp,
    ingotsAwarded: reward.ingotsAwarded,
  };
});
