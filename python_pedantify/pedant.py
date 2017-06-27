# Support pin for GoDaddy: 3145
# Pedantify python code -- by Matthew Fox and Gabe Bessler

import random
from PyDictionary import PyDictionary
dictionary = PyDictionary

outputFile = True
hyphenatedWords = True

class Pedantify:

    def __init__(self, filename):
        self.name = str(filename)
        self.text = ""
        self.meanLength = 0
        self.textLength = 0
        self.wordsReplaced = 0
        self.pronouns = []
        self.properNouns = []
        self.articles = ["a", "and", "this", "that", "like", "no", "yes", "the", "okay", "is", "in", "at", "why", "not", "be", "for"]
        self.excludedWords = []
        self.percentage = 0
        self.swappingMethod = "random"

    def __repr__(self):
        representation = "File name: " + str(self.name) + "\n"
        representation += "Mean word length: " + str(self.meanLength) + "\n"
        representation += "Number of words in text: " + str( self.textLength ) + "\n"
        representation += "Number of words replaced: " + str(self.wordsReplaced) + "\n"
        representation += "Number of excluded words: " + str( len(self.pronouns) + len(self.properNouns) + len(self.articles) + len(self.excludedWords)) + "\n"
        representation += "Percantage of words replaced: " + str(self.percentage) + "\n"
        representation += "Word swapping method: " + str(self.swappingMethod) + "\n"
        return representation

    def readText(self, filename):
        mainFile = open(filename)
        text = mainFile.read()
        mainFile.close()
        if filename == self.name:
            self.text = text
        else:
            return text

    def saveAs_txt(self):
        textFile = open("PedantifiedText.txt", "w", newline='')
        textFile.write(self.text)
        textFile.close()

    def textWordLength(self):
        wordList = self.text.split()
        self.textLength = len(wordList)

    def getPronouns(self):
        pass

    def getProperNouns(self):
        pass

    def getArticles(self):
        pass

    def excludeWords(self):
        excludeList = []
        while True:
            inputWord = input("What words should I exclude in this pedantification? ")
            if len(inputWord) > 0 :
                excludeList += str( inputWord )
            else:
                break
        self.excludedList = list(excludeList)

    def swapMethod(self):
        method = input("What method of swapping should I use? ")
        if method.lower() == "random":
            self.swapMethod == "random"
        elif method.lower() == "short":
            self.swapmethod == "short"
        else:
            self.swapMethod == "long"

    def percentageSwap(self):
        percent = input("What percentage should be changed? ")
        self.percentage = int(percent)

    def averageLength(self):
        partialSum = 0
        words_mainText = self.text.split()
        for word in words_mainText:
            partialSum += len(word)
        self.meanLength = round(partialSum / len(words_mainText), 2)

    def longestWord(self, inputList):
        length = len(inputList[0])
        currentWord = ""
        for word in inputList:
            if len(word) > length:
                length = len(word)
                currentWord = word
        return currentWord

    def shortestWord(self, inputList):
        length = len(inputList[0])
        currentWord = ""
        for word in inputList:
            if len(word) < length:
                length = len(word)
                currentWord = word
        return currentWord

    def percentageCheck(self):
        if random.choice( range(0,100) ) < self.percentage:
            return True
        else:
            return False

    def updateAll(self):
        self.averageLength()
        self.textWordLength()
        self.pronouns = self.readText("pronouns.txt").split()

    def repetitionCheck(self, word, list):
        ''' Checks to see if the synonym of a particular word includes the word itself. For instance, a synonym of "not" is "not at all". Here, "not" would not change.
        '''
        pass

    def getIndex(self, string, character):
        count = 0
        for count in len(string):
            if string[count] == character:
                return count
            count += 1

    def pedantify(self):
        words_mainText = self.text.split()
        newText = ""
        count = 0
        for word in words_mainText:
            if word.lower() in self.pronouns:
                newText += ( word + " " )
            elif word.lower() in self.properNouns:
                newText += ( word + " " )
            elif word.lower() in self.articles:
                newText += ( word + " " )
            elif word.lower() in self.excludedWords:
                newText += ( word + " " )
            elif self.percentageCheck() == True:
                try:
                    wordList = dictionary.synonym( word )
                    if self.swapMethod == "short":
                        newWord = self.shortestWord(wordList)
                    elif self.swapMethod == "long":
                        newWord = self.longestWord(wordList)
                    else:
                        newWord = random.choice(wordList)

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

                    count += 1
                except:
                    newText += ( word + " " )
            else:
                newText += ( word + " " )
        self.wordsReplaced = count
        self.text = newText
        self.updateAll()
        if outputFile == True:
            self.saveAs_txt()

    def main(self):
        self.readText(self.name)
        self.updateAll()
        userInput = input("Pedantify? ")
        if userInput.lower() == "yes":
            self.percentageSwap()
            self.excludeWords()
            self.swapMethod()
            self.pedantify()
