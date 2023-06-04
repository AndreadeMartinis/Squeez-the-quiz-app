import { firstLetterUppercase } from "../helper";
import View from "./View";

class GameView extends View {
  _parentElement = document.querySelector(".game-window");
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
            <p class="total-points">${this._data.game.totalPoints}</p>
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
        <h4 class="question-category--legend">${this._data.game.questionsData[this._data.game.questionNum].category}: ${this._data.game.questionsData[this._data.game.questionNum].difficulty}</h4>
        <!-- QUESTION -->
        <p class="flex">${this._data.game.questionsData[this._data.game.questionNum].question}</p>
      </div>
      <!-- ******************* ANSWERS CONTAINER ******************* -->
      <div class="flex answers--container"></div>
    `;
  }

  renderTimeBonusMultiplier(multiplier) {
    const timeBonusContainer = document.querySelector(".bonus-time--container");
    timeBonusContainer.innerHTML = `
      <h3>bonus</h3>
      <h3 class="clr-accent"t>x${multiplier}</h3>
      `;
  }

  // Generete a markup where one answer will be with data-is-correct=true attribute, and others will not have any attribut
  generateAnswerMarkup(isCorrect, text) {
    return `
      <button class='btn-answer' ${isCorrect ? "data-is-correct=true" : ""}>${firstLetterUppercase(text)}</button>
    `;
  }

  renderAnswers(answersMarkup) {
    const answersContainer = this._parentElement.querySelector(".answers--container");
    answersContainer.innerHTML = "";
    answersMarkup.forEach((markup) => {
      answersContainer.insertAdjacentHTML("beforeend", markup);
    });
  }

  addHandlerUserAnswer(handler) {
    this._clickHandler = (e) => {
      const element = e.target.closest(".btn-answer");
      if (!element) return;
      this.userAnswerEl = element;
      handler();
    };

    this._parentElement.addEventListener("click", this._clickHandler);
  }

  removeHandlerUserAnswer() {
    this._parentElement.removeEventListener("click", this._clickHandler);
  }

  checkAnswer() {
    const isCorrect = this.userAnswerEl.getAttribute("data-is-correct") === "true";
    this.answerIsCorrect = isCorrect;
    this.correctAnswerEl = this._parentElement.querySelector(`[data-is-correct='true']`);
  }

  renderColorAnswer() {
    if (this.answerIsCorrect) {
      this.userAnswerEl.classList.add("correctAnswer");
      this.playSound(this._files.audioFiles.correctAnswerAudio);
    } else {
      this.userAnswerEl.classList.add("wrongAnswer");
      this.correctAnswerEl.classList.add("correctAnswer");
      this.playSound(this._files.audioFiles.wrongAnswerAudio);
    }
  }

  renderPointsOnAnswer(points) {
    this.userAnswerEl.insertAdjacentHTML("afterbegin",`<p class="answer-points move-up">+${points}</p>`);
  }
}
export default new GameView();
