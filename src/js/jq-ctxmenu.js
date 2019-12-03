/**
 * jQuery ctxmenu plugin.
 * Create dropdown menus with a simple initialisation!
 */

(function($) {
    var defaults = {
        menucls: '',
        itemcls: '',
    };

    // functions to assist
    var fn = {
        // misc
        warn: function(msg) {
            if (!msg) return;
            console.warn('JQ.ctxmenu: ' + msg);
        },
        bind: function($el, evt, fn) { $el.on(evt, fn); },
        open: function() {},
        // helpers
        destroy: function(elem) {},
        getItems: function(elem) {},
        init: function(elem, options) {},
        // elem construction
        menu: function(items) {},
        item: function(value, callback, cls) {},
    };

    $.fn.ctxmenu = function(options) {
        return this.each(function() {
            if (typeof options === "object" && !Array.isArray(options)) {
                fn.init(this, options);  // init
            } else {
                switch (options) {
                    case 'destroy':
                        fn.destroy(this);
                        break;
                    case 'getitems':
                        fn.getItems(this);
                    default:
                        fn.warn("Unrecognised action, ignoring.");
                }
            }
        });
    };
})(jQuery);