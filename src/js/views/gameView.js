import View from "./View";

class GameView extends View{
  _parentElement = document.querySelector('.game-window');
  _generateMarkup() {
    return `
      <!-- ************************************** USER INFO PANEL ************************************** -->
      <div class="flex user-info--container">
        <!-- USERNAME -->
        <h3 class="usernameEl">${this._data.username}</h3>
        <!-- USER-QUIZ INFO -->
        <div class="flex game-info">
          <div class="flex user-info--difficulty-container">
            <p>Difficulty: </p>
            <p class="clr-accent">${this._data.preferences.difficulty}</p>
          </div>
          <div class="flex user-info--points-container">
            <p>Points: </p>
            <p class="clr-accent">${this._data.game.totalPoints}</p>
          </div>
        </div>
      </div>
      <!-- ******************* BONUS CONTAINER ******************* -->
      <div class="flex bonus-time--container">
        <!-- <h3>bonus</h3>
        <h3 class="clr-accent">x${this._data.game.timeBonusMultiplier}</h3> -->
      </div>
      <!-- ******************* QUESTION CONTAINER ******************* -->
      <div class="flex question--container">
        <h4 class="question-number--legend">${this._data.game.questionNum + 1}/${this._data.preferences.questionLimit}</h4>
        <h4 class="question-category--legend">${this._data.game.questions[this._data.game.questionNum].category}: ${this._data.game.questions[this._data.game.questionNum].difficulty}</h4>
        <!-- QUESTION -->
        <p class="flex">${this._data.game.questions[this._data.game.questionNum].question}</p>
      </div>
      <!-- ******************* ANSWERS CONTAINER ******************* -->
      <div class="flex answers--container">
        <button class="btn-answer">${this._data.game.questions[this._data.game.questionNum].answers[0]}</button>
        <button class="btn-answer">${this._data.game.questions[this._data.game.questionNum].answers[1]}</button>
        <button class="btn-answer">${this._data.game.questions[this._data.game.questionNum].answers[2]}</button>
        <button class="btn-answer">${this._data.game.questions[this._data.game.questionNum].answers[3]}</button>
      </div>
    `
  }

  renderTimeBonusMultiplier(multiplier){
    const timeBonusContainer = document.querySelector('.bonus-time--container')
    timeBonusContainer.innerHTML = `
      <h3>bonus</h3>
      <h3 class="clr-accent"t>x${multiplier}</h3>
    `;
  }

  addHandlerUserAnswer(handler) {
    this._clickHandler = (e) => {
      const element = e.target.closest('.btn-answer');
      if (!element) return;
      handler(element);
    };
  
    this._parentElement.addEventListener('click', this._clickHandler);
  }

  removeHandlerUserAnswer() {
    this._parentElement.removeEventListener('click', this._clickHandler);
  }  

  getUserAnswerText(userAnswerEl){
    const userAnswerText = userAnswerEl.firstChild?.nodeValue;
    if (!userAnswerText) return
    return userAnswerText;  
  }

  getCorrectAnswerEl(correctAnswerText) {
    const buttons = Array.from(this._parentElement.querySelectorAll(".btn-answer"));
    const correctAnswerEl = buttons.find(button => button.textContent === correctAnswerText);
    return correctAnswerEl;
  }  

  renderColorAnswer(answerIsCorrect, correctAnswerEl, userAnswerEl) {
    if (answerIsCorrect){
      userAnswerEl.classList.add('correctAnswer')
      this.playSound(this._data.files.audioFiles.correctAnswer)
    }else{
      userAnswerEl.classList.add('wrongAnswer')
      correctAnswerEl.classList.add('correctAnswer')
      this.playSound(this._data.files.audioFiles.wrongAnswer)
    }
  }

  renderPointsOnAnswer(points, userAnswerEl){
    userAnswerEl.insertAdjacentHTML('afterbegin', `<p class="answer-points move-up">+${points}</p>`)
  }
  
}
export default new GameView()