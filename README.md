# Enable browser mode

The goal of this package is to work as a quick-and-dirty one-liner that will allow Node to import and otherwise execute traditional browser code without throwing errors.  It also sets the global object to `window`, and aims to simulate the browser as realistically as possible.

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
```

Which will evaluate that script in the global context. (**Make sure the scripts supplied to `window.include()` are trusted.**) 

## Example
Won't work:

```
console.log(document.createElement('a'));

>   ReferenceError: document is not defined
```

Works like a charm:
```
require('enable-browser-mode');
console.log(document.createElement('a'));

>   HTMLAnchorElement {Symbol(impl): HTMLAnchorElementImpl}
```

## Use cases
The specific need for this functionality came from the `web-widgets` package, which generates widget trees using DOM operations like `document.createElement()`.  The Node runtime cannot build out this widget tree by default, as it does not have access to the `window` and `document` variables, so it throws a `ReferenceError`.

By importing this package (which depends on JSDOM), we can expose the `window` and `document` globals to the whole project, meaning we can write all of our browser-optimized (and DOM-heavy) code in a file like `browser.js`, but still use that same code for server-side rendering in Node with `require('browser.js')`. 

 In Node, `web-widgets` builds out the widget tree on the virtual DOM and then exports it as flat HTML using the `Node.outerHTML` property, and in the browser, the DOM is manipulated directly on-the-fly (i.e. with `Node.appendChild`). With `enable-browser-mode`, all that is needed to reuse the original browser library is creating an separate JS file for Node, importing this package, and then importing your browser code:
 ```
 require('enable-browser-mode');
 require('browser.js');
 myBrowserObject.doBrowserStuff(); 

 // code like you're in the browser =)
 ```

 ## Unsafe Mode
By default, JSDOM is called with `runScripts: 'outside-only'`. Set `global.UNSAFE_MODE` before your `require('enable-browser-mode')` call to enable dangerous mode and execute external scripts when added to DOM.