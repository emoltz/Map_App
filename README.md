![](images/logo_black.png)
# WalkPal

Simple geo/map app for javascript practice. https://emoltz.github.io/WalkPal/

## Blog
### Up to June 19, 2022
<p>
This is an exercise in using Javascript to manipulate HTML to get dynamic website pages.

Currently, I am using the Leaflet Library to render the map, and then using those pre-built objects to link to my back-end.
</p>
<p>
The back-end consists of objects that take input data from the user and use it to put pins on the map and calculate other useful data.
</p>
<p>
Scope has currently been my challenge -- I started with a much narrower idea of how things would work in the back end and then had to refactor the code into appropriate classes, which broke some things. So I am working on fixing those loose ends now.
I'm still refactoring everything to make sure everything is very organized and neat.</p>

### June 20, 2022

Working on adding functionality that, when the map is clicked, more DOM manipulation happens and adds more walks to the left hand side column. I'm just using "cycling" and "running" as placeholders for now, since I am following along with a tutorial for this part, but I will refactor it later.
ThiS is the point where my C++ education fails me: Javascript doesn't support abstract classes, so I am nervous that the inheritance I am attempting to do won't quite work. But I'm positive that it *can* work, it may not be in the way I think. 

### June 21, 2022

* Having an issue with string literals in Javascript... but it's due to my futzing around with the CSS class names and variable names. Should be all figured out now.
* Now the default class constructor includes the calculation of the current time from the `_date` member variable. 
* Saving a few things for later: namely, how the popups will look. 

### June 22, 2022
* Mostly done... I wanted to some more with it but I think I've learned what I needed to learn to move on. I will return to this at some point to polish it a bit if needed. 
* I also added local storage functionality. 