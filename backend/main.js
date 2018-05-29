"use strict"; 

let starterDict;
let DEBUG_MODE = false; 

//Variables necessary for pedantification
const conjunctions = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"];
const punctuationList = [".","!",",","?",":",";"];

// TODO: use this 
const pronouns_list = ["I", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "they", "what", "who", "whom", "mine", "yours", "his", "hers", "ours", "theirs", "this", "that", "these", "those", "which", "whatever", "whoever", "whomever", "whichever", "myself", "yourself", "himself", "herself", "itself", "ourselves", "themselves", "each other", "one another", "anything", "everybody", "another", "each", "few", "many", "none", "some all", "any", "anybody", "anyone", "everyone", "everything", "no one", "nobody", "nothing", "none", "other", "others", "several", "somebody", "someone", "something", "most", "enough", "little", "more", "both", "either", "neither", "one", "much", "such"];

const fs = require("fs");
const http = require("http"); 
let server; 

/**
 * Initialization procedures so the server is ready to receive 
 *  pedantification requests 
 */
function init() { 
    // using command lie argument to turn on debug mode 
    const debug_mode = process.argv[2]; 
    
    // check if the user passed in an argument  
    if (!debug_mode) { 
        // nothing to do...
    } else { 
        DEBUG_MODE = debug_mode;
    }
    
    getDictionary(); 

    makeServer(); 
}

/**
 * Sends text to STDOUT if debug mode is on
 */
function debugInfo(info) { 
  if (DEBUG_MODE) { 
    console.log(info); 
  }
}

/**
 * Listen for POST requests containing data on the correct port
 */
function makeServer() { 
  debugInfo("Setting up server...");
  server = http.createServer( function(request, reponse) {
    // store data we receive until the request is complete
    let buffer = ""; 
    
    // First, check if we got a post request
    if (request.method === "POST") { 
      // Then, get the JSON data from the request 
      // TODO: use EXPRESS instead of doing manually,
      //    and send errors if pedantification fails

      // append to the buffer every time we receive 
      // more data
      request.on('data', function(chunk) { 
        buffer += chunk; 
	      console.log(chunk); 
      });

      // once we have received all data, do the pedantification
      request.on('end', function() {
        console.log('body: ' + buffer); 
        // put in a try-catch in case of malformed JSON
        const body = JSON.parse(buffer); 
        // get all properties from body 
        let result = pedantifyCaller(body); 	
        let newText = result[0];
        let wordReplaceCount = result[1];

        response.writeHead(200, {"Content-Type": "application/json"}); 
        // Send output to client as JSON
        let returnData = JSON.stringify({
          newText: newText, 
          wordReplaceCount: wordReplaceCount          
        });
        response.write(returnData); 
        response.end(); 
      });
    }
  });

  server.listen(8080, function() { 
    debugInfo("Listening for requests on localhost port 8080..."); 
  })
}

/**
 * Takes JSON object from POST req and calls pedantify function  
 */
function pedantifyCaller(body) { 
  propertyList = ["wordList", "whiteSpaceList", "ignoreConjunctions", "ignorePronouns", "ignoreHyphens", "excludedWords", "method", "noSynRepetition"]

  for (var property in propertyList) { 
    // Check body for property
    if (body[property] === undefined) {
      // Give property the correct default value
      if (property === "wordList") { 
        body[property] = [""];
      } else if (property === "method") { 
        body[property] = "max";
      } else { 
        body[property] = false; 
      }
    }
  }
  
  return pedantify(body.wordList, body.whiteSpaceList, body.ignoreConjunctions, body.ignorePronouns, body.ignoreHyphens, body.excludedWords, body.method, body.noSynRepetition);
}

/**
 * Loading the dictionary from the server using AJAX (through jQuery) - used for debugging
 */ 
function getDictionaryAJAX() {
    if (DEBUG_MODE) { 
        console.log("Sending dictionary AJAX request...");
    }

    $.ajax({
      url:'/js/dict.js',
      success: function (data){
        console.log(data);
	// starterDict = JSON.parse(data.toString()); 
	console.log("Dictionary ready.");
      }
    });
}

/**
 * Load the dictionary by opening the file directly 
 */
function getDictionary() { 
  if (DEBUG_MODE) { 
    console.log("Beginning file read..."); 
  }

  // TODO: make synchronous (need to block program while the dictionary loads)
  fs.readFile('../js/dict.js', function(err, data) { 
    if (err) { 
      throw err; 
    } else { 
        starterDict = eval(data.toString()); 
    }
  });
}

/** 
 * Checks if a word contains a hyphen 
 */
function isHyphenated(s) {
    // if s does not contain a '-', idexOf() will return -1
    if (s.toLowerCase().indexOf('-') >= 0) {
      return false;
    }
    return true;
}

/** 
 * Generates a random number and checks if it's bigger than the threshold for pedantifying a word
 */
function percentageCheck() {
    if (Math.round(Math.random() * 100) < percent) {
      return true;
    }
    return false;
}

/** 
 * Returns true if the given element is found in the list
 */
function isElementInList(e, list) {
    for ( var index in list ){
      if ( list[index] == e ) {
        return true;
      }
    }
    return false;
}

/**
 * Gets the longest word in an array 
 */
function getLongestWord(inputList) { 
    getLongShortWord(inputList, "long"); 
} 

/**
 * Gets the shortest word in an array 
 */ 
function getShortestWord(inputList) { 
    getLongShortWord(inputList, "short"); 
} 

/**
 * Gets the shortest or longest word in an array
 */ 
function getLongShortWord(inputList, type) {
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

// TODO: remove overlap (function is on front-end and back-end)
/**
 * Parses through the given text and splits into wordList and whiteSpaceList
 */ 
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

/**
 * Main pedantify function in the website 
 */
function pedantify(wordList, whiteSpaceList, ignoreConjunctions, ignorePronouns, ignoreHyphens, excludedWords, method, noSynRepetition) {

  let newText = "";

  // Variables to keep track of metadata 
  let wordReplacedCount = 0;

  // Iterate through the list of words by index 
  for ( let wordIndex in wordList ) {
    let word = wordList[wordIndex];

    //Adds the correct whitespace to the word
    function getWord() {
      //We only care about whitespace if the word is not at the end of the text
      if (parseInt(wordIndex) + 1 < wordList.length){
        word += whiteSpaceList[wordIndex];
      }
      newText += word;
    }

    //First, we check if it is one of the words we shouldn't pedantify
    if ( ignoreConjunctions && isElementInList(word.toLowerCase(), conjunctions) ) {}
    else if ( ignorePronouns && isElementInList(word.toLowerCase(), pronouns_list) ) {}
    else if ( ignoreHyphens && isHyphenated(word.toLowerCase()) ) {}
    else if ( isElementInList(word.toLowerCase(), excludedWords) ) {}
    else if ( percentageCheck() == false ) {}
    else {
      //First, we check for punctuation (assuming if there is punctuation it will be the last character)
      let punctuationFound = false;
      let lastChar = word.slice(-1);

      //if there punctuation, we remove it
      if ( isElementInList(lastChar, punctuationList) ) {
        word = word.substr(0,word.length-1);
        punctuationFound = true;
      }

      //We make the word lower-case so we can check for synonyms
      let words = starterDict[word.toLowerCase()];

      //If the word is not in dictionary or there are no synonyms, treat it like non-ped. word
      if ( words == undefined || words.length == 0 ) {} 
      else {
        //We want to set capitalization based on previous capitalization.
        let capsType = "null";

        //Check for all caps
        if ( word == word.toUpperCase() ) {
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
          word = getShortestWord(words);
        } else if ( method == "max" ) {
          word = getLongestWord(words);
        } else if ( method == "random" ) {
          let randomIndex = Math.floor(Math.random()*words.length);
          word = words[randomIndex];
        }
        if ( noSynRepetition ) {
          usedWords.push(word);
        }
        wordReplacedCount++;
        if ( capsType == "all_upper" ) {
          word = word.toUpperCase();
        } else if ( capsType == "capitalized" ) {
          word = word[0].toUpperCase() + word.slice(1,word.length);
        }
        if ( punctuationFound ) {
          word += lastChar;
        }
      }
    }
    getWord();
  }

  return [newText, wordReplacedCount];
}

init(); 
