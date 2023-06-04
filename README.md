# Squeez - The Quiz App

This is a simple quiz app written in JavaScript, HTML, and CSS. The app allows the user to select a username, set game preferences, and play a quiz with questions and answers provided by an API.

## Features
- Arcade style graphic
- Fast loading: The app loads quickly, allowing the user to start playing without long waiting times.
- Username: The user can select a username before starting the game.
- Preferences screen: The user can set the quiz difficulty, the number of questions, and the question categories.
- Questions and answers API: The app makes an API call to retrieve a set of questions and answers for the quiz.
- Points calculation: The user's points are calculated based on the question difficulty and the time taken to answer.
- Records: At the end of the quiz, a table displays the user's new record and previous records.

## Technologies Used
- JavaScript: The main programming language for the app's logic.
- HTML: The markup used to structure and display the app's user interface.
- CSS: The language used for styling and presenting the user interface.

## Installation and Execution Instructions
1. Make sure you have an up-to-date web browser installed on your computer.
2. Download all the app files (JavaScript, HTML, and CSS files) into a folder on your computer.
3. Open the terminal in the application folder.
4. Make sure you have Node.js installed on your computer. If you haven't installed it yet, you can download it from [https://nodejs.org/](https://nodejs.org/).
5. Install the application dependencies by running the following command in the terminal:
   ```bash
   npm install
   ```
6. Start the local server for the application by running the following command in the terminal:
   ```bash
   npm start
   ```
   This will start the local server using Parcel.
7. Open your browser and visit the URL displayed in the terminal (usually http://localhost:1234) to view the application.
8. The application will load, and you'll be ready to start using it.

## Possible Future Improvements
- Implementing an authentication system to allow users to compare their records with other players.
- Implementing new languages (Italian first of all).
- Adding a "Help" feature.
