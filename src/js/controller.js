import * as model from "./model.js";

import { createPrefURL, shuffleArr } from "./helper.js";

import { TIME_BONUS_INTERVAL, TIME_BONUS_MULTIPLIER } from "./config.js";

import loadingView from "./views/loadingView.js";
import welcomeView from "./views/welcomeView.js";
import preferencesView from "./views/preferencesView.js";
import gameView from "./views/gameView.js";
import resultView from "./views/resultView.js";

const controlStartApp = function () {
  loadingView.hideWindow();
  welcomeView.showWindow();
  welcomeView.renderData(model.getStateData(), model.getFiles());
  welcomeView.playSound(model.files.audioFiles.welcomeAudio);
  welcomeView.startHandlers(controlUsername, controlFromWelcomeToPreferences);
};

const controlUsername = function (username) {
  model.setUsername(username);
  console.log("Username setted:", model.state.username);
  // Rendering username in the WelcomeView Message
  welcomeView.renderUsername(username);
};

const controlFromWelcomeToPreferences = function () {
  welcomeView.renderSpinner();
  setTimeout(() => {
    welcomeView.removeSpinner();
    welcomeView.hideWindow();
    controlGoToPreferencesWindow();
  }, 500);
};

const controlGoToPreferencesWindow = function () {
  preferencesView.showWindow();
  preferencesView.renderData(model.getStateData(), model.getFiles());
  //Init preferences view handlers on click events f(HANDLER1:backToWelcomeBtn, HANDLER2:startQuizBtn)
  preferencesView.startHandlers(
    controlFromPreferencesToWelcome,
    controlStartQuiz
  );
};

const controlFromPreferencesToWelcome = function () {
  preferencesView.hideWindow();
  controlUserPreferences();
  welcomeView.showWindow();
};

const controlUserPreferences = function () {
  const preferencesObj = preferencesView.getUserPreferences();
  if (!preferencesObj) return;
  model.setUserPreferences(preferencesObj);
  console.log("Preferences object created:", model.state.preferences);
  return preferencesObj;
};

const generateUrlString = function () {
  const preferenceObject = controlUserPreferences();
  const preferencesString = createPrefURL(preferenceObject);
  if (!preferencesString) return;
  console.log("Preferences string/url generated:", preferencesString);
  return preferencesString;
};

const controlStartQuiz = async function () {
  preferencesView.removeHandlerStartQuizBtn();
  try {
    preferencesView.renderSpinner();
    //Load old records
    model.loadRecords();
    console.log("Records loaded");
    const urlString = generateUrlString();
    //Load quiz data from API
    await model.loadQuiz(urlString);
    console.log("Game Loaded: ", model.getStateData());
    controlRenderFirstQuestion();
  } catch (err) {
    console.error(`☠️We have this error with loading data: ${err} 🧘`);
    preferencesView.removeSpinner();
    preferencesView.renderError();
    preferencesView.restartHandlers(controlStartQuiz);
  }
};

const controlRenderFirstQuestion = function () {
  setTimeout(() => {
    //Hiding Welcome window
    preferencesView.hideWindow();
    //Setting starting time
    controlStartingTime();
    //Render First Question
    controlRenderQuestion();
  }, 1000);
};

const controlStartingTime = function () {
  // Set starting time
  const startingTime = new Date();
  if (!startingTime) return;
  model.setStartingTime(startingTime);
  console.log("Timer started at:", startingTime);
};

const controlRenderQuestion = function () {
  gameView.playSound(model.files.audioFiles.changeQuestionAudio);
  // Render game data
  gameView.renderData(model.getStateData(), model.getFiles());
  controlRenderAnswers();
  // Starting time bonus
  controlTimeBonusMultiplier();
  console.log("Question rendered");
  // Handler on answer event
  gameView.addHandlerUserAnswer(controlAnswer);
};

const controlRenderAnswers = function () {
  const questionNum = model.getQuestionNum();
  const correctAnswerText =
    model.state.game.questionsData[questionNum].correctAnswer;
  const wrongAnswersText = [...model.state.game.questionsData[questionNum].wrongAnswers,];
  const correctMarkup = gameView.generateAnswerMarkup(true, correctAnswerText);
  const wrongMarkups = wrongAnswersText.map((wrongAnswerText) =>
    gameView.generateAnswerMarkup(false, wrongAnswerText)
  );
  // Shuffle the wrong answers
  const answersMarkup = shuffleArr([correctMarkup, ...wrongMarkups]);
  gameView.renderAnswers(answersMarkup);
};

const controlTimeBonusMultiplier = function () {
  // Set time bonus multiplier to 3(TIME_BONUS_MULTIPLIER)
  let timeBonusMultiplier = TIME_BONUS_MULTIPLIER;
  // Set interval to 5sec(TIME_BONUS_INTERVAL)
  const interval = TIME_BONUS_INTERVAL;
  // Set time bonus multiplier to model.state.game.timeBonusMultiplier
  model.setTimeBonusMultiplier(timeBonusMultiplier);
  // Render time bonus multiplier
  gameView.renderTimeBonusMultiplier(timeBonusMultiplier);
  // Decrement the time bonus multiplier by one every 5sec interval
  const decrementTimeBonus = setInterval(function () {
    if (timeBonusMultiplier > 1) {
      timeBonusMultiplier--;
      // If the value of timeBonusMultiplier is greater than 0, render the new value
      gameView.renderTimeBonusMultiplier(timeBonusMultiplier);
    } else {
      // If the value is 0, stop this interval
      clearInterval(decrementTimeBonus);
    }
  }, interval);

  //Stop decrementing the time bonus multiplier when the user answer the question
  gameView.addHandlerUserAnswer(() => {
    clearInterval(decrementTimeBonus);
    // Set time bonus multiplier to model.state.game.timeBonusMultiplier when user answer the question
    model.setTimeBonusMultiplier(timeBonusMultiplier);
  });
};

const controlAnswer = function () {
  const questionNum = model.getQuestionNum();
  gameView.removeHandlerUserAnswer();
  gameView.checkAnswer();
  gameView.renderColorAnswer();
  //Controlling points if answer is correct
  if (gameView.answerIsCorrect) {
    controlPoints(questionNum);
    model.incrementCorrectAnswers();
  }
  setTimeout(() => {
    gameView.renderSpinner();
  }, 800);
  controlNextQuestion();
};

const controlPoints = function (questionNum) {
  const timeBonusMultiplier = model.getTimeBonusMultiplier();
  const questionDifficulty = model.getQuestionDifficulty(questionNum);
  const difficultyBonusMultiplier = model.getDifficultyBonusMultiplier(questionDifficulty);
  const points = timeBonusMultiplier * difficultyBonusMultiplier;
  gameView.renderPointsOnAnswer(points);
  // Incrementa i punti nell'oggetto state
  model.setTotalPoints(points);
  console.log("Points incremented: +", points, "Total points:", model.state.game.totalPoints);
};

const controlNextQuestion = function () {
  model.incrementQuestionNum();
  const currentQuestionNum = model.getQuestionNum();
  if (currentQuestionNum < model.state.preferences.questionLimit)
    setTimeout(controlRenderQuestion, 1600);
  else {
    setTimeout(() => {
      resultView.playSound(model.files.audioFiles.gameOverAudio);
      console.log("Questions are over");
      controlCompletingTime();
      model.setNewRecord();
      console.log("One more record:", model.state.records);
      gameView.hideWindow();
      resultView.showWindow();
      resultView.renderData(model.getStateData(), model.getFiles());
      //Init result view handlers on click events f(HANDLER1:deleteRecordBtn, HANDLER2:restartQuizBtn)
      resultView.startHandlers(controlDeleteRecords, controlRestart);
      console.log("Result rendered");
    }, 1600);
  }
};

const controlCompletingTime = function () {
  const currentTime = new Date();
  const startingTime = model.getStartingTime();
  const completingTime = currentTime - startingTime;
  const completingSeconds = Math.floor(completingTime / 1000);
  model.setCompletingTime(completingSeconds);
  console.log("setCompletingTime", completingTime);
};

const controlDeleteRecords = function () {
  model.deleteRecords();
  setTimeout(() => {
    resultView.renderData(model.getStateData(), model.getFiles());
    resultView.playSound(model.files.audioFiles.deleteRecordAudio);
    resultView.addHandlerRestartBtn(controlRestart);
  }, 800);
};

const controlRestart = function () {
  resultView.renderSpinner();
  setTimeout(() => {
    resultView.playSound(model.files.audioFiles.restartAudio);
    model.resetQuizData();
    console.log("Data reseted");
    resultView.hideWindow();
    // Restarting from preferencesView
    controlGoToPreferencesWindow();
  }, 500);
};

const init = (function () {
  loadingView.renderData(model.getStateData(), model.getFiles());
  loadingView.startHandlers();
  setTimeout(()=>{
    // Simulates a file loading before starting the app
    loadingView.simulateLoading()
    setTimeout(controlStartApp, 2500)
  }, 3000);
})();

// ROADMAP 🗺️

// BUGS TO FIX 🐛
// Blob checkbox ONOFF scrolla fino alla base della pagina
// Alla prima renderizzazione del spinner sminchia l'immagine

// FEATURES TO ADD 🛠️
// errors handling (implementato in loadgame per mancata connessione. Gli altri errori ancora non so quali possano essere)

// APP IS OVER! 🥳🥳🥳

//FOR THE FUTURE 🚀
// Aggiungere la lingua italiana
// Creare la sessione utente con annesso database (firebase). Possibilità di vedere i risultati globali
