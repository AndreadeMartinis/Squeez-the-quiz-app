export const shuffleArr = function(arr){
    let j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

export const createPrefURL = function (obj){
    //prettier-ignore
    return `limit=${obj.questionLimit}${obj.difficulty === 'shuffle' ? '' : '&difficulty=' + obj.difficulty}${obj.categories === 'mixed' ? '' : '&categories=' + obj.categories}`
}

export const firstLetterUppercase = function (str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatString = function (str){    
    str = str.replaceAll('_', ' '); // Replaces all '_' characters with a space
    str = str.replaceAll(/(\w+)/g, (match) => match.charAt(0).toUpperCase() + match.slice(1)); // Capitalizes the first letter of each word
    str = str.replaceAll(' And ', '&'); // Replaces all occurrences of ' and ' with ' & '
    str = str.replaceAll(',', ', '); // Adds a space after each comma
    return str;
}

// Format to seconds in mm': ss''
export const formatTime = function(seconds){
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}' : ${secondsLeft < 10 ? '0' : ''}${secondsLeft}''`;
}

// Convert mm:ss to seconds
export const convertTimeToSeconds = function(time) {
    const [minutes, seconds] = time.split(':');
    return parseInt(minutes) * 60 + parseInt(seconds);
  }

// Format to dd/mm/yy
export const formatDate = function(dateString){
    const date = new Date(dateString)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dayFormatted = day < 10 ? `0${day}` : day;
    const monthFormatted = month < 10 ? `0${month}` : month;

    return `${dayFormatted}-${monthFormatted}-${year.toString().slice(-2)}`;
}

// dateString is "dd-mm-yy" and sorting needs "yyyy-mm-dd" format
export const formatDateJSStandard = function(dateString){
    const [day, month, year] = dateString.split('-');
    const formattedDate = `20${year}-${month}-${day}`; // Add "20" to format the year as "yyyy", as JS standard
    return new Date(formattedDate);
}

// Truncs part of the username if is too long, for Records Table
export const truncateUsername = function(username) {
    const maxLength = 10;
    if (username.length > maxLength) {
      return username.substring(0, maxLength - 3) + '...';
    }
    return username;
}

// Truncs from the third category, if there are more
export const truncateCategories = function (categories) {
    const maxCategories = 3;
    const categoryArray = categories.split(',').map(category => category.trim());
    
    if (categoryArray.length > maxCategories) {
        const truncatedCategories = categoryArray.slice(0, maxCategories);
        return truncatedCategories.join(', ') + ', ...';
    }
    
    return categories;
}

export const formatDifficulty = function(difficulty){
    if (difficulty === "easy") return "E";
    if (difficulty === "medium") return "M";
    if (difficulty === "hard") return "H";
    if (difficulty === "shuffle") return "S";
}
  
  