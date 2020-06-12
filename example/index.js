require('..');

window.include('../test.js');
console.log("Trying globals:");
console.log(window.test1, global.test2, test3, test4);

console.log('window.addEventListener:', window.addEventListener);
console.log('document.addEventListener:', document.addEventListener);

console.log("Trying to load jQuery:");
window.include('./jquery.min.js');
console.log("PASSED JQUERY TEST:", $ === window.$ && window.$ === global.$);
// console.log('Adding event listener', DOMWindow.addEventListener('load', console.log).bind(DOMWindow));

console.log("Trying to load web-widgets...");
window.include('./widgets.cc.js');
console.log(Widget);