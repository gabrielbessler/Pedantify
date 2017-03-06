myApp = angular.module('myApp', []);

myApp.controller('MainController', function($scope) {
  $scope.testmsg = function(text){
    var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
    return s ? s.length : '0';
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
  submitBtn = document.getElementById('submitBtn');
  text_area = document.getElementById('textArea1');
  randBtn = document.getElementById('randBtn');
  minBtn = document.getElementById('minBtn');
  maxBtn = document.getElementById('maxBtn');


  // Setting the initial value of the progress bar
  percentReplVal.innerHTML = percentReplSlider.value + "%";

  minBtn.style.color = "#e88b2e";

  addEventListeners();
}

function addEventListeners(){
  percentReplSlider.addEventListener("input", function(){
    percentReplVal.innerHTML = percentReplSlider.value + "%";
  });

  resetBtn = document.getElementById("resetBtn")
  resetBtn.addEventListener("click", function(){
    text_area.value = "";
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
    startPedantify();
  });
}

function selectMinButton()
{
  minBtn.style.color = "#e88b2e";
  maxBtn.style.color = "white";
  randBtn.style.color = "white";
  currReplacement = "min";
}

///////// Pedantify code here


outputFile = false;
hyphenatedWords = false;

name = "testname"
text = "ASD asd sasd";
meanLength = 0;
textLength = 0;
wordsReplaced = 0;
pronouns = [];
properNouns = [];
articles = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"];
excludedWords = [];
percent = 0;
swappingMethod = "random";

function startPedantify() {
  main();
}

function main() {
  text = text_area.value;
  updateAll();
  percentageSwap();
  excludeWords();
  swapMethod();
  pedantify();
}

function getResults(){
      representation = "File name: " + name + "\n";
      representation += "Mean word length: " + meanLength + "\n";
      representation += "Number of words in text: " + textLength + "\n";
      representation += "Number of words replaced: " + wordsReplaced + "\n";
      //representation += "Number of excluded words: " + str( len(pronouns) + len(properNouns) + len(articles) + len(excludedWords)) + "\n";
      representation += "Percentage of words replaced: " + percent + "\n";
      representation += "Word swapping method: " + swappingMethod + "\n";
      return representation
}

function textWordLength(){
  textLength = text.split(" ").length;
}

function excludeWords(){
  excludedWords = excludeWord.value.split(" ");
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
  self.textWordLength();
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
  words_mainText = text.split(" ");
  newText = "";
  count = 0;
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
      newText += newWord + " ";
    } else {
      newText += word + " ";
    }
  }
  text_area.value = newText;
  wordsReplaced = count;
  text = newText;
  updateAll();
  if (outputFile == true){

  }
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
