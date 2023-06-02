import * as model from './model.js';

import { createPrefURL } from './helper.js';

import { TIME_BONUS_INTERVAL, TIME_BONUS_MULTIPLIER } from './config.js';

import loadingView from './views/loadingView.js';
import welcomeView from './views/welcomeView.js';
import preferencesView from './views/preferencesView.js';
import gameView from './views/gameView.js';
import resultView from './views/resultView.js';

const controlLoadingFiles = async () => {
    const { audioFiles, imageFiles } = model.state.files;
    const audioFilesArray = Object.values(audioFiles);
    const imageFilesArray = Object.values(imageFiles);
    const files = [...audioFilesArray, ...imageFilesArray];
    const totalFiles = files.length;
  
    // Calculate the loading percentage
    for (const [index, file] of files.entries()) {
      const fileType = audioFilesArray.includes(file) ? "audio" : "image";
      await model.loadFile(fileType, file, index + 1);
  
      const percentage = Math.floor(((index + 1) / totalFiles) * 100);
      loadingView.updateProgress(percentage);
    }
    console.log("All files are loaded");
    setTimeout(controlStartApp, 1500)    
};
  
  
const controlStartApp = function() {
    loadingView.hideWindow();
    welcomeView.showWindow();
    welcomeView.renderData(model.getStateData())
    welcomeView.playSound(model.state.files.audioFiles.welcome);
    welcomeView.startHandlers(controlUsername, controlFromWelcomeToPreferences);
}
  
const controlUsername = function(username) {
    model.setUsername(username);
    console.log('Username setted:', model.state.username);
    // Rendering username in the WelcomeView Message
    welcomeView.renderUsername(username)
}

const controlFromWelcomeToPreferences = function(){
    welcomeView.renderSpinner()
    setTimeout(() => {
        welcomeView.removeSpinner()
        welcomeView.hideWindow();
        controlGoToPreferencesWindow()
    }, 500);
}

const controlGoToPreferencesWindow = function(){
    preferencesView.showWindow();
    preferencesView.renderData(model.getStateData());
    //Init preferences view handlers on click events f(HANDLER1:backToWelcomeBtn, HANDLER2:startQuizBtn)
    preferencesView.startHandlers(controlFromPreferencesToWelcome, controlStartQuiz);
}

const controlFromPreferencesToWelcome = function(){
    preferencesView.hideWindow();
    controlUserPreferences();
    welcomeView.showWindow();
}

const controlUserPreferences = function(){
    const preferencesObj = preferencesView.getUserPreferences();
    if (!preferencesObj) return
    model.setUserPreferences(preferencesObj);
    console.log('Preferences object created:', model.state.preferences);
    return preferencesObj
}

const generateUrlString = function(){
    const preferenceObject = controlUserPreferences();
    const preferencesString = createPrefURL(preferenceObject);
    if (!preferencesString) return
    console.log('Preferences string/url generated:',preferencesString)
    return preferencesString
}

const controlStartQuiz = async function(){
    preferencesView.removeHandlerStartQuizBtn();
    try {
        preferencesView.renderSpinner()
        //Load old records
        model.loadRecords()
        console.log('Records loaded');
        const urlString = generateUrlString()
        //Load quiz data from API
        await model.loadQuiz(urlString)
        console.log('Game Loaded: ', model.getStateData());
        controlRenderFirstQuestion()
    } catch (err) {
        console.error(`☠️We have this error with loading data: ${err} 🧘`);
        preferencesView.removeSpinner()
        preferencesView.renderError()
        preferencesView.restartHandlers(controlStartQuiz);
    }
}

const controlRenderFirstQuestion = function(){
    setTimeout(() => {
        //Hiding Welcome window
        preferencesView.hideWindow();
        //Setting starting time
        controlStartingTime();
        //Render First Question
        controlRenderQuestion();
    }, 1000)
}

const controlStartingTime = function(){
    // Set starting time
    const startingTime = new Date()
    if(!startingTime) return
    model.setStartingTime(startingTime)
    console.log('Timer started at:', startingTime);
}

const controlRenderQuestion = function(){
    // Get game data
    const gameData = model.getStateData()
    gameView.playSound(model.state.files.audioFiles.changeQuestion);
    // Render game data
    gameView.renderData(gameData)
    // Starting time bonus
    controlTimeBonusMultiplier()
    console.log('Question rendered');
    // Handler on answer event
    gameView.addHandlerUserAnswer(controlAnswer);
}


const controlTimeBonusMultiplier = function() {
    // Set time bonus multiplier to 3(TIME_BONUS_MULTIPLIER)
    let timeBonusMultiplier = TIME_BONUS_MULTIPLIER;
    // Set interval to 5sec(TIME_BONUS_INTERVAL)
    const interval = TIME_BONUS_INTERVAL;
    // Set time bonus multiplier to model.state.game.timeBonusMultiplier
    model.setTimeBonusMultiplier(timeBonusMultiplier)
    // Render time bonus multiplier
    gameView.renderTimeBonusMultiplier(timeBonusMultiplier)    
    // Decrement the time bonus multiplier by one every 5sec interval
    const decrementTimeBonus = setInterval(function() {
        if (timeBonusMultiplier > 1) {
            timeBonusMultiplier--
            // If the value of timeBonusMultiplier is greater than 0, render the new value
            gameView.renderTimeBonusMultiplier(timeBonusMultiplier);
        } else{
            // If the value is 0, stop this interval
            clearInterval(decrementTimeBonus)
        }
    }, interval);
  
    //Stop decrementing the time bonus multiplier when the user answer the question 
    gameView.addHandlerUserAnswer(()=> {
        clearInterval(decrementTimeBonus);
        // Set time bonus multiplier to model.state.game.timeBonusMultiplier when user answer the question
        model.setTimeBonusMultiplier(timeBonusMultiplier)
    });
};
  
const controlAnswer = function(userAnswerEl){
    gameView.removeHandlerUserAnswer()
    // Get the question number
    const questionNum = model.getQuestionNum()
    // Get the correct answer text
    const correctAnswerText = model.getCorrectAnswerText(questionNum)
    // Get the user answer text
    const userAnswerText = gameView.getUserAnswerText(userAnswerEl)
    // Set the user answer text
    model.setUserAnswerText(userAnswerText)
    // Get the correct answer "button" element 
    const correctAnswerEl = gameView.getCorrectAnswerEl(correctAnswerText)
    //Checking answer
    const answerIsCorrect = checkAnswer(correctAnswerText, userAnswerText)
    //Incrementing points if answer is correct
    controlPoints(answerIsCorrect, questionNum, userAnswerEl)
    //Rendering colors green for correct answer and red for wrong answer
    gameView.renderColorAnswer(answerIsCorrect, correctAnswerEl, userAnswerEl)
    controlNextQuestion()
}

const controlPoints = function(answerIsCorrect, questionNum, userAnswerEl){
    // Ottiene il multiplo di punteggio per il tempo
    const timeBonusMultiplier = model.getTimeBonusMultiplier()
    // Ottiene il livello di difficoltà della domanda
    const questionDifficulty = model.getQuestionDifficulty(questionNum)
    // Ottiene il motiplicatore di difficoltà
    const difficultyBonusMultiplier = model.getDifficultyBonusMultiplier(questionDifficulty)
    // Incrementa i punti nell'oggetto state
    if (answerIsCorrect){
        const points = timeBonusMultiplier * difficultyBonusMultiplier
        gameView.renderPointsOnAnswer(points, userAnswerEl)
        // Incrementa i punti nell'oggetto state
        model.setTotalPoints(points)
        console.log('Points incremented: +', points, 'Total points:', model.state.game.totalPoints)
    }        
}

const checkAnswer = function (correctAnswerText, userAnswerText){
    let answerIsCorrect = false;
    if (userAnswerText === correctAnswerText){
      console.log(`"${userAnswerText}" is the correct answer 👌`);
      answerIsCorrect = true
      model.incrementCorrectAnswers()
    } else{
      console.log(`"${userAnswerText}" is the wrong answer 💩`);
      answerIsCorrect = false
    }
    setTimeout(()=>{
        gameView.renderSpinner()
    }, 800)
    return answerIsCorrect
}

const controlNextQuestion = function (){
    model.resetUserAnswerText()
    model.incrementQuestionNum()
    const currentQuestionNum = model.getQuestionNum()  
    if (currentQuestionNum < model.state.preferences.questionLimit)  
    setTimeout(()=>{
        controlRenderQuestion()
    }, 1600)
    else {
        setTimeout(()=>{
            resultView.playSound(model.state.files.audioFiles.gameOver)
            console.log('Questions are over');
            controlCompletingTime();
            model.setNewRecord()
            console.log('One more record:', model.state.records);
            gameView.hideWindow()
            resultView.showWindow()
            resultView.renderData(model.state)
            //Init result view handlers on click events f(HANDLER1:deleteRecordBtn, HANDLER2:restartQuizBtn)
            resultView.startHandlers(controlDeleteRecords, controlRestart)
            console.log('Result rendered');
        }, 1600)
    }
}

const controlCompletingTime = function(){    
    const currentTime = new Date();
    const startingTime = model.getStartingTime();
    const completingTime = currentTime - startingTime;
    const completingSeconds = Math.floor(completingTime / 1000);
    model.setCompletingTime(completingSeconds)
    console.log('setCompletingTime', completingTime);
}

const controlDeleteRecords = function(){
    model.deleteRecords()
    setTimeout(()=>{
        resultView.renderData(model.getStateData())
        resultView.playSound(model.state.files.audioFiles.deleteRecord)
        resultView.addHandlerRestartBtn(controlRestart)
    }, 800)
}

const controlRestart = function(){
    resultView.renderSpinner()
    setTimeout(()=>{
        resultView.playSound(model.state.files.audioFiles.restart)
        model.resetQuizData()
        console.log('Data reseted');
        resultView.hideWindow()
        // Restarting from preferencesView
        controlGoToPreferencesWindow()
    }, 500)
}

const init = function () {
    setTimeout(controlLoadingFiles, 3000)
  }

init();

// ROADMAP 🗺️

// BUGS TO FIX 🐛
// Blob checkbox ONOFF scrolla fino alla base della pagina
// ALla prima renderizzazione del spinner sminchia l'immagine
// Gli handlers della welcomeView vanno ricontrollati

// FEATURES TO ADD 🛠️
// errors handling (implementato in loadgame per mancata connessione. Gli altri errori ancora non so quali possano essere)

// LAST STEP 👟
// Mettere i commenti

// APP IS OVER! 🥳🥳🥳
// Fare un file txt con le spiegazioni dell'app e metterlo su gitHub


//FOR THE FUTURE 🚀
// Aggiungere la lingua italiana
// Creare la sessione utente con annesso database (firebase). Possibilità di vedere i risultati globali
