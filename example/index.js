require('../');


window.require('../test.js');
console.log("Trying globals:");
console.log(window.test1, global.test2, test3, test4);
console.log('window.addEventListener:', window.addEventListener);
console.log('document.addEventListener:', document.addEventListener);

// console.log("Trying to load jQuery:");
// window.require('./jquery.js');
// console.log($, window.$, global.$);