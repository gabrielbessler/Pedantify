myApp = angular.module('myApp', []);

//AngularJS for updating the metadata text at the bottom of the textArea
myApp.controller('MainController', function($scope) {

  $scope.inputText = {text:""}
  $scope.textPedantified = false;
  $scope.oldMeanLength = 0;
  $scope.wordsReplaced = 0;

  $scope.numWords = function(text){
    //splits the text on space/tab/enter
    var s = text ? text.split(/\s+/) : 0;
    return s ? s.length : '0';
  }
  $scope.numChars = function(text){
    var s = text ? text.length : 0;
    return s;
  }
  $scope.meanWordLenBefore = function(text){
    if ($scope.textPedantified == false) {
      var s = text ? text.split(/\s+/) : 0;
      numChars = 0;
      for (wordIndex1 in s) {
        numChars += s[wordIndex1].length;
      }
      return s ? (numChars / s.length).toFixed(2) : '0';
    } else {
      return $scope.oldMeanLength;
    }
  }
  $scope.meanWordLenAfter = function(text){
    if ($scope.textPedantified == false) {
      return '0';
    } else {
      var s = text ? text.split(/\s+/) : 0;
      numChars = 0;
      for (wordIndex2 in s) {
        numChars += s[wordIndex2].length;
      }
      return s ? (numChars / s.length).toFixed(2) : '0';
    }
  }
});

currReplacement = "min";

//Initializes all variables/objects/eventlisteners when the webpage loads
function init(){
  // Assigning variables to all elements we use
  percentReplSlider = document.getElementById('slider1');
  resetOptionsBtn = document.getElementById('resetOptionsBtn');
  chkConjunctions = document.getElementById('chkConjunctions')
  percentReplVal = document.getElementById('percReplValue');
  excludeWord = document.getElementById('textArea2');
  chkPronouns = document.getElementById('chkPronouns');
  chkHyphens = document.getElementById('chkHyphens');
  chooseFile = document.getElementById('chooseFile');
  submitBtn = document.getElementById('submitBtn');
  text_area = document.getElementById('textArea1');
  saveBtn = document.getElementById('saveFileLink');
  randBtn = document.getElementById('randBtn');
  minBtn = document.getElementById('minBtn');
  maxBtn = document.getElementById('maxBtn');

  // Setting the initial value of the progress bar
  percentReplVal.innerHTML = percentReplSlider.value + "%";
  minBtn.style.color = "#e88b2e";
  addEventListeners();

  // Loading the dictionary using jQuery
  $.ajax({
    url:'http://www.pedantify.com/dict_test.js  ',
    success: function (data){
      starterDict = eval(data);
      console.log(starterDict);
      //console.log(starterDict['youth']);
    }
  });
}


//Fixes the angularJS text display when a text file is loaded
function updateText(){
  text_area.value = text;
  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  controllerScope.inputText.text = text;
  controllerScope.$apply();
}

//Adds all of the event listeners to the webpage
function addEventListeners(){
  chooseFile.onchange = function(){
    fileToLoad = chooseFile.files[chooseFile.files.length - 1];
    reader = new FileReader();
    reader.onload = function(e){
      text = reader.result;
      updateText();
      chooseFile.value = "";
    }
    reader.readAsText(fileToLoad);
  }
  percentReplSlider.addEventListener("input", function(){
    percentReplVal.innerHTML = percentReplSlider.value + "%";
  });
  resetBtn = document.getElementById("resetBtn")
  resetBtn.addEventListener("click", function(){
    var controllerElement = document.querySelector('section');
    var controllerScope = angular.element(controllerElement).scope();
    text_area.value = "";
    controllerScope.inputText.text = "";
    controllerScope.$apply();
  });
  minBtn.addEventListener('click', function(){
    currReplacement = "min";
    minBtn.style.color = "#e88b2e";
    maxBtn.style.color = "white";
    randBtn.style.color = "white";
  });
  maxBtn.addEventListener('click', function(){
    currReplacement = "max";
    maxBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    randBtn.style.color = "white";
  });
  randBtn.addEventListener('click', function(){
    currReplacement = "random";
    randBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    maxBtn.style.color = "white";
  });
  resetOptionsBtn.addEventListener('click', function(){
    selectMinButton();
    percentReplSlider.value = 50;
    percentReplVal.innerHTML = percentReplSlider.value + "%";
    excludeWord.value = "";
    chkConjunctions.checked = false, chkPronouns.checked = false, chkHyphens.checked = false;
  });
  submitBtn.addEventListener('click', function(){
    pedantifyInit();
  });
}

//Variables necessary for pedantification
var text = "";
var pronouns = [];
var conjunctions = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"];
var excludedWords = [];
var percent = 0;
var ignoreConjunctions = false;
var ignorePronouns = false;
var ignoreHyphens = false;

//Handles calling the function necessary for pedantification
function pedantifyInit() {
  text = text_area.value;
  percent = percentReplSlider.value;
  method = currReplacement;
  excludeWords();
  getExcludes();
  pedantify();
}

//Uses the checkboxes in 'options' to see if pronouns, conjunctions, and hyphenated words will excluded
function getExcludes(){
    ignoreConjunctions = chkConjunctions.checked;
    ignorePronouns = chkPronouns.checked;
    ignoreHyphens = chkHyphens.checked;
}

//Uses the textArea in 'options' to get a list of words to ignore in pedantification
function excludeWords(){
  excludedWords = [];
  currWord = false;
  //TODO: make this a function
  //Parses through text and ignores whitespace
  for (charIndex in excludeWord.value){
    char = excludeWord.value[charIndex];
    if (char == " " || char == "\n" || char == "\t" || char == "\r"){
      currWord = false;
    } else {
        if (currWord == true){
          excludedWords[excludedWords.length-1] += char;
        } else {
          excludedWords.push(char);
          currWord = true;
        }
    }
  }
}

//Gets the shortest or longest word in an array
function getLongShorttWord(inputList, type="long"){
  wordlength = inputList[0].length;
  currentWord = "";
  if (type == "short"){
    currentWord = inputList[0];
  }
  for (wordIndex3 in inputList){
    if(inputList[wordIndex3].length > wordlength && type=="long"){
      length = inputList[wordIndex3].length;
      currentWord = inputList[wordIndex3];
    } else if(inputList[wordIndex3].length < wordlength && type=="short"){
      length = inputList[wordIndex3].length;
      currentWord = inputList[wordIndex3];
    }
  }
  return currentWord
}

//Generates a random number and checks if it's bigger than the threshold for pedantifying a word
function percentageCheck(){
  if (Math.round(Math.random() * 100) < percent) {
    return true;
  } else {
    return false;
  }
}

//Returns true if the given element is found in the list
function isElementInList(e, list){
  for (index in list){
    if(list[index] == e){
      return true;
    }
  }
  return false;
}

//Handles the actual pedantification of the text
function pedantify(){
  text = text.split("");

  wordList = [];
  whiteSpaceList = [];

  //Figures out if the text begins with a whitespace or a word
  beginsWithWhitespace = false;
  if (text[0] == " "){
    whiteSpaceList[0] = "";
    beginsWithWhitespace = true;
  }

  //Parses through the given text and splits into wordList and whiteSpaceList
  currWord = false;
  for (charIndex in text){
    char = text[charIndex];
    if (char == " " || char == "\n" || char == "\t" || char == "\r"){
      if (currWord == false) {
        whiteSpaceList[whiteSpaceList.length-1] += char;
      } else {
        whiteSpaceList.push(char)
        currWord = false;
      }
    } else {
        if (currWord == true){
          wordList[wordList.length-1] += char;
        } else {

          wordList.push(char);
          currWord = true;
        }
    }
  }

  newText = "";
  wordReplacedCount = 0;
  if (beginsWithWhitespace == true){
    newText += whiteSpaceList[0];
  }
  for (wordIndex in wordList){
    word = wordList[wordIndex];
    //Adds the correct whitespace to the word
    function getWord(){
      //We only care about whitespace if the word is not at the end of the text
      if (parseInt(wordIndex) + 1 < wordList.length){
        if (beginsWithWhitespace == true){
          word += whiteSpaceList[parseInt(wordIndex)+1];
        } else {
          word += whiteSpaceList[wordIndex];
       }
      }
      newText += word;
    }
    //First, we check if it is one of the words we shouldn't pedantify
      if(ignoreConjunctions == true && isElementInList(word.toLowerCase(),conjunctions)){
      getWord();
    } else if(ignorePronouns == true && isElementInList(word.toLowerCase(),pronouns)){
      getWord();
    } else if (ignoreHyphens == true && isHyphenated(word.toLowerCase())){
      getWord();
    } else if (isElementInList(word.toLowerCase(),excludedWords)){
      getWord();
    } else if (percentageCheck() == true) {
      words = starterDict[word];
      if (words == undefined) {
        //If the word is not in dictionary, treat it like non-ped. word
        getWord();
      } else if (words.length == 0){
        getWord();
      } else {
        if (method == "min") {
          word = getLongShorttWord(words, 'short');
        } else if (method == "max") {
          word = getLongShorttWord(words, 'long');
        } else if (method == "random") {
          word = words[Math.floor(Math.random()*words.length)];
        }
        wordReplacedCount += 1;
        getWord();
      }
    } else {
      getWord();
    }
  }
  text_area.value = newText;
  text = newText;

  // TODO: Fix this
  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  if (controllerScope.textPedantified == true){
    controllerScope.oldMeanLength = document.getElementById('meanWordLen2').innerHTML;
  } else {
    controllerScope.oldMeanLength = document.getElementById('meanWordLen1').innerHTML;
    controllerScope.textPedantified = true;
  }
  controllerScope.inputText.text = text_area.value;
  controllerScope.wordsReplaced = wordReplacedCount;
}
