def main():
    ''' '''
    file = open('originalDictionary.txt')
    text = file.read()
    file.close()

    newT = ""
    for i in range(len(text)): 
        
        if text[i] == " " and text[i+1] == " ":
            continue
        if text[i] != "\n": 
            newT += text[i]
        if text[i] == "," and text[i-1] == "]":
            newT += "\n"
    text_file = open("DictionaryTest.txt", "w")
    text_file.write(newT)
