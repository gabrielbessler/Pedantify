"use strict"; 

const http = require("http");

/* ================================
   ===== BACKEND TESTS ============
   ================================ */

// a suite is a group of test cases for a specific behavior 
describe("Pedantify-Caller", function() {
    it ("correct JSON", function() {

    });
    it ("missing wordList", function() {

    });
    it ("missing method", function() {

    }); 
    it ("missing boolean properties", function() {

    }); 
    it ("not missing properties but wrong value", function() {

    }); 
    it ("missing properties & wrong values", function() {

    });
});

describe("Get-Dictionary-AJAX", function() {
    getDictionaryAJAX(); 
    it ("Check Proper Loading of Dictionary", function() {
        // Check size of dictionadry

        // Try to access word in dictionary
        
        // Try to access word not in dictionary
    }); 
});

describe("Get-Dictionary-Normal", function() {
    getDictionary(); 
    it ("Check Proper Loading of Dictionary", function() {
        // Check size of dictionadry

        // Try to access word in dictionary
    
        // Try to access word not in dictionary
    }); 
});

describe("Is-Hyphenated", function() {
    it ("give regular hyphenated word", function() {
        let word = "one-two";
        let word2 = "a-b-c";
    }); 
    
    it ("give alpha-numeric hyphenated word", function() {
        let word = "1a2-b3";
    }); 
    
    it ("regular non-hyphenated", function() {
        let word = "potato";
    }); 
    it ("alpha-numeric non-hyphenated", function() {
        let word = "2spooky4me";
    }); 
    it ("word w/ punctuation (hyphenated)", function() {
        let word = "!#@!42#$---!#@p!#";
    }); 
    it ("word w/ punctuation (non-hyphenated)", function() {
        let word = "!#@!42#$_=_!#@p!#";
    }); 
});

describe("Percentage-Check", function() {
    
    it ("Set pqerzcqent to 100, make sure nothing passes", function() {
        for (let i = 0; i < 100; i++) { 

        }
    }); 
    
    it ("Set threshold to 50, make sure ~50% of things pass", function() {
        for (let i = 0; i < 100; i++) { 

        }
    }); 
    
    it ("Set threshold to 0, make sure everything passes", function() {
        for (let i = 0; i < 100; i++) { 

        }
    }); 
});

describe("Is-Element-In-List", function() {
    it ("Several-Element List", function() {
        let L = ["a", "b", "c", "1", "2", "3", "do", 123, {'a': 1}];
        // True Case
        isElementInList("b", L);
        isElementInList("2", L);
        isElementInList({'a': 1}, L);

        // False Case
        isElementInList("cd", L);
        isElementInList("123", L);
        isElementInList({"a": 2}, L);

        // Blank Element
        isElementInList("", L)
    });
    it ("Empty List", function() {
        let L = [];
        isElementInList("1", L);
        isElementInList("", L);
    }); 
    it ("One Element List (True/False)", function() {
        let L = ["abc"];
        // True Case 
        isElementInList("abc", L);

        // False Case
        isElementInList("--==--", L);
    
    }); 

});

describe("Get-Longest-Word", function() {
    it ("Empty List", function() {

    }); 
    it ("One Element List", function() {

    }); 
    it ("Multi-Element (Beginning)", function() {

    }); 
    it ("Multi-Element (Middle)", function() {

    }); 
    it ("Multi-Element (End)", function() {

    });     
});

describe("Get-Shortest-Word", function() {
    it ("Empty List", function() {
        
    }); 
    it ("1 Element List", function() {

    }); 
    it ("Multi-Element List (First)", function() {

    }); 
    it ("Multi-Element (Middle)", function() {

    }); 
    it ("Multi-Element (End)", function() {

    }); 
});

describe("Get-WhiteSpace-and-Words", function() {
    it ("Empty String", function() {

    });
    it ("Only WhiteSpace", function() {

    }); 
    it ("No Whitespace", function() {

    }); 
    it ("regular text", function() {

    }); 
    it ("alpha-numeric + punctuation", function() {

    }); 
    it ("weird ASZCII/UTF-8", function() {

    }); 
});

describe("Pedantify", function() {

});

/* ================================
   ===== FRONTEND TESTS ============
   ================================ */

describe("Update-Text-From-File", function(){

});

describe("Pedantify", function() {

});

describe("Local-Storage", function() {

}); 