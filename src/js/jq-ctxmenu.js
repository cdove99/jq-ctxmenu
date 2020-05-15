/**
 * jQuery ctxmenu plugin.
 * Create dropdown menus with a simple initialisation!
 * Selected elements should be relatively positioned.
 */
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
            var $menu = $('#'+$.ctxmenu.defaults.menuid);
            if ($menu.length === 0) {
                $menu = fn.menu(options);
                $menu.hide();
                $("body").append($menu);
                var closer = function(evt) {
                    var isitem = $(evt.target).hasClass($.ctxmenu.defaults.itemcls);
                    var isopener = ($(evt.target).attr("id") === $(elem).attr("id") && $(evt.target).get(0).localName === $(elem).get(0).localName);

                    if (!isitem && !isopener) {
                        fn.close();
                    }
                };
                $('body').off('click', closer).on('click', closer);
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
            $menu.removeClass();  // Clear old classes
            $menu.addClass($.ctxmenu.defaults.menucls);  // Replace old class
            if (options.class) $menu.addClass(options.class);

            fn.reposition(elem, $menu, options);

            function resizer() { fn.reposition(elem, $menu, options); }
            $(window).off('resize', resizer).on('resize', resizer);
            // apply
            $menu.show();
        },
        reposition: function(elem, $menu, options) {
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
                if (_type === "elem") pos.left += elemdim.width;
            }
            $menu.css(pos)
        },
        close: function() {
            $('#'+$.ctxmenu.defaults.menuid).hide();
        },
        // elem construction
        menu: function(options) {
            var $menu = $("<div></div>");
            $menu.addClass($.ctxmenu.defaults.menucls)
            .attr('id', $.ctxmenu.defaults.menuid);
            // Option list
            $menu.append("<ul></ul>");
            return $menu;
        },
        item: function(value, callback, cls) {
            if (!callback || !value) return;  // Cancel/ignore
            // create
            var $item = $("<li></li>");
            $item.addClass($.ctxmenu.defaults.itemcls);
            if (cls) $item.addClass(cls);
            // value
            $item.append("<span>" + value.toString() + "</span>");
            // event
            var callAndClose = function() {
                var complete = callback(this);
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
    
    $.ctxmenu = {
        defaults: {
            menuid: 'jq-ctx-menu-id',
            menucls: 'jq-ctx-menu-parent',
            itemcls: 'jq-ctx-menu-item',
        },
    };
})(jQuery);