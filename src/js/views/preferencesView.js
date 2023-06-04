import { firstLetterUppercase } from "../helper";
import View from "./View";

class PreferencesView extends View {
  _parentElement = document.querySelector(".preferences-window");
  renderData(data, files) {
    super.renderData(data, files);
    this._renderUserPreferences();
  }
  _generateMarkup() {
    return `
            <!-- ************************************** USER INFO PANEL ************************************** -->
            <div class="user-info--container">
                <h3 class="username">${this._data.username}</h3>
                <button class="arrow-left-btn" type="button">&#x2039;<span>change username</span></button>
            </div>
            <h2 class="preferences-message"><span class="clr-accent">${firstLetterUppercase(
              this._data.username
            )}?</span> Oh jeez!<br>Set up some stuff and make it <span class="clr-accent">squeez!</span></h2>
            <!-- ******************* FORM FOR DIFFICULTY, QUESTION LIMIT AND CATEGORIES ******************* -->
            <form class="flex preferences-form">
                <!-- ******************* DIFFICULTY FIELDSET ******************* -->
                <fieldset>
                    <legend class="legend">Difficulty</legend>
                    <div class="flex get-difficulty--container">
                        <div>
                            <input type="radio" id="easy" name="difficulty" value="easy">
                            <label class="btn-input" for="easy">Easy</label>                  
                        </div>
                        <div>
                            <input type="radio" id="medium" name="difficulty" value="medium"> 
                            <label class="btn-input" for="medium">Medium</label>                                 
                        </div>
                        <div>
                            <input type="radio" id="hard" name="difficulty" value="hard">
                            <label class="btn-input" for="hard">Hard</label>                  
                        </div>
                        <div>
                            <input type="radio" id="shuffle" name="difficulty" value="shuffle">
                            <label class="btn-input" for="shuffle">Shuffle!</label>                  
                        </div>
                    </div>         
                </fieldset>         
                <!-- ******************* QUESTION LIMIT FIELDSET ******************* -->
                <fieldset>
                    <legend class="legend">Number of questions</legend>
                    <div class="flex get-questionLimit--container">
                    <div>
                        <input type="radio" id="limit_5" name="questionLimit" value="5">
                        <label class="btn-input" for="limit_5">5</label>
                    </div>
                    <div>
                        <input type="radio" id="limit_10" name="questionLimit" value="10">
                        <label class="btn-input" for="limit_10">10</label>
                    </div>
                    <div>
                        <input type="radio" id="limit_15" name="questionLimit" value="15">
                        <label class="btn-input" for="limit_15">15</label>
                    </div>
                    <div>
                        <input type="radio" id="limit_20" name="questionLimit" value="20">
                        <label class="btn-input" for="limit_20">20</label>
                    </div>
                    </div>
                </fieldset>
                <!-- ******************* CATEGORIES FIELDSET (contains default-category container and other-categories wrapper) ******************* -->
                <fieldset>
                    <legend class="legend">Categories</legend>
                    <div class="flex get-categories--container">
                    <!-- CATEGORY: MIXED -->
                    <div class="default-category--container">
                        <input type="radio" id="mixed_categories" name="categories" value="mixed">
                        <label class="btn-input" for="mixed_categories">Mixed</label>
                    </div>
                    <!-- OTHER CATEGORIES WRAPPER (containes two containers, both with half categories buttons) -->
                    <div class="flex other-categories--wrapper">
                        <!-- OTHER CATEGORIES FIRST CONTAINER -->
                        <div class="flex other-categories--container">
                        <div>
                            <input type="checkbox" id="general_knowledge" name="categories" value="general_knowledge">
                            <label class="btn-input" for="general_knowledge">General Knowledge</label>
                        </div>
                        <div>
                            <input type="checkbox" id="music" name="categories" value="music">
                            <label class="btn-input" for="music">Music</label>
                        </div>
                        <div>
                            <input type="checkbox" id="sport_and_leisure" name="categories" value="sport_and_leisure">
                            <label class="btn-input" for="sport_and_leisure">Sport & Leisure</label>
                        </div>
                        <div>
                            <input type="checkbox" id="food_and_drink" name="categories" value="food_and_drink">
                            <label class="btn-input" for="food_and_drink">Food & Drink</label>
                        </div>
                        <div>
                            <input type="checkbox" id="history" name="categories" value="history">
                            <label class="btn-input" for="history">History</label>
                        </div>
                        </div>
                        <!-- OTHER CATEGORIES SECOND CONTAINER -->
                        <div class="flex other-categories--container">
                        <div>
                            <input type="checkbox" id="society_and_culture" name="categories" value="society_and_culture">
                            <label class="btn-input" for="society_and_culture">Society & Culture</label>
                        </div>
                        <div>
                            <input type="checkbox" id="science" name="categories" value="science">
                            <label class="btn-input" for="science">Science</label>
                        </div>
                        <div>
                            <input type="checkbox" id="arts_and_literature" name="categories" value="arts_and_literature">
                            <label class="btn-input" for="arts_and_literature">Arts & Literature</label>
                        </div>
                        <div>
                            <input type="checkbox" id="film_and_tv" name="categories" value="film_and_tv">
                            <label class="btn-input" for="film_and_tv">Film & TV</label>
                        </div>
                        <div>
                            <input type="checkbox" id="geography" name="categories" value="geography">
                            <label class="btn-input" for="geography">Geography</label>
                        </div>
                        </div>
                    </div>             
                    </div>
                </fieldset>
                <button type="button" class="btn-nav-startQuiz"><span class="clr-accent">Squeez</span> me!</button>          
            </form>
        `;
  }

  _generateErrorMarkup() {
    return `
            <div class="error-message-overlay">
                <div class="flex error-message-popup--container">
                    <button class="btn-close-popup">X</button>
                    <h3>Error</h3>
                    <p>
                        An error occurred while retrieving data from the server,<br>
                        there may be a connection issue...🥲<br>
                        Check you internet connection 😉
                    </p>
                </div>
            </div>
        `;
  }

  // Change username (back to welcome) button handler
  _addHandlerBackToUsernameBtn(handler) {
    const showWelcomeWindowBtn = document.querySelector(`.arrow-left-btn`);
    showWelcomeWindowBtn.addEventListener("click", () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      handler();
    });
  }

  // Start quiz button handler
  _addHandlerStartQuizBtn(handler) {
    this.quizStartBtn = document.querySelector(".btn-nav-startQuiz");

    this._clickHandler = () => {
      this.playSound(this._files.audioFiles.startQuizAudio);
      handler();
    };

    this._keyHandler = (event) => {
      if (event.code === "Enter") {
        this._clickHandler();
      }
    };

    this.quizStartBtn.addEventListener("click", this._clickHandler);
    this._parentElement.addEventListener("keypress", this._keyHandler);
  }

  removeHandlerStartQuizBtn() {
    this.quizStartBtn.removeEventListener("click", this._clickHandler);
    this._parentElement.removeEventListener("keypress", this._keypressHandler);
  }

  getUserPreferences() {
    // Get game difficulty
    const difficulty = this._parentElement.querySelector(
      'input[name="difficulty"]:checked'
    ).value;
    // Get numbers of question
    const questionLimit = this._parentElement.querySelector(
      'input[name="questionLimit"]:checked'
    ).value;
    // Get categories, could be only one if mixed category is chosen or oneormore if one other category is chosen
    const categories = Array.from(
      document.querySelectorAll('input[name="categories"]:checked')
    )
      .map((input) => input.value)
      .join(",");

    return {
      difficulty: difficulty,
      questionLimit: questionLimit,
      categories: categories.includes("mixed") ? "mixed" : categories,
    };
  }

  _renderUserPreferences() {
    // Set game difficulty
    const difficultyInputs = this._parentElement.querySelectorAll('input[name="difficulty"]');
    if (this._data.preferences.difficulty) {
      difficultyInputs.forEach((input) => {
        input.checked = input.value === this._data.preferences.difficulty;
      });
    } else {
      // Default to 'medium' if no previous preference is available
      difficultyInputs.forEach((input) => {
        input.checked = input.value === "medium";
      });
    }

    // Set number of questions
    const questionLimitInputs = this._parentElement.querySelectorAll('input[name="questionLimit"]');
    if (this._data.preferences.questionLimit) {
      questionLimitInputs.forEach((input) => {
        input.checked = input.value === this._data.preferences.questionLimit;
      });
    } else {
      // Default to '10' if no previous preference is available
      questionLimitInputs.forEach((input) => {
        input.checked = input.value === "10";
      });
    }
    // Set categories
    this.categoryCheckboxes = this._parentElement.querySelectorAll('input[name="categories"]');
    this.categoryCheckboxes.forEach((input) => {
      if (this._data.preferences.categories) {
        input.checked = this._data.preferences.categories.includes(input.value);
      } else {
        // Default to 'mixed' if no previous preference is available
        input.checked = input.value === "mixed";
      }
    });
  }

  // - Categories buttons behaviour: mixed category is selected by default if anything else is selected. If so, mixed category is not selected.
  _addHandlerCategoriesBtns() {
    const fieldsetCategories = document.querySelector(".get-categories--container");
    const mixedCheckbox = fieldsetCategories.querySelector("#mixed_categories");

    fieldsetCategories.addEventListener("change", (e) => {
      const target = e.target;

      if (target === mixedCheckbox) {
        this.categoryCheckboxes.forEach((checkbox) => {
          if (checkbox !== mixedCheckbox) {
            checkbox.checked = false;
          }
        });
      } else {
        let checkedCategories = Array.from(this.categoryCheckboxes).filter(
          (checkbox) => checkbox !== mixedCheckbox && checkbox.checked
        );
        if (checkedCategories.length === 0) {
          mixedCheckbox.checked = true;
        } else {
          mixedCheckbox.checked = false;
        }
      }
    });
  }

  // A color theme is selected based on the difficulty chosen.
  _addHandlerDifficultyBtns() {
    const shuffleCheckbox = document.getElementById("shuffle");
    const easyCheckbox = document.getElementById("easy");
    const hardCheckbox = document.getElementById("hard");
    const mediumCheckbox = document.getElementById("medium");

    // Add a listener to the chaging status of the difficulty checkboxes
    shuffleCheckbox.addEventListener("change", updateRootClass);
    easyCheckbox.addEventListener("change", updateRootClass);
    hardCheckbox.addEventListener("change", updateRootClass);
    mediumCheckbox.addEventListener("change", updateRootClass);

    function updateRootClass() {
      // Remove all classes previously added
      document.documentElement.classList.remove(
        "shuffle",
        "easy",
        "hard",
        "medium"
      );

      // Add correct class to difficulty chosen
      if (shuffleCheckbox.checked)
        document.documentElement.classList.add("shuffle");
      else if (easyCheckbox.checked)
        document.documentElement.classList.add("easy");
      else if (hardCheckbox.checked)
        document.documentElement.classList.add("hard");
      else if (mediumCheckbox.checked)
        document.documentElement.classList.remove("medium");
    }
  }

  _addSoundToInputBtns() {
    const preferencesBtns = this._parentElement.querySelectorAll("input");
    preferencesBtns.forEach((btn) => {
      btn.addEventListener("change", () => {
        this.playSound(this._files.audioFiles.preferencesBtnsAudio);
      });
    });
  }

  startHandlers(changeUsernameHandler, startQuizHandler) {
    return (
      this._addHandlerCategoriesBtns(), // Category inputs handler, sets mixed category by default
      this._addHandlerDifficultyBtns(), // Difficulty inputs handler, changes color theme
      this._addSoundToInputBtns(),
      this._addHandlerBackToUsernameBtn(changeUsernameHandler),
      this._addHandlerStartQuizBtn(startQuizHandler)
    );
  }

  restartHandlers(startQuizHandler) {
    this._addHandlerStartQuizBtn(startQuizHandler);
  }
}

export default new PreferencesView();
