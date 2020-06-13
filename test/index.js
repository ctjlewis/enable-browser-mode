require('..');

window.include('test.js');
console.log("Trying globals:");
let globals = [window.test1, global.test2, test3, test4];
console.log(...globals);
console.log(globals.filter(x => x).length, "/", 4, "GLOBALS PASSED")
console.log('');

console.log('window.addEventListener:', window.addEventListener);
console.log('document.addEventListener:', document.addEventListener);
console.log('');

console.log("Trying to load jQuery:");
window.include('./jquery.min.js');
console.log("PASSED JQUERY TEST:", $ === window.$ && window.$ === global.$);
console.log('');

console.log('Adding event listener...');
window.addEventListener('load', (e) => console.log("WINDOW.LOAD:", e));
console.log('');

console.log("Trying to load web-widgets...");
window.include('./widgets.js');
console.log(Widget);
console.log('');