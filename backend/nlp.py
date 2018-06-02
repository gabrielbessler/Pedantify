import nltk
from nltk import sent_tokenize, word_tokenize

def get_part_of_speec(text): 
    # Split the text into sentences 
    sentence_list = sent_tokenize(text)

    # Results 
    results = [] 

    for sentence in sentence_list: 
        words = word_tokenize(sentence) 
        tagged_words = nltk.pos_tag(words) 
        results += [tag[1] for tag in tagged_words]

    return results
    