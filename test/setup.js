const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(`
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <div id="test"></div>
        <div id="test-1"></div>
        <div id="test-2"></div>

    </body>
</html>
`);
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.jsdom = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);
