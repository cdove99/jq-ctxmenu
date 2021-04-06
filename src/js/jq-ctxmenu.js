/**
 * jQuery ctxmenu plugin.
 * Create dropdown menus with a simple initialisation!
 * Selected elements should be relatively positioned.
 * + Added `ctxmenu-shown` and `ctxmenu-closed` events.
 */
 (function($) {
    // functions to assist
    var fn = {
        // misc
        bind: function($el, evt, fn) { $el.on(evt, fn); },
        // helpers
        init: function(elem, options) {
            // Create menu elem
            if (!Array.isArray(options.items) && !$.isFunction(options.renderer)) 
                throw Error("No items or renderer given for this menu.");
            // find or create menu elem
            var menuID = (typeof options.id === 'string') ? options.id : $.ctxmenu.defaults.menuid;
            var $menu = $('#'+menuID);


            if ($menu.length === 0) {
                $menu = fn.menu(options);
                $menu.hide();
                $("body").append($menu);

                var closer = function(evt) {
                    var isElem = $(evt.target).is(elem);
                    var isItemOrMenu = $(evt.target).parents('#' + menuID).length || $(evt.target).attr('id') == menuID;
                    var inMenu = (isElem || isItemOrMenu);

                    if (!inMenu) {
                        fn.close(options);
                        $(elem).trigger('ctxmenu-closed');
                    }
                };

                $(window).off('click', closer).on('click', closer);
            }
            
            // Update menu parent styling if defined in options 
            if(options.style){
                $menu.css(options.style);
            }

            // items (if no renderer)
            if (Array.isArray(options.items) && !options.renderer) {
                $menu.find("ul").empty();

                for (var i=0; i<options.items.length; i++) {
                    var item = options.items[i];
                    $menu.find("ul").append(fn.item(
                        options,
                        item.name,
                        item.callback,
                        item.class
                    ));
                }
            }

            // open
            $(elem).data('ctxmenuid', menuID);
            fn.open(elem, $menu, options);
        },
        open: function(elem, $menu, options) {
            $menu.removeClass();  // Clear old classes
            $menu.addClass($.ctxmenu.defaults.menucls);  // Replace old class
            if (options.class) $menu.addClass(options.class);

            fn.reposition(elem, $menu, options);

            function resizer() { fn.reposition(elem, $menu, options); }
            $(window).off('resize scroll', resizer).on('resize scroll', resizer);
            // apply
            $menu.show();
            $(elem).trigger('ctxmenu-shown');
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
        close: function(options) {
            var menuID = (typeof options.id === 'string') ? options.id : $.ctxmenu.defaults.menuid;

            $('#'+menuID).hide();
        },
        forceClose: function(elem) {
            // Programmatically closing a menu
            var menuID = $(elem).data('ctxmenuid');

            $('#'+menuID).hide();
        },
        // elem construction
        menu: function(options) {
            var $menu = $("<div></div>");
            var menuID = (typeof options.id === 'string') ? options.id : $.ctxmenu.defaults.menuid;

            $menu.addClass($.ctxmenu.defaults.menucls)
            .attr('id', menuID);
            // Option list
            if ($.isFunction(options.renderer)) {
                $menu.append(options.renderer(options));
            } else {
                $menu.append("<ul></ul>");
            }
            return $menu;
        },
        item: function(options, value, callback, cls) {
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
                    fn.close(options);
            };
            fn.bind($item, "click", callAndClose);
            return $item;
        },
    };

    $.fn.ctxmenu = function(options) {  
        if (typeof options === "object" && !Array.isArray(options)) {
            // init
            return this.each(function() { 
                fn.init(this, options);
             });
        } else {
            switch (options) {
                case 'destroy':
                    return this.each(function() { fn.destroy(this); });
                case 'close':
                    return this.each(function() { fn.forceClose(this); })
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