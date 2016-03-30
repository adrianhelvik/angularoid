var original;

module.exports = {
    enable: function () {
        var jsdom = require('jsdom').jsdom;
        original = {};

        original.document = global.document;
        original.window = global.window;
        original.navigator = global.navigator;
        original.Node = global.Node;

        global.document = jsdom('<html><head><script></script></head><body></body></html>');
        global.window = global.document.defaultView;
        global.navigator = global.window.navigator = {};
        global.Node = window.Node;
    },
    disable: function () {
        global.document = original.document;
        global.window = original.window;
        global.navigator = original.navigator;
        global.Node = original.Node;
    },
    getWindow() {
        return global.window;
    }
};
