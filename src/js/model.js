import { shuffleArr, firstLetterUppercase } from "./helper"
import { API_URL, DIFFICULTY_BONUS_MULTIPLIER_OBJ } from "./config"
import favicon from  "url:../img/favicon.png"
import css3 from  "url:../img/css3.png"
import html5 from  "url:../img/html5.png"
import javascript from  "url:../img/javascript.png"
import github from  "url:../img/github.png"
import blobBtn from  "url:../audio/blobBtn.mp3"
import closeBtn from  "url:../audio/closeBtn.mp3"
import correctAnswer from  "url:../audio/correctAnswer.mp3"
import correctUsername from  "url:../audio/correctUsername.mp3"
import deleteRecord from  "url:../audio/deleteRecord.mp3"
import emptyUsername from  "url:../audio/emptyUsername.mp3"
import gameOver from  "url:../audio/gameOver.mp3"
import navBtns from  "url:../audio/navBtns.mp3"
import preferencesBtns from  "url:../audio/preferencesBtns.mp3"
import restart from  "url:../audio/restart.mp3"
import startQuiz from  "url:../audio/startQuiz.mp3"
import wrongAnswer from  "url:../audio/wrongAnswer.mp3"
import changeQuestion from  "url:../audio/changeQuestion.mp3"
import welcome from  "url:../audio/welcome.mp3"

export const state = {
    username: "",
    preferences: {
        questionLimit: 0,
        difficulty: '',
        categories: '',
    },
    game: {
        questions: [],
        questionNum: 0,
        correctAnswers: 0,
        totalPoints: 0,
        startingTime: 0,
        completingTime : 0,
        userAnswer: null,
        difficultyBonusMultiplier: DIFFICULTY_BONUS_MULTIPLIER_OBJ,
    },
    records: [],
    files: {
      audioFiles: {
        blobBtn,
        closeBtn,
        correctAnswer,
        correctUsername,
        deleteRecord,
        emptyUsername,
        gameOver,
        navBtns,
        preferencesBtns,
        restart,
        startQuiz,
        wrongAnswer,
        changeQuestion,
        welcome,
      },
      imageFiles: {
        favicon,
        css3,
        html5,
        javascript,
        github,
      },
      loadedFiles: 0,
      totalFiles: 0,
    }
}

export const loadQuiz = async function(userChoiceString) {
  try {
    const res = await fetch(API_URL + userChoiceString);
    const data = await res.json();
    state.game.questions = data.map(questionObj => {
      return {
        category: questionObj.category,
        difficulty: questionObj.difficulty,
        question: firstLetterUppercase(questionObj.question),
        answers: shuffleArr(
          [questionObj.correctAnswer, ...questionObj.incorrectAnswers].map(answer =>
            firstLetterUppercase(answer)
            )
        ),
        correctAnswer: firstLetterUppercase(questionObj.correctAnswer),
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

export const getStateData = () => state

export const setUsername = (username) => state.username = username;

export const setUserPreferences = function(preferencesObj) {
    state.preferences.difficulty = preferencesObj.difficulty;
    state.preferences.categories = preferencesObj.categories;
    state.preferences.questionLimit = preferencesObj.questionLimit;
}

export const getTimeBonusMultiplier = () => state.game.timeBonusMultiplier

export const setTimeBonusMultiplier = (multiplier) => state.game.timeBonusMultiplier = multiplier

export const getQuestionDifficulty = (questionNumber) => state.game.questions[questionNumber].difficulty;

export const getDifficultyBonusMultiplier = (difficulty) => state.game.difficultyBonusMultiplier[difficulty]

export const getUserAnswerText = () => state.game.userAnswer;

export const setUserAnswerText = (userAnswer) => state.game.userAnswer = userAnswer;

export const resetUserAnswerText = () => state.game.userAnswer = null;

export const incrementQuestionNum = () => state.game.questionNum++;

export const getQuestionNum = () => state.game.questionNum

export const getCorrectAnswerText = (questionNumber) => state.game.questions[questionNumber].correctAnswer;

export const getBasePoints = () => state.game.basePoints;

export const incrementCorrectAnswers = () => state.game.correctAnswers++;

export const getTotalPoints = ()=> state.game.totalPoints

export const setTotalPoints = (points) => state.game.totalPoints += points;

export const setStartingTime = (startingTime) => state.game.startingTime = startingTime

export const getStartingTime = () => state.game.startingTime

export const setCompletingTime = (completingTime) => state.game.completingTime = completingTime

export const resetGameData = function(){
    state.game.questionNum = 0;
    state.game.totalPoints = 0;
    state.game.startingTime = 0;
    state.game.completingTime = 0;
}

export const setNewRecord = function() {
    const newRecordObj = {    
        username: state.username,
        difficulty: state.preferences.difficulty,
        questionLimit: state.preferences.questionLimit,
        categories: state.preferences.categories,
        startingTime: state.game.startingTime,
        completingTime: state.game.completingTime,
        points: state.game.totalPoints,
        correctAnswers: state.game.correctAnswers,
    }
    state.records.push(newRecordObj)
    localStorage.setItem("recordObj", JSON.stringify(state.records));
}

export const loadRecords = function(){
    state.records = JSON.parse(localStorage.getItem("recordObj")) || [];
}

export const deleteRecords = function(){
    state.records = []
    localStorage.clear();
}

export const resetQuizData = function(){
    state.game.totalPoints = 0;
    state.game.startingTime = 0;
    state.game.completingTime = 0;
    state.game.questionNum = 0;
    state.game.correctAnswers = 0;
}