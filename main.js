myApp = angular.module('myApp', []);

myApp.controller('MainController', function($scope) {

  $scope.inputText = {text:""}
  $scope.textPedantified = false;
  $scope.oldMeanLength = 0;
  $scope.wordsReplaced = 0;

  $scope.testmsg = function(text){

    var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
    return s ? s.length : '0';
  }
  $scope.testmsg2 = function(text){
    var s = text ? text.length : 0;
    return s;
  }
  $scope.testmsg3 = function(text){
    if ($scope.textPedantified == false) {
      var s = text ? text.split(/\s+/) : 0;
      numChars = 0;
      for (wordIndex in s) {
        numChars += s[wordIndex].length;
      }
      return s ? (numChars / s.length).toFixed(2) : '0';
    } else {
      return $scope.oldMeanLength;
    }
  }
  $scope.testmsg4 = function(text){
    if ($scope.textPedantified == false) {
      return '0';
    } else {
      var s = text ? text.split(/\s+/) : 0;
      numChars = 0;
      for (wordIndex in s) {
        numChars += s[wordIndex].length;
      }
      return s ? (numChars / s.length).toFixed(2) : '0';
    }
  }
});

currReplacement = "min";

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
}

function updateText(){

  text_area.value = text;
  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  controllerScope.inputText.text = text;
  controllerScope.$apply();
}

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
    selectMinButton();
  });
  maxBtn.addEventListener('click', function(){
    maxBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    randBtn.style.color = "white";
    currReplacement = "max";
  });
  randBtn.addEventListener('click', function(){
    randBtn.style.color = "#e88b2e";
    minBtn.style.color = "white";
    maxBtn.style.color = "white";
    currReplacement = "random";
  });
  resetOptionsBtn.addEventListener('click', function(){
    selectMinButton();
    percentReplSlider.value = 50;
    percentReplVal.innerHTML = percentReplSlider.value + "%";
    excludeWord.value = "";
    chkConjunctions.checked = false;
    chkPronouns.checked = false;
    chkHyphens.checked = false;
  });
  submitBtn.addEventListener('click', function(){
    main();
  });
}

function selectMinButton(){
  minBtn.style.color = "#e88b2e";
  maxBtn.style.color = "white";
  randBtn.style.color = "white";
  currReplacement = "min";
}

hyphenatedWords = false;
text = "";
meanLength = 0;
wordsReplaced = 0;
pronouns = [];
properNouns = [];
articles = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"];
excludedWords = [];
percent = 0;
swappingMethod = "random";

function main() {
  text = text_area.value;
  updateAll();
  percentageSwap();
  excludeWords();
  swapMethod();
  pedantify();
}

function excludeWords(){
  //excludedWords = excludeWord.value.split(" ");
  excludedWords = [];
  currWord = false;
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
  console.log(excludedWords);
}

function swapMethod(){
  method = currReplacement;
}

function percentageSwap(){
  percent = percentReplSlider.value;
}

function averageLength(){
  partialSum = 0;
  words_mainText = text.split(" ");
  for (wordIndex in words_mainText) {
    partialSum += words_mainText[wordIndex].length;
  }
  meanLength = (partialSum / words_mainText.length).toFixed(2);
}

function longestWord(inputList){
  wordlength = inputList[0].length;
  currentWord = "";

  for (wordIndex in inputList){
    if(inputList[wordIndex].length > wordlength){
    length = inputList[wordIndex].length;
      currentWord = inputList[wordIndex];
    }
  }
  return currentWord
}

function shortestWord(inputList){
  wordlength = inputList[0].length;
  currentWord = "";

  for (wordIndex in inputList){
    if(inputList[wordIndex].length < wordlength){
    length = inputList[wordIndex].length;
      currentWord = inputList[wordIndex];
    }
  }
  return currentWord
}

function percentageCheck(){
  if (Math.round(Math.random() * 100) < percent) {
    return true;
  } else {
    return false;
  }
}

function updateAll() {
  self.averageLength();
}

function getIndex(string, character){
  count = 0;
  for (charIndex in string){
    if (string[charIndex] == character){
      return charIndex;
    }
  }
}

function pedantify(){
  text = text.split("");

  currWord = false;
  wordList = [];
  whiteSpaceList = [];
  beginsWithWhitespace = false;
  if (text[0] == " "){
    whiteSpaceList[0] = "";
    beginsWithWhitespace = true;
  }
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
  words_mainText = wordList;
  newText = "";
  count = 0;
  if (beginsWithWhitespace == true){
    newText += whiteSpaceList[0];
  }
  for (wordIndex in words_mainText){
    word = words_mainText[wordIndex];
    if (percentageCheck() == true) {
      if (method == "min") {
        newWord = 'sampleText';
      }
      if (method == "max") {
        newWord = 'max';
      }
      if (method == "random") {
        newWord = 'random';
      }
      count += 1;
      if (parseInt(wordIndex) + 1 < words_mainText.length){
        if (beginsWithWhitespace == true){
          newWord += whiteSpaceList[parseInt(wordIndex)+1];
        } else {
          newWord += whiteSpaceList[wordIndex];
        }
      }
      newText += newWord;
    } else {
      if (parseInt(wordIndex) + 1 < words_mainText.length){
        if (beginsWithWhitespace == true){
          word += whiteSpaceList[parseInt(wordIndex)+1];
        } else {
          word += whiteSpaceList[wordIndex];
        }
      }
      newText += word;
    }
  }
  text_area.value = newText;
  wordsReplaced = count;
  text = newText;
  updateAll();

  // TODO: Fix these shenanigans
  var controllerElement = document.querySelector('section');
  var controllerScope = angular.element(controllerElement).scope();
  if (controllerScope.textPedantified == true){
    controllerScope.oldMeanLength = document.getElementById('test2').innerHTML;
  } else {
    controllerScope.oldMeanLength = document.getElementById('test1').innerHTML;
    controllerScope.textPedantified = true;
  }
  controllerScope.inputText.text = text_area.value;
  controllerScope.wordsReplaced = wordsReplaced;
}
/*
        if word.lower() in self.pronouns:
            newText += ( word + " " )
        elif word.lower() in self.properNouns:
            newText += ( word + " " )
        elif word.lower() in self.articles:
            newText += ( word + " " )
        elif word.lower() in self.excludedWords:
            newText += ( word + " " )

            try:
                wordList = dictionary.synonym( word )
                self.shortestWord(wordList)
                self.longestWord(wordList)
                random.choice(wordList)

                if word[0] == word[0].upper():
                    newText += ( newWord[0].upper() + newWord[1:] + " " )
                elif word[-1] in '.,;?!:':
                    string = '.,;?!:'
                    indexNumber = self.getIndex(string, word[-1])
                    newText += ( newWord + string[indexNumber] + " " )
                #elif " ' "  in word:
                #   newText += ( word + " " )
                elif word.lower() == word:
                    newText += ( newWord + " " )

            except:
                newText += ( word + " " )
*/
