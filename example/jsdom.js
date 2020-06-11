const { JSDOM } = require('jsdom');
const DOMWindow = new JSDOM(
    '<!DOCTYPE html><html><body></body></html>',
    {
        url: "https://localhost",
        pretendToBeVisual: true
    }
).window;

console.log(DOMWindow.addEventListener)