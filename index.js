const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

const { JSDOM } = require('jsdom');
const { Script } = require('vm');

/**
 * setup JSDOM window, include
 * `url` in config so localStorage
 * does not complain
 */

const DOMWindow = new JSDOM(
    '<!DOCTYPE html><html><body></body></html>',
    {
        url: "https://localhost",
        resources: 'usable',
        runScripts: 'dangerously',
        pretendToBeVisual: true
    }
).window;

for (const prop in DOMWindow) {

    const val = DOMWindow[prop];

    /**
     * iterate over `window` properties,
     * and set them on `global` if they
     * do not already exist, then
     * bind to DOMWindow.
     * 
     * shhh! don't tell the JSDOM team!
     */

    if (prop in global) continue;

    else if (typeof val === "function")
        global[prop] = val.bind(DOMWindow);

    else global[prop] = val;
}

/**
 * setup `global = window`self-reference
 */

global.window = global;

/**
 * offer for importing scripts
 * inline, in global context.
 */

window.include = function (file) {

    /**
     * handle relative filepaths
     * need to get caller function with
     * `callsite[1].getFileName()`
     */

    let stack = callsite(),
        caller = stack[1].getFileName(),
        callerDir = path.dirname(caller),
        fileName = path.resolve(callerDir, file),
        fileContents = fs.readFileSync(fileName, 'utf-8');

    /**
     * vm.Script.runInThisContext to the rescue!
     * eval() would not set lexical globals:
     * 
     * https://stackoverflow.com/questions/62335897/can-eval-be-used-to-declare-multiple-global-classes/62353952#62353952
     */

    new Script(fileContents).runInThisContext();
}