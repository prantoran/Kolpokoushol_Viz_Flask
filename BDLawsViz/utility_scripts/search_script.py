from pymongo import MongoClient
from nltk.stem.porter import PorterStemmer
import spacy
import itertools

nlp = spacy.load('en')

client = MongoClient('localhost', 4000)
db = client.law
bigrams = db.bigrams
trigrams = db.trigrams
stemmer = PorterStemmer()




def _search(text, only_ngram_search=True):
    # Ids
    _ids = []

    # Final search text
    ngram_search = ""

    # stemmed text
    text = nlp(u'' + text)

    # Only alphabet is real
    filtered_text = " ".join([stemmer.stem(t.lower_) for t in text if t.is_alpha])


    print(filtered_text)

    # Make a spacy doc
    text_doc = nlp(u'' + filtered_text)

    # Take word count
    word_count = text_doc.__len__()

    # DEBUG_MSG
    # print("WORD COUNT : {}".format(word_count))


    # Make ngram then search
    if (word_count > 1 and word_count < 4):
        # Splitting the keywords into separate words
        search_words = filtered_text.lower().split(' ')

        # DEBUG_MSG
        # print("SEARCH WORDS ", search_words)

        # Creating combination of n-grams
        search_combinations = ["_".join([word for word in combination]) for combination in itertools.permutations(search_words, len(search_words))]

        for combination in search_combinations:
            _ids.append(search_database(combination, ngram_search=True))


        _ids = list(set(sum(_ids, [])))

        # print("NGRAM _ ")


    if only_ngram_search == False or word_count > 3:
        all_key_search = search_database(filtered_text, ngram_search=False, delimiter=" ")

        # Concatening the list
        _ids = _ids + all_key_search

        # DEBUG_MSG
        # print("ALL KEY SEARCH: {}".format(all_key_search))

    return _ids

def search_database(text, ngram_search=True, delimiter='_'):
    _ids = []

    if ngram_search == True:
        for _id in range(1, 705):
            law_bigram = bigrams.find_one({'law_id' : _id})['text']
            law_trigram = trigrams.find_one({'law_id' : _id})['text']
            if text in law_bigram or text in law_trigram:
                _ids.append(_id)
    else:
        keywords = [stemmer.stem(key) for key in text.split(delimiter)]
        for _id in range(1, 705):
            law_bigram = bigrams.find_one({'law_id' : _id})['text']
            found_all = []
            for key in keywords:
                if key in law_bigram.split():
                    found_all.append(1)
            if sum(found_all) == len(keywords):
                _ids.append(_id)

    return _ids