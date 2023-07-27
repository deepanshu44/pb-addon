##  Basic Flow
-   Create html elements and add CSS to them.
-  Add event listener to body which will add  the element under pointer to the marksList when the user ctrl+clicks.
-  `li` element will be created and appended to the `ul` element if it doesn't exists.
-  `li` consist of `div`(text content) and `span`(delete button).

## Class Addon
#### constructor method
will create html elements.
the `liOrderArray` array will make sure that the elements in the list will appear in order of appearance in the webpage.
Let's say below is a part of the webpage,
1. |  1 |
2. |  2 |
3. |  3 |
4. |  4 |
5. |  5 |

if  the user clicks 1 then 2 then 5 and then 3, then we have to make sure that our addon will display list as [1,2,3,5] and not [1,2,5,3].

#### config method
will add css to the created elements and create the UI for addon.

#### addonInit method
this will add event listener to the document body and also tests whether the element you clicked already exists in `liOrderArray` and if not then it will call `addToList` method.

#### addToList method
detect whether the user pressed `ctrl+click`, and if yes then
create a`li`  element with text and delete button and append it to the list.

animation class is also attached and removed while adding and removing elements.

#### zoom method
todo for now

#### theme method
todo
