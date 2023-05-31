import View from "./View";

class LoadingView extends View {
    _parentElement = document.querySelector('.loading-window');

    _generateMarkup() {
        return `            
            
        `
    }

    updateProgress(percentage) {
        const progressBar = document.querySelector(".progress");
        const progressText = document.querySelector(".progress-text");
    
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }
      

    /* simulateLoading() {
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
    }     */  
    
}

export default new LoadingView();