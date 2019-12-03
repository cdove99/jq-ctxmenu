# jq-ctxmenu

jQuery context menu / dropdown menus  
Basically made a jQuery plugin to create some menus. Just because.  

## Usage  

Initialise a dropdown with `$('.selector').ctxmenu(options);`  
`options` can be a string or object, depending on purpose.  

## Options object  

Used for initialisation.  
Keys can include:  

- `items`: *IMPORTANT* An Array of objects to use as menu items. Each object MUST contain the keys `name` and `callback`. `name` will be displayed in menu, `callback` is an event that fires when the option is selected. `class` can also be given, and this is applied to the `span` element which holds the `name` string on display. Using this, you can apply special effects or displays to individual menu items, such as icons within the `:before / :after` pseudo element(s).  
- `class`: *Optional* String class name to apply to the menu for optional additional styling.  
- `location`: *default: event* String to determine what the menu is appearing relative to. Either `event` (defaults to this if not given), or `element` to place it relative to the element.

## Option strings

The current option strings that can be used are:  

- `destroy`: Remove the menu for the given element.
- `getitems`: Get an Array containing the String named items of the list.
