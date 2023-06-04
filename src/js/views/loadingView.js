import View from "./View";

class LoadingView extends View {
  _parentElement = document.querySelector(".loading-window");

  _generateMarkup() {
    return `
      <div class="flex loading-window--container fade-in">         
        <div class="flex spinner--container">
          <img src="${this._files.imageFiles.spinnerIcon}" alt="spinner" title="spinner">
        </div>
        <h3>loading...</h3>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
        <div class="progress-text">0%</div>
      <div>
    `;
  }

  simulateLoading() {
    const progressBar = document.querySelector(".progress");
    const progressText = document.querySelector(".progress-text");
    let percent = 0;
    const increment = 100 / 400;
  
    const intervalId = setInterval(() => {
      percent += increment;
      progressBar.style.width = percent + "%";
      progressText.textContent = Math.round(percent) + "%";
  
      if (percent >= 100) {
        clearInterval(intervalId);
      }
    }, 1);
  } 

   // BUTTON SHOW CREDITS POPUP (TEXT: THANK Y❤️U!)
  _addHandlerCreditsBtn() {
    const popupOverlayEl = document.querySelector(".credits-popup--overlay");
    const triggerBtnEl = document.querySelector(".credits-popup--link");
    const markup = `
      <div class="flex credits-popup--container">
        <button class="btn-close-popup">X</button>
        <h2>And the credits goes to...</h2>
        <p>For questions and answers:</p>
        <a href="https://the-trivia-api.com/" class="clr-accent" target="_blank">THE TRIVIA API</span> </a>
        <p>For the blob idea:</p>
        <a href="https://codepen.io/thedevenv/pen/JjrXayd" class="clr-accent" target="_blank">This pen by theDevEnv</a>
        <p>For the starting idea and all the patience:</p>
        <p class="clr-accent">❤️ Yuliya ❤️</p><br>
        <h2>That's all folks!</h2>
      </div>
    `;
    this._popupHandler(popupOverlayEl, triggerBtnEl, markup);
  }

  // BUTTON BLOB ON/OFF
  _addHandlerBlobBtn() {
    const btnBlob = document.querySelector('input[name="btn-blob-onoff"]');
    const blobEl = document.querySelector(".blobEl");
    const blobMessage = document.querySelector(".blob--message");
    this.isBlobVisible = btnBlob.checked;
    btnBlob.addEventListener("change", () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      if (this.isBlobVisible) {
        this.isBlobVisible = false;
        blobMessage.innerHTML = `<p>Best for a slow device 🐢</p>`;
        this._makeVisibile(blobMessage);
        setTimeout(() => {
          this._makeInvisibile(blobMessage);
        }, 1500);
      } else {
        this.isBlobVisible = true;
        blobMessage.innerHTML = `<p>Best for a fast device 💣</p>`;
        this._makeVisibile(blobMessage);
        setTimeout(() => {
          this._makeInvisibile(blobMessage);
        }, 1500);
      }

      setTimeout(() => {
        this.playSound(this._files.audioFiles.blobBtnAudio);
        blobEl.classList.toggle("hidden");
      }, 500);
    });
  }

  _addHandlerSoundBtn() {
    this.isMuted = this._soundCheckbox.checked;
    const soundMessage = document.querySelector(".sound--message");
    this._soundCheckbox.addEventListener("click", () => {
      this.playSound(this._files.audioFiles.navBtnsAudio);
      if (this.isMuted) {
        this.isMuted = false;
        soundMessage.innerHTML = `<p>Sound off 🔇</p>`;
        this._makeVisibile(soundMessage);
        setTimeout(() => {
          this._makeInvisibile(soundMessage);
        }, 1500);
      } else {
        this.isMuted = true;
        soundMessage.innerHTML = `<p>Sound on 🔊</p>`;
        this._makeVisibile(soundMessage);
        setTimeout(() => {
          this._makeInvisibile(soundMessage);
        }, 1500);
      }
    });
  }

  _addSoundToLinks() {
    const footer = document.querySelector(".footer");
    footer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        this.playSound(this._files.audioFiles.navBtnsAudio);
      });
    });
  }

  startHandlers(){
    return (this._addHandlerBlobBtn(), // Handling ON/OFF blob button
      this._addHandlerSoundBtn(), // Handling ON/OFF sound button
      this._addHandlerCreditsBtn(), // Handling credits popup button
      this._addSoundToLinks() // Handling sound
    )
  }
}

export default new LoadingView();
