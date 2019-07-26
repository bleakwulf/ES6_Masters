// import "readline";
const readline = require('readline');

// Note: As Proxies are an ES6 
// feature, some browsers/clients may not support it and 
// you may need to transpile using a service like babel
class Enum {  
    // The Enum class instantiates a JavaScript Proxy object.
    // Instantiating a `Proxy` object requires two parameters, 
    // a `target` object and a `handler`. We first define the handler,
    // then use the handler to instantiate a Proxy.
  
    // A proxy handler is simply an object whose properties
    // are functions which define the behavior of the proxy 
    // when an operation is performed on it. 
    
    // For enums, we need to define behavior that lets us check what enumerator
    // is being accessed and what enumerator is being set. This can be done by 
    // defining "get" and "set" traps.
    constructor(enumObj) {
        const handler = {
            get(target, name) {
                if (typeof target[name] != 'undefined') {
                    return target[name];
                }
                throw new Error(`No such enumerator: ${name}`);
            },
            set() {
                throw new Error('Cannot add/update properties on an Enum instance after it is defined')
            }
        };

        // Freeze the target object to prevent modifications
        return new Proxy(enumObj, handler);
    }
}

const textPart = new Enum({
    WORD: 'word', 
    VOWEL: 'vowel', 
    CONSONANT: 'consonant'
})

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});

const throwError = () => {
    console.log('ERROR: text must have at least 50 characters.');
};

const displayStatsMessage = (statsMessages, ...vars) => {
    return statsMessages.reduce((fullMessage, statsMessage, i) => {
        return fullMessage + vars[i - 1]  + statsMessage;
    });
}

const countTextPart = (inputText, textPartToParse) => {
    var textParts;

    switch(textPartToParse) {
        case textPart.WORD:
            // split input text with a space, then filter out empty strings 
            // (i.e., empty string values resulting from consecutive multiple spaces in input text)
            textParts = inputText.split(' ').filter((words) => words.replace(/^\s+|\s+$/g, '') !== '');
            break;

        case textPart.VOWEL:
            textParts = inputText.match(/[aeiou]/gi);
            break;

        case textPart.CONSONANT:
            textParts = inputText.match(/[bcdfghjklmnpqrstvwxyz]/gi);
            break;

        default:
            console.log(`ERROR: no process defined for text part '${textPartToParse}'.`);
            return;
    }

    !textParts 
    || (textPartToParse !== textPart.WORD && textParts.length === 0) 
    || console.log(displayStatsMessage`\tNumber of ${textPartToParse}(s) found: ${textParts.length}`)
}

const promptForInput = () => {
    rl.question(`Please enter text: \n`, (inputValue) => { 
        isValidString = (inputValue.length >= 50);

        if (isValidString) {
            countTextPart(inputValue, textPart.WORD);
            countTextPart(inputValue, textPart.VOWEL);
            countTextPart(inputValue, textPart.CONSONANT);
            return rl.close();
        }

        throwError();
        promptForInput();
    });
}

console.log('Press Ctrl + \'C\' to exit at any time')
promptForInput();
