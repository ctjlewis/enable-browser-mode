const { JSDOM } = require('jsdom');
const DOMWindow = new JSDOM('<html><body></body></html>', {
    url: "https://localhost"
}).window;

// shhh! don't tell the JSDOM team!
const window = Object.assign(global, DOMWindow);
global.window = window;

/* TESTING */
// console.log(window);
// global.testing = 29;
// console.log(window.testing);
// console.log(global.testing);
// console.log(testing);

const fs = require('fs');
window.require = function(file) {
    let contents = fs.readFileSync(file, 'utf-8');
    return (function(){
        eval.apply(this, arguments);
    }(contents));
}