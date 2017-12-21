//AngularJS for updating the metadata text at the bottom of the textArea
myApp = angular.module('myApp', []);

myApp.controller('MainController', function( $scope ) {

  $scope.inputText = {text:""}
  $scope.textPedantified = false; // Stores if any text has been pedantified in the current session
  $scope.oldMeanLength = 0; // Mean word length before pedantification
  $scope.wordsReplaced = 0; // Number of words changed when the text was pedantified

  // Counts and displays the current number of words in the text
  $scope.numWords = function(text) {
    //splits the text on space/tab/enter
    var s = text ? text.split(/\s+/) : 0;
    return s ? s.length : '0';
  }

  // Counts and displays the number of characters in the text
  $scope.numChars = function(text) {
    var s = text ? text.length : 0;
    return s;
  }

  // Displays the mean number of characters in each word before pedantification
  $scope.meanWordLenBefore = function(text) {
    if ($scope.textPedantified == false) {
      var s = text ? text.split(/\s+/) : 0;
      numChars = 0;
      for ( var wordIndex1 in s) {
        numChars += s[wordIndex1].length;
      }
      return s ? ( numChars / s.length ).toFixed(2) : '0';
    } else {
      return $scope.oldMeanLength;
    }
  }

  // Displays the mean number of characters in each word after pedantification
  $scope.meanWordLenAfter = function( text ) {
    if ($scope.textPedantified == false) {
      return '0';
    } else {
      var s = text ? text.split(/\s+/) : 0;
      numChars = 0;
      for ( var wordIndex2 in s) {
        numChars += s[wordIndex2].length;
      }
      return s ? (numChars / s.length).toFixed(2) : '0';
    }
  }
});

//Initializes all variables/objects/eventlisteners when the webpage loads
function init() {

  currReplacement = "min";

  // Assigning variables to all elements used
  ignoreHyphenatedWordsText = document.getElementById('ignoreHyphenatedWordsText');
  replacementClickableText = document.getElementById('replacementClickableText');
  excludeConjuctionsText = document.getElementById('excludeConjuctionsText');
  excludePronounsText = document.getElementById('excludePronounsText');
  oneWordSynonymsText = document.getElementById('oneWordSynonymsText');
  resetOptionsBtn = document.getElementById('resetOptionsBtn');
  chkConjunctions = document.getElementById('chkConjunctions');
  redoPedantify = document.getElementById('forwardTextBtn');
  percentReplVal = document.getElementById('percReplValue');
  noSynRepText = document.getElementById('noSynRepText');
  percentReplSlider = document.getElementById('slider1');
  undoPedantify = document.getElementById('backTextBtn');
  chkMultiWord = document.getElementById('chkMultiWord');
  chkPronouns = document.getElementById('chkPronouns');
  chkNoRepeat = document.getElementById('chkNoRepeat');
  percRepText = document.getElementById('percRepText');
  excludeWord = document.getElementById('textArea2');
  chkHyphens = document.getElementById('chkHyphens');
  chooseFile = document.getElementById('chooseFile');
  saveBtn = document.getElementById('saveFileLink');
  submitBtn = document.getElementById('submitBtn');
  text_area = document.getElementById('textArea1');
  resetBtn = document.getElementById("resetBtn");
  randBtn = document.getElementById('randBtn');
  minBtn = document.getElementById('minBtn');
  maxBtn = document.getElementById('maxBtn');

  getDictionary();

  addEventListeners();

  // Checking for cached data (in localStorage)
  // Try-catch necessary if user has localstorage turned off
  try {
    if (localStorage['mainText'] != undefined){
      loadLocalStorage();
    }
  }
  catch(err) {console.log(err);}
  // Setting the initial value of the progress bar
  percentReplVal.innerHTML = percentReplSlider.value + "%";

  // Sets the style for the currently selected replacement type (min, max, or random)
  if ( currReplacement == "min" ) {
    minBtn.style.color = "#e88b2e";
  } else if ( currReplacement == "max" ) {
    maxBtn.style.color = "#e88b2e";
  } else if ( currReplacement == "random" ) {
    randBtn.style.color = "#e88b2e";
  }

}

// Save current website data to localStorage
function saveLocalStorage() {
  localStorage['mainText'] = text_area.value;
  localStorage['excText'] = excludeWord.value;
  localStorage['percentReplacement'] = percentReplSlider.value;
  localStorage['excludePronouns'] = chkPronouns.checked;
  localStorage['excludeHyphenated'] = chkHyphens.checked;
  localStorage['excludeConjunctions'] = chkConjunctions.checked;
  localStorage['currReplacement'] = currReplacement;
  localStorage['chkMultiWord'] = chkMultiWord.checked;
  localStorage['chkNoRepeat'] = chkNoRepeat.checked;
}

//Load locally stored data for the website
function loadLocalStorage() {
  currReplacement = localStorage['currReplacement'];
  excludeWord.value = localStorage['excText'];
  percentReplSlider.value = localStorage['percentReplacement'];
  //Convert strings to boolean
  chkPronouns.checked = ( localStorage['excludePronouns'] == 'true');
  chkHyphens.checked = ( localStorage['excludeHyphenated'] == 'true' );
  chkConjunctions.checked = ( localStorage['excludeConjunctions'] == 'true' );
  chkNoRepeat.checked = ( localStorage['chkNoRepeat'] == 'true' );
  chkMultiWord.checked = ( localStorage['chkMultiWord'] == 'true');
  text_area.value = localStorage['mainText'];
  text_area.value = '123';
  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  //controllerScope.inputText.text = text_area.value;
  controllerScope.$apply();
}

// Loading the dictionary from the server using AJAX (through jQuery)
function getDictionary() {
  $.ajax({
    url:'http://www.pedantify.com/js/dict.js',
    success: function (data){
      starterDict = eval(data);
    }
  });
}

// Fixes the angularJS text display when a text file is loaded
function updateTextFromFile() {
  text_area.value = text;
  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  controllerScope.inputText.text = text;
  controllerScope.$apply();
}

// Adds all of the event listeners to the webpage
function addEventListeners() {

  // Clicking on the text by check boxes will check the boxes
  replacementClickableText.addEventListener('click', function() {
    if ( currReplacement == "min" ) {
      changeReplacementType('max');
    }
    else if ( currReplacement == "max" ) {
      changeReplacementType('random');
    }
    else if ( currReplacement == "random" ) {
      changeReplacementType('min');
    }
  });

  // Clicking on the text by the percentage replacement will add 10 to the slider.
  percRepText.addEventListener('click', function() {
    if ( parseInt(percentReplSlider.value) == 100 ) {
      percentReplSlider.value = "0";
    }
    else if ( parseInt(percentReplSlider.value) > 90 ) {
      percentReplSlider.value = "100";
    }
    else {
      percentReplSlider.value = String(parseInt(percentReplSlider.value) + 10);
    }
    percentReplVal.innerHTML = percentReplSlider.value + "%";
  });

  // If window is closing, store text/options in the cache
  window.onbeforeunload = function() {
    saveLocalStorage();
  }

  // If the user selects a file, load its context into the main textArea
  chooseFile.onchange = function() {
    fileToLoad = chooseFile.files[chooseFile.files.length - 1];
    reader = new FileReader();
    reader.onload = function(e) {
      text = reader.result;
      updateTextFromFile();
      chooseFile.value = "";
    }
    reader.readAsText(fileToLoad);
  }

  // Update the "percentage replacement" slider text
  percentReplSlider.addEventListener("input", function() {
    percentReplVal.innerHTML = percentReplSlider.value + "%";
  });

  //Add click listeners to all of the buttons below the main textArea
  resetBtn.addEventListener("click", function() {
    text_area.value = "";
  });

  undoPedantify.addEventListener('click', function() {
    // This selects the elements necessary to update metadata text using angularjs
    var controllerElement = document.querySelector('section');
    var controllerScope = angular.element(controllerElement).scope();

    text_area.value = old_text;

    controllerScope.inputText.text = old_text;
    controllerScope.$apply();
    text = old_text;
  });

  redoPedantify.addEventListener('click', function() {
    var controllerElement = document.querySelector('section');
    var controllerScope = angular.element(controllerElement).scope();
    text_area.value = old_text;
    controllerScope.inputText.text = old_text;
    controllerScope.$apply();
    text = old_text;
  });

  minBtn.addEventListener('click', function() {
    changeReplacementType('min');
  });

  maxBtn.addEventListener('click', function() {
    changeReplacementType('max');
  });

  randBtn.addEventListener('click', function() {
    changeReplacementType('random');
  });

  // Reset options to their default values
  resetOptionsBtn.addEventListener('click', function() {
    changeReplacementType('min');
    percentReplSlider.value = 50;
    percentReplVal.innerHTML = percentReplSlider.value + "%";
    excludeWord.value = "";
    chkConjunctions.checked = false;
    chkPronouns.checked = false;
    chkHyphens.checked = false;
    chkMultiWord.checked = false;
    chkNoRepeat.checked = false;
  });

  submitBtn.addEventListener('click', function() {
    pedantifyInit();
  });
}

// Change the type of replacement for pedantification (min, max, random)
function changeReplacementType(newReplacement) {
  currReplacement = newReplacement;
  if ( currReplacement == "max" ) {
    maxBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    randBtn.style.color = "white";
  } else if ( currReplacement == "min" ) {
    minBtn.style.color = "#e88b2e";
    maxBtn.style.color = "white";
    randBtn.style.color = "white";
  } else if ( currReplacement == "random" ) {
    randBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    maxBtn.style.color = "white";
  }
}

//Variables necessary for pedantification
var conjunctions = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"];
var punctuationList = [".","!",",","?",":",";"];
var ignoreConjunctions = false;
var ignorePronouns = false;
var ignoreHyphens = false;
var noMultiWords = false;
var noSynRep = false;
var excludedWords = [];
//http://www.really-learn-english.com/list-of-pronouns.html
// personal pronouns: I, you, he, she, it, we, they, me, him, her, us, them
// subjective pronouns: I, you, he, she, it, they, what, who.
// objective pronouns: me, him, her, it, us them, whom
// possessive pronouns: mine, yours, his, hers, ours, theirs.
// demonstrative pronouns: this, that, these, those.
// interrogative pronouns: who, whom, which, what, whose, whoever, whatever, whichever, whomever
// relative pronouns: who, whom, whose, which, that, what whatever, whoever, whomever, whichever
// reflexive: myself, yourself, himself, herself, itself, ourselves, themselves
// intensive pronouns: myself, yourself, himself, herself, itself, ourselves, themselves
// reciprocal pronouns: each other, one another
// indefinitite pronouns (not a complete list): anything, everybody, another, each, few, many, none, some all,
// any, anybody, anyone, everyone, everything, no one, nobody, nothing, none,
// other, others, several, somebody, someone, something, most, enough, little, more, both, either, neither, one,
// much, such.

// ===============================================================
// FINAL LIST
// ================================================================
// The overall list we will  use is:
// I, you, he, she, it, we, they, me, him, her, us, them, they, what, who, whom, mine, yours, his, hers, ours, theirs.
// this, that, these, those, which, whatever, whoever, whomever, whichever, myself, yourself, himself, herself, itself, ourselves, themselves
// each other, one another, anything, everybody, another, each, few, many, none, some all
// any, anybody, anyone, everyone, everything, no one, nobody, nothing, none,
// other, others, several, somebody, someone, something, most, enough, little, more, both, either, neither, one,
// much, such

var pronouns = [];
var old_text = "";
var percent = 0;
var text = "";
var usedWords = [];

//Handles calling the function necessary for pedantification
function pedantifyInit() {
  text = text_area.value;
  percent = percentReplSlider.value;
  method = currReplacement;
  getExcludedOptions();
  getExcludedWords();
  // We use old_text to store the text before pedantification
  old_text = text;
  pedantify();
}

//Uses the checkboxes in 'options' to see if pronouns, conjunctions, and hyphenated words will excluded
function getExcludedOptions() {
    ignoreConjunctions = chkConjunctions.checked;
    ignorePronouns = chkPronouns.checked;
    ignoreHyphens = chkHyphens.checked;
    noMultiWords = chkMultiWord.checked;
    noSynRep = chkNoRepeat.checked;
}

//Uses the textArea in 'options' to get a list of words to ignore in pedantification
function getExcludedWords() {
  excludedWords = getWhitespaceAndWords(excludeWord.value)[1];
}

//Gets the shortest or longest word in an array
function getLongShortWord(inputList, type="long") {
  // We initialize the current replacement word wordlength to be the first word in the synonym list
  wordlength = inputList[0].length;
  currentWord = "";
  if (type == "short"){
    currentWord = inputList[0];
  }
  //First, we iterate through all of the words in the given synonym list
  for ( var wordIndex3 in inputList ) {
    if( inputList[wordIndex3].length > wordlength && type=="long" ){
      if ( noMultiWords == true ) {
        //TODO
      }
      wordlength = inputList[wordIndex3].length;
      currentWord = inputList[wordIndex3];
    } else if(inputList[wordIndex3].length < wordlength && type=="short"){
      if ( noMultiWords == true ) {
        //TODO
      }
      wordlength = inputList[wordIndex3].length;
      currentWord = inputList[wordIndex3];
    }
  }
  return currentWord
}

//Generates a random number and checks if it's bigger than the threshold for pedantifying a word
function percentageCheck() {
  if (Math.round(Math.random() * 100) < percent) {
    return true;
  }
  return false;
}

//Checks if a word contains a hyphen
function isHyphenated(s) {
  // if s does not contain a '-', idexOf() will return -1
  if (s.toLowerCase().indexOf('-') >= 0) {
    return false;
  }
  return true;
}

//Returns true if the given element is found in the list
function isElementInList(e, list) {
  for ( var index in list ){
    if ( list[index] == e ) {
      return true;
    }
  }
  return false;
}

//Parses through the given text and splits into wordList and whiteSpaceList
function getWhitespaceAndWords(text) {

    var whiteSpaceList = [];
    var wordList = [];

    var currWord = false;
    for ( var charIndex in text ) {
        char = text[charIndex];
        if ( char == " " || char == "\n" || char == "\t" || char == "\r" ){
            if ( currWord == false ) {
            whiteSpaceList[whiteSpaceList.length-1] += char;
            } else {
            whiteSpaceList.push(char);
            currWord = false;
            }
        } else {
            if ( currWord == true ) {
                wordList[wordList.length-1] += char;
            } else {
                wordList.push(char);
                currWord = true;
            }
        }
    }

    return [whiteSpaceList, wordList];
}

//Handles the actual pedantification of the text
function pedantify() {

  text = text.split("");
  newText = "";

  //Parses through the given text and splits into wordList and whiteSpaceList
  r = getWhitespaceAndWords(text);
  wordList = r[1];
  whiteSpaceList = r[0];

  //Figures out if the text begins with a whitespace or a word
  if (text[0] == " ") {
    newText += " ";
  }

  wordReplacedCount = 0;
  for ( wordIndex in wordList ) {
    word = wordList[wordIndex];
    //Adds the correct whitespace to the word
    function getWord() {
      //We only care about whitespace if the word is not at the end of the text
      if (parseInt(wordIndex) + 1 < wordList.length){
        word += whiteSpaceList[wordIndex];
      }
      newText += word;
    }
    //First, we check if it is one of the words we shouldn't pedantify
      if( ignoreConjunctions == true && isElementInList(word.toLowerCase(),conjunctions) ) {
      getWord();
    } else if( ignorePronouns == true && isElementInList(word.toLowerCase(),pronouns) ) {
      getWord();
    } else if ( ignoreHyphens == true && isHyphenated(word.toLowerCase()) ) {
      getWord();
    } else if ( isElementInList(word.toLowerCase(),excludedWords) ) {
      getWord();
    } else if ( percentageCheck() == true ) {
      //First, we check for punctuation (assuming if there is punctuation it will be the last character)
      var punctuationFound = false;
      var lastChar = word.slice(-1);
      if ( isElementInList(lastChar, punctuationList) == true ) {
        //if there punctuation, we remove it
        word = word.substr(0,word.length-1);
        punctuationFound = true;
      }
      //We make the word lower-case so we can check for synonyms
      words = starterDict[word.toLowerCase()];
      if ( words == undefined ) {
        //If the word is not in dictionary, treat it like non-ped. word
        getWord();
      } else if ( words.length == 0 ) {
        //If the word is not in dictionary, but there are no synonyms, treat it like non-ped. word
        getWord();
      } else {
        //We want to set capitalization based on previous capitalization.
        var capsType = "null";
        if ( word == word.toUpperCase() ) {
          //Check for all caps
          if ( word != "I" ) {
            capsType = "all_upper";
          }
        } else if ( word == (word[0].toUpperCase() + word.slice(1,word.length)) ) {
          //Check if the first letter is capitalized - note that this could have issues with proper nouns
          //However, the amount of words capitalized because they are at the beginning of a sentence is greater
          //Than the number of words that are capitalized because proper noun AND have synonyms
          capsType = "capitalized";
        }
        if ( method == "min" ) {
          word = getLongShortWord(words, 'short');
        } else if ( method == "max" ) {
          word = getLongShortWord(words, 'long');
        } else if ( method == "random" ) {
          word = words[Math.floor(Math.random()*words.length)];
        }
        if ( noSynRep ) {
          usedWords.push(word);
        }
        wordReplacedCount += 1;
        if ( capsType == "all_upper" ) {
          word = word.toUpperCase();
        } else if ( capsType == "capitalized" ) {
          word = word[0].toUpperCase() + word.slice(1,word.length);
        }
        if ( punctuationFound ) {
          word += lastChar;
        }
        getWord();
      }
    } else {
      getWord();
    }
  }
  text_area.value = newText;
  text = newText;

  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  if ( controllerScope.textPedantified == true ) {
    controllerScope.oldMeanLength = document.getElementById('meanWordLenNew').innerHTML;
  } else {
    controllerScope.oldMeanLength = document.getElementById('meanWordLenOld').innerHTML;
    controllerScope.textPedantified = true;
  }
  controllerScope.inputText.text = text_area.value;
  controllerScope.wordsReplaced = wordReplacedCount;
}

window.onload = function () {
  init();
<<<<<<< HEAD
}
=======
}
>>>>>>> c0bbb198f80d18ab821f2b8e9b35eeaedbd028f8
