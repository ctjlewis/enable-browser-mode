# Enable browser mode
The goal of this package is to work as a quick-and-dirty one-liner that will allow a Node process to imitate a browser, letting you import traditional browser JS by setting the global object to `window` and binding relevant native prototype methods like `window.Event`.

```
/* [CommonJS] */
require('enable-browser-mode');
```

*- or -*

```
/* [ES6] */
import 'enable-browser-mode'
```

No variable assignment required, just call it! You can then require browser JS with:

```
include('./jquery.min.js');

// also available at window.include()
```

Which will evaluate that script in the global context. **Make sure the scripts supplied to `window.include()` are trusted.**

## Example
Won't work:

```
console.log(document.createElement('a'));

// ReferenceError: document is not defined
```

Works like a charm:

```
require('enable-browser-mode');
console.log(document.createElement('a'));

// HTMLAnchorElement {Symbol(impl): HTMLAnchorElementImpl}
```

## Use cases
By importing this package (which depends on JSDOM), we can expose the necessary globals and bind `window` as the global object, meaning we can write all of our browser-optimized (and DOM-dependent) code in a file like `browser.js` and reuse that same code in Node with `include('browser.js')` or `window.include('browser.js')`. 

The specific need for this functionality came from the `web-widgets` package, which generates widget trees using DOM operations like `document.createElement()`.  The Node runtime cannot build out this widget tree by default, as it does not have access to the `window` and `document` variables, resulting in a `ReferenceError`. 

For server-side rendering in Node, `web-widgets` builds out the widget tree on the virtual DOM and then exports it as flat HTML using the `HTMLElement.outerHTML` property; in the browser, the DOM is manipulated directly on-the-fly (i.e. with `Node.appendChild`). By simulating the browser global, we can use the exact same core library for both cases, the difference being just `Widget.render(HTMLElement)` to render into a DOM element and `Widget.export()` to dump the outerHTML.

Using `enable-browser-mode`, all that is needed to reuse original browser libraries (including jQuery, HammerJS, etc.) is creating an separate JS file for your Node logic, importing this package, and then importing your browser code:

```
require('enable-browser-mode');

window.include('browser.js');
myBrowserObject.doBrowserStuff(); 

// code like you're in the browser =)
```

 ## Unsafe Mode
By default, JSDOM is called with `runScripts: 'outside-only'`. If you need to *execute* external JS (and not just add a `<script>` element to the DOM), set `global.UNSAFE_MODE` before your `require('enable-browser-mode')` call.