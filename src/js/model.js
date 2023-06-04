import { API_URL, DIFFICULTY_BONUS_MULTIPLIER_OBJ } from "./config";
import spinnerIcon from "url:../img/favicon.png";
import blobBtnAudio from "url:../audio/blobBtn.mp3";
import closeBtnAudio from "url:../audio/closeBtn.mp3";
import correctAnswerAudio from "url:../audio/correctAnswer.mp3";
import correctUsernameAudio from "url:../audio/correctUsername.mp3";
import deleteRecordAudio from "url:../audio/deleteRecord.mp3";
import emptyUsernameAudio from "url:../audio/emptyUsername.mp3";
import gameOverAudio from "url:../audio/gameOver.mp3";
import navBtnsAudio from "url:../audio/navBtns.mp3";
import preferencesBtnsAudio from "url:../audio/preferencesBtns.mp3";
import restartAudio from "url:../audio/restart.mp3";
import startQuizAudio from "url:../audio/startQuiz.mp3";
import wrongAnswerAudio from "url:../audio/wrongAnswer.mp3";
import changeQuestionAudio from "url:../audio/changeQuestion.mp3";
import welcomeAudio from "url:../audio/welcome.mp3";

export const state = {
  username: "",
  preferences: {
    questionLimit: 0,
    difficulty: "",
    categories: ""
  },
  game: {
    questionsData: [],
    answers: [],
    questionNum: 0,
    correctAnswers: 0,
    totalPoints: 0,
    startingTime: 0,
    completingTime: 0,
    difficultyBonusMultiplier: DIFFICULTY_BONUS_MULTIPLIER_OBJ
  },
  records: [],
};

export const files = {
  audioFiles: {
    blobBtnAudio,
    closeBtnAudio,
    correctAnswerAudio,
    correctUsernameAudio,
    deleteRecordAudio,
    emptyUsernameAudio,
    gameOverAudio,
    navBtnsAudio,
    preferencesBtnsAudio,
    restartAudio,
    startQuizAudio,
    wrongAnswerAudio,
    changeQuestionAudio,
    welcomeAudio
  },
  imageFiles: {
    spinnerIcon
  },
};

export const loadQuiz = async function (userChoiceString) {
  try {
    const res = await fetch(API_URL + userChoiceString);
    const data = await res.json();
    state.game.questionsData = data.map((questionObj) => {
      return {
        category: questionObj.category,
        difficulty: questionObj.difficulty,
        question: questionObj.question,
        correctAnswer: questionObj.correctAnswer,
        wrongAnswers: [...questionObj.incorrectAnswers],
        tags: questionObj.tags
      };
    });
  } catch (err) {
    throw err;
  }
};

export const loadFile = async function (fileType, file, index) {
  return new Promise((resolve) => {
    const element = fileType === "audio" ? new Audio() : new Image();
    element.onload = element.oncanplaythrough = () => {
      resolve(index); // Return loaded file index
    };
    element.src = file;
  });
};

export const getStateData = () => state;

export const getFiles = () => files;

export const setUsername = (username) => (state.username = username);

export const setUserPreferences = function (preferencesObj) {
  state.preferences.difficulty = preferencesObj.difficulty;
  state.preferences.categories = preferencesObj.categories;
  state.preferences.questionLimit = preferencesObj.questionLimit;
};

export const getTimeBonusMultiplier = () => state.game.timeBonusMultiplier;

export const setTimeBonusMultiplier = (multiplier) =>
  (state.game.timeBonusMultiplier = multiplier);

export const getQuestionDifficulty = (questionNumber) =>
  state.game.questionsData[questionNumber].difficulty;

export const getDifficultyBonusMultiplier = (difficulty) =>
  state.game.difficultyBonusMultiplier[difficulty];

export const incrementQuestionNum = () => state.game.questionNum++;

export const getQuestionNum = () => state.game.questionNum;

export const getBasePoints = () => state.game.basePoints;

export const incrementCorrectAnswers = () => state.game.correctAnswers++;

export const getTotalPoints = () => state.game.totalPoints;

export const setTotalPoints = (points) => (state.game.totalPoints += points);

export const setStartingTime = (startingTime) =>
  (state.game.startingTime = startingTime);

export const getStartingTime = () => state.game.startingTime;

export const setCompletingTime = (completingTime) =>
  (state.game.completingTime = completingTime);

export const resetGameData = function () {
  state.game.questionNum = 0;
  state.game.totalPoints = 0;
  state.game.startingTime = 0;
  state.game.completingTime = 0;
};

export const setNewRecord = function () {
  const newRecordObj = {
    username: state.username,
    difficulty: state.preferences.difficulty,
    questionLimit: state.preferences.questionLimit,
    categories: state.preferences.categories,
    startingTime: state.game.startingTime,
    completingTime: state.game.completingTime,
    points: state.game.totalPoints,
    correctAnswers: state.game.correctAnswers
  };
  state.records.push(newRecordObj);
  localStorage.setItem("recordObj", JSON.stringify(state.records));
};

export const loadRecords = function () {
  state.records = JSON.parse(localStorage.getItem("recordObj")) || [];
};

export const deleteRecords = function () {
  state.records = [];
  localStorage.clear();
};

export const resetQuizData = function () {
  state.game.totalPoints = 0;
  state.game.startingTime = 0;
  state.game.completingTime = 0;
  state.game.questionNum = 0;
  state.game.correctAnswers = 0;
};
