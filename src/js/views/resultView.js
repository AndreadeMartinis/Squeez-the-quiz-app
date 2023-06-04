import View from "./View";
import {
  formatString,
  formatDate,
  formatDateJSStandard,
  truncateUsername,
  truncateCategories,
  formatDifficulty,
  formatTime,
  convertTimeToSeconds,
} from "../helper";

class ResultView extends View {
  _parentElement = document.querySelector(".result-window");

  _generateMarkup() {
    return `
    <div class="delete-records--overlay opacity-zero"></div>    
    <!-- ************************************** ALL RECORDS TABLE ************************************** -->
    <table aria-labelledby="table-label" id="records-table">
      <caption id="table-label">Records</caption>
      <thead>
        <tr>
          <th scope="col">Username</th>
          <th scope="col">Lvl</th>
          <th scope="col">Categories</th>
          <th scope="col">Match</th>
          <th scope="col" class="score-header">Score&#9652</th>
          <th scope="col" class="time-header">Time&#9652</th>
          <th scope="col" class="date-header">Date&#9652</th>
        </tr>
      </thead>
      <tbody>
        ${this._data.records
          .map((record) => `
            <tr>
                <td>${truncateUsername(record.username)}</td>
                <td>${formatDifficulty(record.difficulty)}</td>
                <td>${truncateCategories(formatString(record.categories))}</td>
                <td>${record.correctAnswers}/${record.questionLimit}</td>
                <td>${record.points}</td>
                <td>${formatTime(record.completingTime)}</td>
                <td>${formatDate(record.startingTime)}</td>
            </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <!-- NAVIGATION BUTTONS (1.Delete all records 2.Restart Quiz) -->
    <div class="record--btns-container">
      <button class="btn-nav-deleteResult"><span class="clr-accent">Delete</span> all records</button>
      <button class="btn-nav-restartQuiz"><span class="clr-accent">Squeez</span> me again!</button>
    </div>`;
  }

  addHandlerRestartBtn(handler) {
    const restartBtnsArr = document.querySelectorAll(".btn-nav-restartQuiz");
    restartBtnsArr.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.playSound(this._files.audioFiles.navBtnsAudio);
        handler();
      });
    });
  }

  addHandlerShowRecordsBtn() {
    const showRecordBtn = document.querySelector(".btn-nav-showRecords");
    const resultOverlay = document.querySelector(".result--overlay");
    showRecordBtn.addEventListener("click", () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      this._makeInvisibilePopup(resultOverlay);
      this._addHandlerSortRecords();
    });
  }

  addHandlerDeleteRecordsBtn(handler) {
    const triggerBtnEl = document.querySelector(".btn-nav-deleteResult");
    const popupOverlayEl = document.querySelector(".delete-records--overlay");
    const markup = `
      <div class="flex delete-records-popup--container">
        <button class="btn-close-popup">X</button>
        <h2>Are you sure?</h2>
        <p>All your precious records? 😢</p>
        <button class="btn-nav-delete-records-popup" type"button">Yes, <span class="clr-accent">delete</span>'em all</button>
      </div>
    `;
    this._popupHandler(popupOverlayEl, triggerBtnEl, markup);
    const deleteRecordsBtn = document.querySelector(".btn-nav-delete-records-popup");
    deleteRecordsBtn.addEventListener("click", () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      handler();
    });
  }

  renderDeleteRecordsPopup(handler) {
    handler();
  }

  renderResultPopup() {
    const markup = `
      <div class="flex result--overlay">
        <div class="flex result--container">     
          <div class="flex result--header">               
            <h2>Congratulations</h2>
            <h2><span class="clr-accent">${this._data.username}!</span></h2>
            <p>The quiz is over and you scored <span class="clr-accent">${this._data.game.totalPoints} points</span> with ${this._data.game.correctAnswers}/${this._data.preferences.questionLimit}!</p>
          </div>
          <!-- NAVIGATION BUTTONS (1.Restart Quiz 2.Show Records) -->
          <div class="result--btns-container">
            <button class="btn-nav-restartQuiz"><span class="clr-accent">Squeez</span> me again!</button>
            <button class="btn-nav-showRecords"><span class="clr-accent">Show</span> records</button>
          </div>
        </div>
      </div>
    `;
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _addHandlerSortRecords() {
    // All headers in an array
    const headersArr = document.querySelectorAll(".score-header, .time-header, .date-header");

    headersArr.forEach((header) => {
      let sortDirection = "asc";

      header.addEventListener("click", () => {
        const sortBy = header.classList.contains("score-header")
          ? "score"
          : header.classList.contains("time-header")
          ? "time"
          : "date";

        //Inverting sortDirection
        sortDirection = sortDirection === "asc" ? "desc" : "asc";

        // Replace arrow entities
        const arrowDown = String.fromCharCode(9662);
        const arrowUp = String.fromCharCode(9652);
        header.innerHTML = header.innerHTML.replace(
          sortDirection === "asc" ? arrowDown : arrowUp,
          sortDirection === "asc" ? arrowUp : arrowDown
        );

        this._sortRecords(sortBy, sortDirection);
        this.playSound(this._files.audioFiles.navBtnsAudio);
      });
    });
  }

  _sortRecords(sortBy, sortDirection) {
    const recordsTable = document.getElementById("records-table");
    const tbody = recordsTable.querySelector("tbody");
    const rows = Array.from(tbody.getElementsByTagName("tr"));

    rows.sort((rowA, rowB) => {
      let valueA, valueB, dateA, dateB;

      if (sortBy === "score") {
        valueA = parseInt(rowA.cells[4].textContent);
        valueB = parseInt(rowB.cells[4].textContent);
      } else if (sortBy === "time") {
        const timeA = rowA.cells[5].textContent.trim();
        const timeB = rowB.cells[5].textContent.trim();

        valueA = convertTimeToSeconds(timeA);
        valueB = convertTimeToSeconds(timeB);
      } else if (sortBy === "date") {
        dateA = formatDateJSStandard(rowA.cells[6].textContent);
        valueA = new Date(dateA);
        dateB = formatDateJSStandard(rowB.cells[6].textContent);
        valueB = new Date(dateB);
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

    rows.forEach((row) => tbody.removeChild(row));
    rows.forEach((row) => tbody.appendChild(row));
  }

  startHandlers(handlerDeleteRecordsBtn, handlerRestartBtn) {
    this.renderResultPopup();
    this.addHandlerShowRecordsBtn();
    this._addHandlerSortRecords();
    this.addHandlerDeleteRecordsBtn(handlerDeleteRecordsBtn);
    this.addHandlerRestartBtn(handlerRestartBtn);
  }
}
export default new ResultView();
