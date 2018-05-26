"use strict"; 

//AngularJS for updating the metadata text at the bottom of the textArea
let myApp = angular.module('myApp', []);

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
      let numChars = 0;
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
      let numChars = 0;
      for ( var wordIndex2 in s) {
        numChars += s[wordIndex2].length;
      }
      return s ? (numChars / s.length).toFixed(2) : '0';
    }
  }
});

let currReplacement = "min"; 
let ignoreHyphenatedWordsText;
let replacementClickableText; 
let excludeConjuctionsText;
let excludePronounsText;
let oneWordSynonymsText;
let resetOptionsBtn; 
let chkConjunctions;
let redoPedantify; 
let percentReplVal; 
let noSynRepText; 
let percentReplSlider; 
let undoPedantify; 
let chkMultiWord;
let chkPronouns; 
let chkNoRepeat; 
let percRepText; 
let excludeWord; 
let chkHyphens; 
let chooseFile; 
let saveBtn; 
let submitBtn;
let text_area; 
let resetBtn; 
let randBtn; 
let minBtn; 
let maxBtn;

let method; 
 
//Initializes all variables/objects/eventlisteners when the webpage loads
function init() {
  // Assing variables to all elements used
  getElements(); 

  // Then, give them the necessary event listeners 
  addEventListeners();

  // Checking for cached data (in localStorage)
  // Try-catch necessary if user has localstorage turned off
  try {
    if (localStorage['mainText'] != undefined){
      loadLocalStorage();
    }
  }
  catch(err) {console.log(err);}

  // Does CSS style changes after loading new settings (possibly different
  // than default). 
  updateUIFromSettings(); 
}

/* ===================================
   == Helper functions for INIT     ==
   =================================== */

// Makes changes to UI based on current settings
function updateUIFromSettings() { 
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

// Assigning variables to all elements used
function getElements() { 
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
    let fileToLoad = chooseFile.files[chooseFile.files.length - 1];
    let reader = new FileReader();
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
  let controllerElement = document.querySelector('section');
  let controllerScope = angular.element(controllerElement).scope();
  //controllerScope.inputText.text = text_area.value;
  controllerScope.$apply();
}
 
/* ===================================
   == Misc Functions                ==
   =================================== */

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

// Fixes the angularJS text display when a text file is loaded
function updateTextFromFile() {
  text_area.value = text;
  let controllerElement = document.querySelector('section');
  let controllerScope = angular.element(controllerElement).scope();
  controllerScope.inputText.text = text;
  controllerScope.$apply();
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

// TODO: make object to keep track of this 
//Variables necessary for pedantification
var ignoreConjunctions = false;
var ignorePronouns = false;
var ignoreHyphens = false;
var noMultiWords = false;
var noSynRep = false;
var excludedWords = [];
var pronouns = [];
var old_text = "";
var percent = 0;
var text = "";
var usedWords = [];

//Handles calling the function necessary for pedantification
function pedantifyInit() {

  // Updates all of the settings from the UI so we are ready to pedantify
  getMiscSettings(); 
  getExcludedOptions();
  getExcludedWords();

  // Use old_text to store the text before pedantification
  old_text = text;
  pedantify();
}

// Updates the settings variables according to the UI 
function getMiscSettings() { 
  text = text_area.value;
  percent = percentReplSlider.value;
  method = currReplacement;
} 

// Uses the checkboxes in 'options' to see if pronouns, conjunctions, and hyphenated words will excluded
function getExcludedOptions() {
    ignoreConjunctions = chkConjunctions.checked;
    ignorePronouns = chkPronouns.checked;
    ignoreHyphens = chkHyphens.checked;
    noMultiWords = chkMultiWord.checked;
    noSynRep = chkNoRepeat.checked;
}

// Uses the textArea in 'options' to get a list of words to ignore in pedantification
function getExcludedWords() {
  excludedWords = getWhitespaceAndWords(excludeWord.value)[1];
}

// Parses through the given text and splits into wordList and whiteSpaceList
function getWhitespaceAndWords(text) {

    var whiteSpaceList = [];
    var wordList = [];

    var currWord = false;
    for ( var charIndex in text ) {
        let character = text[charIndex];
        if ( character == " " || character == "\n" || character == "\t" || character == "\r" ){
            if ( currWord == false ) {
            whiteSpaceList[whiteSpaceList.length-1] += character;
            } else {
            whiteSpaceList.push(character);
            currWord = false;
            }
        } else {
            if ( currWord == true ) {
                wordList[wordList.length-1] += character;
            } else {
                wordList.push(character);
                currWord = true;
            }
        }
    }

    return [whiteSpaceList, wordList];
}

// Handles the actual pedantification of the text
function pedantify() {
  // Make an array of characters from the text
  text = text.split("");

  // Parse through the given text and splits into wordList and whiteSpaceList
  let temp = getWhitespaceAndWords(text);
  let wordList = temp[1];
  let whiteSpaceList = temp[0];

  // Figure out if the text begins with a whitespace or a word
  if (text[0] == " ") {
    newText += " ";
  }

  // make AJAX call to server with callback function
  $.ajax({
    type: "POST", 
    
  });

  // Update the UI based on the pedantified text
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
}