const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

/**
 * setup JSDOM window, include
 * url in config so localStorage
 * does not complain
 */
const { JSDOM } = require('jsdom');
const DOMWindow = new JSDOM(
    '<!DOCTYPE html><html><body></body></html>',
    {
        url: "https://localhost",
        pretendToBeVisual: true
    }
).window;

const nativeEval = global.eval;

/**
 * shhhh! don't tell the JSDOM team!
 */
for (let prop in DOMWindow) {
    let val = DOMWindow[prop];
    global[prop] = (typeof val === "function")
        ? val.bind(DOMWindow)
        : val;
}

/**
 * setup global = window self-reference
 */
global.window = global;
global.nativeEval = nativeEval;

let DEBUG = false;

/**
 * offer include() for importing scripts
 * inline, in global context
 */

window.include = function(file) {

    /**
     * handle relative filepaths
     * need to get caller function with
     * callsite[1].getFileName()
     */

    let stack = callsite(),
        caller = stack[1].getFileName(),
        callerDir = path.dirname(caller),
        fileName = path.resolve(callerDir, file),
        fileContents = fs.readFileSync(fileName, 'utf-8');

    if(DEBUG)
        console.log("WINDOW.INCLUDE:", { caller, callerDir, fileName });
        
    /**
     * Use NodeJS eval() to execute
     * given script in global context
     */

    return (function(){
        nativeEval.apply(this, arguments);
    }(fileContents));

}

if (DEBUG) {
    testing = "TESTS PASSED";
    console.log("1/3", window.testing);
    console.log("2/3", global.testing);
    console.log("3/3", testing);
}