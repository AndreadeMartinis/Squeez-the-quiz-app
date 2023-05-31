import spinner from "../../img/favicon.png"
export default class View {  
    _data
    _parentElement
    _spinner = spinner
    _soundCheckbox = document.querySelector('#btn-sound-onoff');
    
    renderData(data) {
        //Sets data to be rendered
        this._data = data
        //Generates markup
        const markup = this._generateMarkup()
        //Clears container
        this._clear()
        //Removes hidden class from container if it exists
        this._parentElement.classList.remove('hidden')
        //Inserts markup
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpinner(){
        const markup = `
            <div class="flex spinner-overlay">
                <div class="spinner-popup--container">
                <h2>Loading...</h2>
                <div class="flex spinner--container">
                    <img src=${this._spinner} alt="spinner" title="spinner">
                </div>
            </div>
        `
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    removeSpinner(){
        document.querySelector('.spinner-overlay').remove()
    }

    renderError(){
        const markup = this._generateErrorMarkup();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        this._errorMessageOverlay = this._parentElement.querySelector('.error-message-overlay')
        this._handleClosePopup(this._errorMessageOverlay)
        this.playSound('audioUsernameInputErr')
    }

   _handleClosePopup(overlay){
        const popupOverlay = overlay;
        const closePopupBtns = overlay.querySelector('.btn-close-popup')
        this._hidePopupOnCloseBtn = () => {
            closePopupBtns.addEventListener('click',() => {
                popupOverlay.classList.add('hidden')
                this.playSound('audioCloseBtn')
            })
        }
        this._hidePopupFromOverlay = () => {
            window.addEventListener('click', (e) => {
                if (e.target === popupOverlay) {
                    popupOverlay.classList.add('hidden');
                    this.playSound('audioCloseBtn')
                }
            })
        }
        return this._hidePopupOnCloseBtn(), this._hidePopupFromOverlay()
    }

   _clear() {
        this._parentElement.innerHTML = '';
    }

    playSound(soundURL) {
        if (this._soundCheckbox.checked) {           
            const sound = new Audio(soundURL);
            sound.currentTime = 0;
            sound.play();
        }
    }      

    hideWindow(){
        this._parentElement.classList.add('hidden')
    }

    showWindow(){
        this._parentElement.classList.remove('hidden')
    }

   _makeVisibile(element){
        element.classList.add('fade-in')
        element.classList.remove('fade-out')
    }

   _makeInvisibile(element){
        element.classList.add('fade-out')
        element.classList.remove('fade-in')
    }

   _makeVisibilePopup(element){
        element.classList.add('fade-in-popup')
        element.classList.remove('fade-out-popup')
    }

   _makeInvisibilePopup(element){
        element.classList.add('fade-out-popup')
        element.classList.remove('fade-in-popup')
    }

   _popupHandler(popupOverlayEl, triggerBtnEl, markup){
        popupOverlayEl.innerHTML = ''
        popupOverlayEl.insertAdjacentHTML('afterbegin', markup)
        this._closePopupBtns = popupOverlayEl.querySelector('.btn-close-popup')
        this._showPopup = () => {
            triggerBtnEl.addEventListener('click', (e) => {
                e.preventDefault()
                this.playSound(this._data.files.audioFiles.navBtns)    
                this._makeVisibilePopup(popupOverlayEl)
            })
        }
        this._hidePopupOnCloseBtn = () => {
            this._closePopupBtns.addEventListener('click',() => {
                this.playSound(this._data.files.audioFiles.closeBtn)
                this._makeInvisibilePopup(popupOverlayEl)
            })
        }
        this._hidePopupFromOverlay = () => {
            window.addEventListener('click', (e) => {
                if (e.target === popupOverlayEl) {
                    this.playSound(this._data.files.audioFiles.closeBtn)
                    this._makeInvisibilePopup(popupOverlayEl);
                }
            })
        }
        return this._showPopup(), this._hidePopupOnCloseBtn(), this._hidePopupFromOverlay()
    }

    
}



