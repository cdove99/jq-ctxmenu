# jq-ctxmenu

jQuery context menu / dropdown menus  
Basically made a jQuery plugin to create some right-click menus.  

## Usage  

Initialise a dropdown with: `$('.selector').ctxmenu(options);`  
`options` should be an object.  

Example:  

```javascript
    $('#menu').ctxmenu({
        class: 'mymenu',
        items: [
            {
                name: 'About',
                callback: function() {
                    alert('This is an alert dialog!');
                },
                class: 'about-item',
            }
        ],
    });
```  

The menu should adjust on open in case it falls out of the window.  

## Options object  

Used for initialisation.  
Keys can include:  

- `items`: *IMPORTANT* An Array of objects to use as menu items. Each object MUST contain the keys `name` and `callback`. `name` will be displayed in menu, `callback` is an event that fires when the option is selected. `class` can also be given, and this is applied to the `span` element which holds the `name` string on display. Using this, you can apply special effects or displays to individual menu items, such as icons within the `:before / :after` pseudo element(s).  
- `class`: *Optional* String class name to apply to the menu for optional additional styling.  
- `loc`: *default: "element"* Either an `Event` object, or a String as  `"element"` (defaults to this if not given) to place it relative to the element.

## Future Ideas/Improvements  

- Nested lists/options?
