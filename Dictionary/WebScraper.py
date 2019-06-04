from lxml import html
import requests

Words = "mostCommonWords.txt"

class Scrape:

    def __init__(self, number):
        self.text = ""
        self.words = []
        self.number = number
        self.dictionary = {}

    def readText(self, filename):
        files = open(filename)
        text = files.read()
        files.close()
        self.text = text
        return text

    def retrieveSynonyms(self,word):
        # proxy = {'http': 'http://102.32.3.1:8080', 'https': 'http://102.32.3.1:4444'} input: proxies = proxy
        word = word.lower()
        page = requests.get( 'http://www.thesaurus.com/browse/' + str(word) + '?s=t' )
        parsed_body = html.fromstring( page.content )
        synonyms = []
        liCount = 1
        ulCount = 1
        while True:
            tempSyn = parsed_body.xpath( "//*[@id='filters-0']/div[3]/div/ul[" + str(ulCount) + "]/li[" + str(liCount) + "]/a/span[@class='text']/text()" )
            if tempSyn == [] and ulCount < 6:
                liCount = 1
                ulCount += 1
            elif tempSyn != []:
                liCount += 1
                synonyms += tempSyn
            else:
                break
        return synonyms

    def getSynonyms(self,word):
        return self.dictionary[word]

    def format(self,dictionary):
        Output = ''
        for index in dictionary:
            #This may need another \n at the end
            Output += str(index) + ": " +  str(dictionary[index]) + "\n"
        return Output

    def save(self):
        text_file = open("DictionaryTest.txt", "w", newline='')
        text_file.write( self.format( self.dictionary ) )
        text_file.close()

    def main(self):
        self.text = self.readText(Words)
        self.words = self.text.split()
        option = input("All? ")
        if option == 'yes':
            self.number = len(self.words)
        for index in range(0, self.number + 1):
            if index % 100 == 0:
                print(index)
            currentWord = self.words[ index ]
            try:
                synonyms = self.retrieveSynonyms(currentWord)
                if currentWord in self.dictionary:
                    self.dictionary[ currentWord ] += synonyms
                else:
                    self.dictionary[ currentWord ] = []
                    self.dictionary[ currentWord ] += synonyms
            except:
                continue
        self.save()

def formatDictionary():
    ''' '''
    fileName = input('Enter the file name')
    file = open(fileName)
    text = file.read()
    file.close()

    newT = ""
    for i in range(len(text)): 
        
        if text[i] == " " and text[i+1] == " ":
            continue
        if text[i] != "\n":
            if text[i] == 'u' and text[i+1] == "'" and text[i-1] == " ": 
                continue
            if text[i] == 'u' and text[i+1] == '"' and text[i-1] == " ": 
                continue
            newT += text[i]
        if text[i] == "," and text[i-1] == "]":
            newT += "\n"
    text_file = open("DictionaryTest.txt", "w")
    text_file.write(newT)