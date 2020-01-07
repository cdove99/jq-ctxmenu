/**
 * jQuery ctxmenu plugin.
 * Create dropdown menus with a simple initialisation!
 * Selected elements should be relatively positioned.
 */
var jqctxDefaults = {
    menuid: 'jq-ctx-menu-id',
    menucls: 'jq-ctx-menu-parent',
    itemcls: 'jq-ctx-menu-item',
};

(function($) {
    // functions to assist
    var fn = {
        // misc
        bind: function($el, evt, fn) { $el.on(evt, fn); },
        // helpers
        init: function(elem, options) {
            // Create menu elem
            if (!Array.isArray(options.items)) 
                throw Error("No items given for this menu.");
            // find or create menu elem
            var $menu = $('#'+jqctxDefaults.menuid);
            if ($menu.length === 0) {
                $menu = fn.menu(options);
                $menu.hide();
                $("body").append($menu);
                $('body').on('click', function(evt) {
                    if (!$(evt.target).hasClass(jqctxDefaults.itemcls)) {
                        $menu.hide();
                    }
                });
            }
            $menu.find("ul").empty();
            // items
            for (var i=0; i<options.items.length; i++) {
                var item = options.items[i];
                $menu.find("ul").append(fn.item(
                    item.name,
                    item.callback,
                    item.class
                ));
            }
            // open
            fn.open(elem, $menu, options);
        },
        open: function(elem, $menu, options) {
            // var
            var pos = {top: 0, left: 0};
            var elemdim = null;  // Element h/w
            var _type;
            // Position math begins
            if (options.loc instanceof $.Event) {
                _type = 'evt';
                pos.left = options.loc.pageX;
                pos.top = options.loc.pageY;
            } else if (options.loc === "element" || !options.loc) {
                _type = 'elem';
                var offset = $(elem).offset();
                elemdim = {
                    height: $(elem).outerHeight(),
                    width: $(elem).outerWidth(),
                };
                pos = Object.assign(offset);
                pos.top += elemdim.height;
            }
            // Adjust for screen - vertical
            var _viewBottom = $(window).scrollTop() + $(window).height();
            var _bottom = pos.top + $menu.outerHeight();
            if (_bottom > _viewBottom) {  // off screen, flip
                pos.top -= $menu.outerHeight();
                if (_type === "elem") pos.top -= elemdim.height;
            }
            // Adjust for screen - horizontal
            var _viewLeft = $(window).scrollLeft() + $(window).width();
            var _left = pos.left + $menu.outerWidth();
            if (_left > _viewLeft) {  // off screen, flip
                pos.left -= $menu.outerWidth();
                if (_type === "elem") pos.left -= elemdim.width;
            }
            // apply
            $menu.css(pos).show();
        },
        close: function() {
            $('#'+jqctxDefaults.menuid).hide();
        },
        // elem construction
        menu: function(options) {
            var $menu = $("<div></div>");
            $menu.addClass(jqctxDefaults.menucls)
            .attr('id',jqctxDefaults.menuid);
            if (options.class) $menu.addClass(options.class);
            // Option list
            $menu.append("<ul></ul>");
            return $menu;
        },
        item: function(value, callback, cls) {
            if (!callback || !value) return;  // Cancel/ignore
            // create
            var $item = $("<li></li>");
            $item.addClass(jqctxDefaults.itemcls);
            if (cls) $item.addClass(cls);
            // value
            $item.append("<span>" + value.toString() + "</span>");
            // event
            var callAndClose = function() {
                var complete = callback();
                // Close menu if no return/truthy
                if (complete || complete === undefined) 
                    fn.close();
            };
            fn.bind($item, "click", callAndClose);
            return $item;
        },
    };

    $.fn.ctxmenu = function(options) {  
        if (typeof options === "object" && !Array.isArray(options)) {
            // init
            return this.each(function() { fn.init(this, options); });
        } else {
            switch (options) {
                case 'destroy':
                    return this.each(function() { fn.destroy(this); });
                default:
                    console.warn('Unrecognised action, ignoring.');
                    return this;
            }
        }
    };
})(jQuery);