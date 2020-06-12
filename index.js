const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

const { JSDOM } = require('jsdom');
const DOMWindow = new JSDOM(
    '<!DOCTYPE html><html><body></body></html>',
    {
        url: "https://localhost",
        pretendToBeVisual: true
    }
).window;

const nativeEval = global.eval;

// shhh! don't tell the JSDOM team!
for (let prop in DOMWindow) {
    let val = DOMWindow[prop];
    
    global[prop] = (typeof val === "function")
        ? val.bind(DOMWindow)
        : val;
}

global.window = global;
global.nativeEval = nativeEval;

let DEBUG = false;

// offer window.require for iporting
// browser JS
window.include = function(file) {

    let stack = callsite(),
        caller = stack[1].getFileName(),
        callerDir = path.dirname(caller),
        fileName = path.resolve(callerDir, file),
        fileContents = fs.readFileSync(fileName, 'utf-8');

    if(DEBUG)
        console.log("WINDOW.REQUIRE:", { caller, callerDir, fileName });
        
    return (function(){
        nativeEval.apply(this, arguments);
    }(fileContents));

}

/* TESTING */
if (DEBUG) {
    testing = "TESTS PASSED";
    console.log("1/3", window.testing);
    console.log("2/3", global.testing);
    console.log("3/3", testing);
}