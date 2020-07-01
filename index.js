const fs = require('fs');
const path = require('path');
const callsite = require('callsite');
const { Script } = require('vm');

/**
 * load `window` and `document`
 * globals
 */

require('enable-window-document');

/**
 * iterate over `window` properties,
 * and set them on `global` if they
 * do not already exist, then
 * bind to DOMWindow.
 * 
 * shhh! don't tell the JSDOM team!
 */

for (const prop in window) {
    const val = window[prop];

    if (prop in global) continue;

    else if (typeof val === "function")
        global[prop] = val.bind(window);

    else global[prop] = val;
}

/**
 * Any non-enumerable properties need
 * to be added here. must bind methods!
 */

Event = window.Event.bind(window);
requestAnimationFrame = (fn) => setTimeout(fn, 0);
cancelAnimationFrame = (key) => clearTimeout(key);

/**
 * setup `global = window` self-reference
 */

window = global;

/**
 * offer for importing scripts
 * inline, in global context.
 */

include = function (file) {

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

// export `execute` for CLI ops in Node
const execute = require('./bin/execute.js');
module.exports = execute;