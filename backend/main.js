"use strict"; 

var starterDict;

//Variables necessary for pedantification
const conjunctions = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"];
const punctuationList = [".","!",",","?",":",";"];

// TODO: use this 
const pronounts_list = ["I", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "they", "what", "who", "whom", "mine", "yours", "his", "hers", "ours", "theirs", "this", "that", "these", "those", "which", "whatever", "whoever", "whomever", "whichever", "myself", "yourself", "himself", "herself", "itself", "ourselves", "themselves", "each other", "one another", "anything", "everybody", "another", "each", "few", "many", "none", "some all", "any", "anybody", "anyone", "everyone", "everything", "no one", "nobody", "nothing", "none", "other", "others", "several", "somebody", "someone", "something", "most", "enough", "little", "more", "both", "either", "neither", "one", "much", "such"];

function init() { 
    getDictionary(); 
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

/* ===================================
   === Helper f'ns for Pedantify() ===
   =================================== */

//Checks if a word contains a hyphen
function isHyphenated(s) {
    // if s does not contain a '-', idexOf() will return -1
    if (s.toLowerCase().indexOf('-') >= 0) {
      return false;
    }
    return true;
}

//Generates a random number and checks if it's bigger than the threshold for pedantifying a word
function percentageCheck() {
    if (Math.round(Math.random() * 100) < percent) {
      return true;
    }
    return false;
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

// Gets the longest word in an array 
function getLongestWord(inputList) { 
    getLongShortWord(inputList, "long"); 
} 

// Gets the shortest word in an array 
function getShortestWord(inputList) { 
    getLongShortWord(inputList, "short"); 
} 

//Gets the shortest or longest word in an array
function getLongShortWord(inputList, type="long") {
  // We initialize the replacement word to be the first word in the synonym list
  let wordlength = inputList[0].length;
  let currentWord = inputList[0];

  //First, we iterate through all of the words in the given synonym list
  for ( let wordIndex in inputList ) {
    if( inputList[wordIndex].length > wordlength && type=="long" ){
      if ( noMultiWords == true ) {
        //TODO
      }
      wordlength = inputList[wordIndex].length;
      currentWord = inputList[wordIndex];
    } else if(inputList[wordIndex].length < wordlength && type=="short"){
      if ( noMultiWords == true ) {
        //TODO
      }
      wordlength = inputList[wordIndex].length;
      currentWord = inputList[wordIndex];
    }
  }
  return currentWord
}

init(); 