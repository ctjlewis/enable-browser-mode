const { JSDOM } = require('jsdom');
const DOMWindow = new JSDOM('<html><body></body></html>', {
    url: "https://localhost"
}).window;

// shhh! don't tell the JSDOM team!
const window = Object.assign(global, DOMWindow);

/* TESTING */
// console.log(window);
// global.testing = 29;
// console.log(window.testing);
// console.log(global.testing);
// console.log(testing);

const fs = require('fs');
function windowRequire(file) {
    let contents = fs.readFileSync(file, 'utf-8');
    return (function(){
        eval.apply(this, arguments);
    }(contents));
    // return (1,eval)(contents);
}
windowRequire('./test.js')
console.log(window.test1, global.test2, test3, test4);