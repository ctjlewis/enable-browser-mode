// TODO: Custom class additions for style groups

let WIDGETS_DEBUG = false,
    LOAD_START = Date.now();

if (WIDGETS_DEBUG)
    document.addEventListener("readystatechange", (event) => {
        console.log(Date.now() - LOAD_START + "ms", document.readyState);
    });

class Widget {

    constructor(...children) {

        this.tag = 'div';
        this.classes = ['web-widget'];
        this.styles = [];
        this.attributes = {};

        this.children = children;
        this.element = null;
    }

    addClass(...args) {
        if (WIDGETS_DEBUG) console.log('CALLED addClass() with', args);
        this.classes.push(...args);
        return this;
    }

    addStyle(style, val) {
        if (WIDGETS_DEBUG) console.log('CALLED addStyle() with', style, val);
        this.styles[style] = val;
        return this;
    }

    append(child) {
        if (WIDGETS_DEBUG) console.log('CALLED append() with', child);
        this.element.appendChild(child.element);
        return this;
    }

    applyAttribute(attr, val) {
        if (WIDGETS_DEBUG) console.log('CALLED applyAttribute() with', attr, val);
        this.element.setAttribute(attr, val);
        return this;
    }

    applyAttributes() {
        if (WIDGETS_DEBUG) console.log('CALLED applyAttributes()');

        for (let [attr, val] of Object.entries(this.attributes))
            this.applyAttribute(attr, val);

        return this;
    }

    applyClass(className) {
        if (WIDGETS_DEBUG) console.log('CALLED applyClass() with', className);
        this.element.classList.add(className);
        return this;
    }

    applyClasses() {
        if (WIDGETS_DEBUG) console.log('CALLED applyClasses()');

        for (let className of this.classes)
            this.applyClass(className);

        return this;
    }

    applyStyle(style, val) {
        if (WIDGETS_DEBUG) console.log('CALLED applyStyle() with', style, val);
        this.element.style[style] = val;
        return this;
    }

    applyStyles() {
        if (WIDGETS_DEBUG) console.log('CALLED applyStyles()');

        for (let [style, val] of Object.entries(this.styles))
            this.applyStyle(style, val);

        return this;
    }

    build() {

        if (WIDGETS_DEBUG) console.log("\n\nBUILDING", this);

        this.setElement()
            .applyAttributes()
            .applyClasses()
            .applyStyles();

        if (!this.children.length) return this;
        else for (let child of this.children) {

            let built;

            if (typeof child === "string")
                built = new TextNode(child).build();

            else if (child instanceof Widget)
                built = child.build();

            else throw new Error('Child of type [${typeof child}] could not be added to tree. Got: ${child}');

            if (WIDGETS_DEBUG) console.log("APPENDING", built);
            this.append(built), built.clearMemory();

        }

        return this;
    }

    clearChildren() {

        if (WIDGETS_DEBUG) console.log('CALLED clearChildren()');
        if (!this.children.length) return this;

        for (let child of this.children)
            child.clearMemory();

        return this;
    }

    clearElement() {

        if (WIDGETS_DEBUG) console.log('CALLED clearElement()');
        if (!this.element) return this;

        this.element.remove();
        this.element = null;

        return this;
    }

    clearMemory() {

        delete this.element;
        delete this.children;
        delete this.attributes;

        return this;
    }

    setAttribute(prop, val) {
        if (WIDGETS_DEBUG) console.log('CALLED setAttribute() with', prop, val);
        this.attributes[prop] = val;
        return this;
    }

    setChildren(children) {
        if (WIDGETS_DEBUG) console.log('CALLED setChildren() with', children);
        this.children = children;
        return this;
    }

    setElement() {
        if (WIDGETS_DEBUG) console.log('CALLED setElement() with', this.tag);

        this.clearElement();
        this.element = document.createElement(this.tag);
        return this;
    }

    setId(id) {
        if (WIDGETS_DEBUG) console.log('CALLED setId() with', id);
        return this.setAttribute('id', id);
    }

    setTextNode(text) {
        if (WIDGETS_DEBUG) console.log('CALLED setTextNode()', 'with', text);

        this.clearElement();
        this.element = document.createTextNode(text);
        return this;
    }

    render(target) {

        this.build();

        if (WIDGETS_DEBUG) console.log("RENDERED", this.element);
        target.replaceWith(this.element);
        return this;

    }

    export() {
        return this.element.outerHTML;
    }
}

class TextNode extends Widget {
    constructor(text) {
        super();
        this.text = text;
    }

    build() {
        return this.setTextNode(this.text);
    }
}

/*
    Custom Widgets.

    Override element tag in constructor,
    or set 'tag' field.
*/

/*

    TC39 needs to be accepted and/or
    Closure Compiler workaround for form:

    class Heading1 extends Widget {
        tag = 'h1';
    }

*/

class Heading1 extends Widget {
    constructor(...children) {
        super(...children);
        this.tag = "h1";
    }
}

class Heading2 extends Widget {
    constructor(...children) {
        super(...children);
        this.tag = "h2";
    }
}

/*
    Flex Descendants.
*/

class Flex extends Widget {
    constructor(...children) {
        super(...children);
        this.flex = 1;
        this.addClass('flex');
    }

    setFlex(flex = 1) {
        this.flex = flex;
        this.addClass('flex-' + this.flex);
        return this;
    }
}

class Expanded extends Widget {
    constructor(...children) {
        super(...children).addClass('expanded');
    }
}

class Container extends Expanded { }

class Centered extends Expanded {
    constructor(...children) {
        super(...children).addClass('layout-center');
    }
}

class Column extends Expanded {
    constructor(...children) {
        super(...children).addClass("layout-column");
    }
}

class Row extends Expanded {
    constructor(...children) {
        super(...children).addClass("layout-row");
    }
}

class VerticalLayout extends Column {
    constructor(...children) {
        super(...children);
        for (let child of this.children)
            child.addClass("expanded", "layout-center", "flex-1");
    }
}

class HorizontalLayout extends Row {
    constructor(...children) {
        super(...children);
        for (let child of this.children)
            child.addClass("expanded", "layout-center", "flex-1");
    }
}

class Slide extends Expanded {
    constructor(...children) {
        super(...children).addClass("layout-bg", "example-bg");
    }
}

class Card extends Flex {
    constructor(...children) {
        super(...children).addClass("layout-card");
    }
}

class CenteredCard extends Card {
    constructor(...children) {
        super(...children).addClass("layout-center");
    }
}

class CenteredHeading1 extends Heading1 {
    constructor(...children) {
        super(...children).addClass("expanded", "layout-center");
    }
}

class CenteredHeading2 extends Heading1 {
    constructor(...children) {
        super(...children).addClass("expanded", "layout-center");
    }
}

function Render(STACK) {

    let FRAMES = 0,
        FRAME_COUNT = STACK.length;

    window.requestAnimationFrame(function loop() {
        if (FRAMES >= FRAME_COUNT) return;

        document.body.appendChild(STACK[FRAMES++].render());
        window.requestAnimationFrame(loop);
    });

    console.log("Full rollout took", Date.now() - LOAD_START, "ms");
    return true;
}