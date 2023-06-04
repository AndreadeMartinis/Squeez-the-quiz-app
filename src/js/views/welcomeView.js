import View from "./View";

class WelcomeView extends View {
  _parentElement = document.querySelector(".welcome-window");

  hideWindow() {
    super.hideWindow();
    this.welcomeWindowMessage.classList.remove("fade-out");
    this.readyForQuizContainer.classList.remove("fade-out");
    this.usernameInputErrorMessage.classList.remove("fade-out");
    this.popupOverlayEl.classList.remove("fade-out-popup");
  }

  _generateMarkup() {
    return `
      <!-- H1 (appears after user clicks on "arrow" button) -->
      <div class="flex welcome-window--message opacity-zero">
        <h2>Hi <span class="username clr-primary"></span>...</h2>
        <h3>it's</h3>
        <h1><span class="clr-accent">Squeez</span> time!</h1>
      </div>
      <!-- ******************* USERNAME FORM ******************* -->
      <form class="flex username-form fade-in">
        <div class="username-input--error-message opacity-zero"></div>
        <label for="username">My friends call me</label>
        <input type="text" id="username" name="username" maxlength="16" autocomplete="off" autofocus>
        <button class="arrow-right-btn" type="submit">&#x203A;</button>
      </form>
      <!-- NAVIGATION BUTTONS (1.toPreferences 2.Quiz Rules Pop-up) -->        
      <div class="readyForQuiz--container opacity-zero">
        <h2>Ready for a <span class="clr-primary">quiz</span> challenge?</h2>
        <div class="welcome-window--btns-container">
          <button class="btn-nav-toPreferences" type="button">Almost <span class="clr-accent">ready...</span></button>
          <div class="flex welcome-minibtns">
            <button class="btn-nav-changeUsername" type="button">Change <span class="clr-accent">username</span></button>
            <button class="btn-nav-showQuizRules" type="button">Tell me <span class="clr-accent">more</span></button>
          </div>
        </div>
      </div>
      <!-- QUIZ RULES POP UP -->
      <div class="quizRules-popup--overlay opacity-zero"></div>
    `;
  }

  _addHandlerUserInput() {
    this.usernameInput = document.querySelector("#username");
    this.usernameInputErrorMessage = document.querySelector(".username-input--error-message");
    this._clickHandler = () => {
      if (this.usernameInput.value.trim().length === 16) {
        this.usernameInputErrorMessage.innerHTML = `<p style="text-align:center; font-size:small">They won't have enough time to call you.<br>Max 16 chars</p>`;
        this._makeVisibile(this.usernameInputErrorMessage);
        this.playSound(this._files.audioFiles.emptyUsernameAudio);
      } else {
        this._makeInvisibile(this.usernameInputErrorMessage);
      }
    };

    this.usernameInput.addEventListener("input", this._clickHandler);
  }

  // BUTTON RIGHT ARROW (FOR USERNAME INPUT)
  _addHandlerArrowRightBtn(handler) {
    this.btnRightArrow = document.querySelector(".arrow-right-btn");

    this._clickHandler = (e) => {
      e.preventDefault();
      this.usernameForm = document.querySelector(".username-form");
      this.readyForQuizContainer = document.querySelector(".readyForQuiz--container");
      this.welcomeWindowMessage = document.querySelector(".welcome-window--message");

      if (this.usernameInput.value.trim() === "") {
        this.playSound(this._files.audioFiles.emptyUsernameAudio);
        this.usernameInputErrorMessage.innerHTML = `Don't you have friends?`;
        this._makeVisibile(this.usernameInputErrorMessage);
      } else {
        this.playSound(this._files.audioFiles.correctUsernameAudio);
        this._makeInvisibile(this.usernameInputErrorMessage);
        this._makeVisibile(this.readyForQuizContainer);
        this._makeVisibile(this.welcomeWindowMessage);
        this.usernameForm.classList.add("opacity-zero");
        this.usernameForm.classList.remove("fade-in");
        handler(this.usernameInput.value.trim());
      }
    };

    this.btnRightArrow.addEventListener("click", this._clickHandler);
  }

  renderUsername(username) {
    const usernameField = document.querySelector(".username");
    usernameField.innerHTML = username;
  }

  // BUTTON GO TO PREFERENCES (TEXT: ALMOST READY...)
  _addHandlerGoToPrefencesBtn(handler) {
    const goToPreferencesBtn = document.querySelector(".btn-nav-toPreferences");

    goToPreferencesBtn.addEventListener("click", () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      this._makeInvisibile(this.readyForQuizContainer);
      this._makeInvisibile(this.welcomeWindowMessage);
      this._makeVisibile(this.usernameForm);
      handler();
    });
  }

  // BUTTON CHANGE USERNAME (TEXT: CHANGE USERNAME)
  _addHandlerChangeUsernameBtn() {
    this.changeUsernameBtn = document.querySelector(".btn-nav-changeUsername");

    this.changeUsernameBtn.removeEventListener("click", this._clickHandler);

    this._clickHandler = () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      this._makeVisibile(this.usernameForm);
    };

    this.changeUsernameBtn.addEventListener("click", this._clickHandler);
  }

  // BUTTON SHOW QUIZ RULES POPUP (TEXT: TELL ME MORE)
  _addHandlerQuizRulesBtn() {
    this.popupOverlayEl = document.querySelector(".quizRules-popup--overlay");
    const triggerBtnEl = document.querySelector(".btn-nav-showQuizRules");
    const markup = `
      <div class="quizRules-popup--container">
        <button class="btn-close-popup">X</button>
        <h2>Rules Suck</h2>
        <h3>Difficulty and categories:</h3>
        <p> Users can choose from three difficulty levels (easy, medium, hard and shuffle mode) and ten different categories of questions. By clicking on the <em>"ALMOST READY..."</em> button, you will access the quiz settings page.<br></p>
        <h3>Scoring system:</h3>
        <p>The scoring system is based on difficulty of the question <span class="clr-accent">(hard: x3, medium: x2, easy: x1)</span> and time taken to answer. For each correct answer, difficulty bonus will be multiplied for time bonus, that is based on the response time:<br>- For the <span class="clr-accent">first five seconds</span>: the bonus multiplier will be <span class="clr-accent">x3</span>.<br>- For the <span class="clr-accent">next five seconds</span>: the bonus multiplier will be <span class="clr-accent">x2</span>.<br>  After that, no time multiplier will be applied.</p>
      </div>
    `;
    this._popupHandler(this.popupOverlayEl, triggerBtnEl, markup);
  }

  startHandlers(usernameHandler, goToPreferencesHandler) {
    return (this._addHandlerUserInput(), // Handling controls on user input      
      this._addHandlerChangeUsernameBtn(), // Handling change username button      
      this._addHandlerQuizRulesBtn(), // Handling quiz rules popup button      
      this._addHandlerArrowRightBtn(usernameHandler), // Handling arrow right button that gets username and shows a message and nav-buttons      
      this._addHandlerGoToPrefencesBtn(goToPreferencesHandler) // Handling go to preferences
    ); 
  }
}
export default new WelcomeView();
