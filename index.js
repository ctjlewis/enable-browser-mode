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

// shhh! don't tell the JSDOM team!

for (let property in DOMWindow)
    global[property] = DOMWindow[property];

window = global;

let DEBUG = true;

// offer window.require for importing
// browser JS
window.require = function(file) {

    let stack = callsite(),
        caller = stack[1].getFileName(),
        callerDir = path.dirname(caller),
        fileName = path.resolve(callerDir, file),
        fileContents = fs.readFileSync(fileName, 'utf-8');

    if(DEBUG)
        console.log({ caller, callerDir, fileName });
        
    return (function(){
        eval.apply(this, arguments);
    }(fileContents));

}

/* TESTING */
if (DEBUG) {
    testing = "TESTS PASSED";
    console.log("1/3", window.testing);
    console.log("2/3", global.testing);
    console.log("3/3", testing);
}