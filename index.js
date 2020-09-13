#!/usr/bin/env node --experimental-modules
/** @license MIT */

const fs = require('fs');
const path = require('path');
const callsite = require('callsite');
const vm = require('vm');

/**
 * load `window` and `document` globals
 */

require('enable-window-document');

/**
 * iterate over `window` properties, and set them on `global` if they do not
 * already exist, then bind to DOMWindow.
 *
 * shhh! don't tell the JSDOM team!
 */

// eslint-disable-next-line guard-for-in
for (const prop in window) {
  const val = window[prop];

  if (prop in global) continue;

  else if (typeof val === 'function') {
    global[prop] = val.bind(window);
  }

  else global[prop] = val;
}

/**
 * Global non-enumerable properties.
 */
HTMLElement = window.HTMLElement.bind(window);
Event = window.Event.bind(window);
requestAnimationFrame = (fn) => setTimeout(fn, 0);
cancelAnimationFrame = (key) => clearTimeout(key);

/**
 * setup `global = window` self-reference
 */
window = global;

/**
 * offer for importing scripts inline, in global context. also assign to
 * include() for backwards compat
 *
 * @param {string} file
 */
include = includeScript = (file) => {
  /**
   * handle relative filepaths need to get caller function with
   * `callsite[1].getFileName()`
   */
  const stack = callsite();
  const caller = stack[1].getFileName();
  const callerDir = path.dirname(caller);
  const fileName = path.resolve(callerDir, file);
  const fileContents = fs.readFileSync(fileName, 'utf-8');

  /**
   * vm.Script.runInThisContext to the rescue! eval() would not set lexical
   * globals:
   *
   * https://stackoverflow.com/questions/62335897/can-eval-be-used-to-declare-multiple-global-classes/62353952#62353952
   */
  new vm.Script(fileContents).runInThisContext();
};

/**
 * Uncomment when vm.Module reaches LTS stability.
 */
// includeModule = (file) => {
//   /**
//    * Have to repeat this. Rather hacky, but whatever works.
//    */
//   const stack = callsite();
//   const caller = stack[1].getFileName();
//   const callerDir = path.dirname(caller);
//   const fileName = path.resolve(callerDir, file);
//   const fileContents = fs.readFileSync(fileName, 'utf-8');

//   console.log(vm.SourceTextModule);
//   new vm.SourceTextModule(fileContents).evaluate();
// };


// export `execute` for CLI ops in Node
module.exports = require('./bin/execute.js');
