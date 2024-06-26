/**
 * Basic flow:
 * - create elements and add CSS to them
 * - add event listener to body which will
 *   add particular element to the list when the user will click
 * - li element will be created when the user will click
 *   and added to ul if ul doesn't have it
 */

class Addon {
    constructor() {
        //this will contain your marked items
        this.marksList = document.createElement("div");
        this.ul = document.createElement("ul");
        // css added with stylesheet
        this.style_main = document.createElement("link");
        //required to keep the items in order of appearance in the document
        this.liOrderArray = [];
        //todo add zoom
        this.factor = 0;
        this.size = document.body.scrollHeight;
    }
    config() {
        this.marksList.setAttribute("class", "ff-addon1");
	// check if user on mobile
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
	if(navigator.maxTouchPoints>0){
	    this.marksList.innerHTML = "<div class=\"ff-addon-info\">Drag pin<span></span><button class=\"ff-addon-button\">clear</button</div>"
	}else {
	    this.marksList.innerHTML = "<div class=\"ff-addon-info\">Ctrl + L<span>\u{1F5B0}</span><button class=\"ff-addon-button\">clear</button</div>"
	}
        // hide initially
        // this.marksList.style.display = "none";
        this.style_main.rel = "stylesheet";
        this.style_main.href = browser.runtime.getURL("content.css");
        document.body.appendChild(this.style_main);
        this.marksList.appendChild(this.ul);

        //pinImage
	// https://stackoverflow.com/a/68456357 (removing border)
        let pinImage = document.createElement("div");
	// a work-around to make image draggable
	// https://discourse.mozilla.org/t/security-error-when-dragging-a-moz-page-thumb/4115/6
        pinImage.style.background = `url(${browser.runtime.getURL("directory/ylw-pushpin.png")}) no-repeat center`;
        pinImage.style.backgroundSize = "contain";
	
	// FIXME: image doesnt load but only after manually edited
	// pinImage.style.width="0px"
        pinImage.className = "image";
	pinImage.draggable=true
	// create pin drag effect
	pinImage.addEventListener("dragstart", (ev)=> {
	    // this event only supported on pc 
	    ev.dataTransfer.setDragImage(pinImage,30,27)
	});

	function dragOverHandler(ev) {
            ev.preventDefault();
	}
	document.body.addEventListener("dragover",dragOverHandler)
	document.body.addEventListener("drop",(ev)=>{
	    let elementExists = this.liOrderArray.some(
                (z) => z.pointTo === ev.target
            );
            if (elementExists) {
                //do nothing
            } else {
		this.addToList({target:ev.target,clientY:ev.clientY,ctrlKey:true})
            }
            ev.preventDefault();
            // Get the data, which is the id of the drop target
            // const data = ev.dataTransfer.getData("text");
            // ev.target.appendChild(document.getElementById(data));
	})
        pinImage.addEventListener("click", (e)=>{
	    // this event will be fired both on mobile and pc
            let addon = document.querySelector(".ff-addon1");
            let addonRight = getComputedStyle(addon).right;
	    let width = getComputedStyle(addon).width;
            if (addonRight.match(/-/)) {
                //addon is hidden
                addon.animate(
                    [
                        // keyframes
                        { right: addonRight },
                        { right: "0" }
                    ],
                    {
                        // timing options
                        duration: 300,
                        iterations: 1,
                        fill: "forwards"
                    }
                )
            } else {
                //hide addon
		// FIXME: adopt a cleaner approach
                addon.animate(
                    [
                        // keyframes
                        { right: addonRight },
			//hide 80% width of addon
                        { right: `-${parseInt(width)*80/100}px` }
                    ],
                    {
                        // timing options
                        duration: 300,
                        iterations: 1,
                        fill: "forwards"
                    }
                )
            }
        })
	// MOBILE /////////////////////////////////////////////////////////////

	pinImage.addEventListener('touchmove', (e) => {
	    // touch event should no bubble
	    e.preventDefault()
	    // to prevent adding objects to list when pin is clicked/tapped
	    this.moving=true
	    // grab the location of touch
	    var touchLocation = e.targetTouches[0];
	    // while dragging, pinImage shown at some offset distance.
	    let offsetLeft = pinImage.offsetParent.offsetLeft+100;
	    let offsetTop = pinImage.offsetParent.offsetTop+120;
	    pinImage.style.left = (touchLocation.screenX-offsetLeft) + "px"
	    pinImage.style.top = (touchLocation.screenY-offsetTop) + "px"
	})
	
	/* record the position of the touch
	   when released using touchend event.
	   This will be the drop position. */
	pinImage.addEventListener('touchend', (e)=>{
	    // current pinImage position.
	    pinImage.style.removeProperty("left")
	    pinImage.style.removeProperty("top")
	    let x = e.changedTouches[0].screenX - 70
	    let y = e.changedTouches[0].screenY - 70 // offset taken from touchmove method, offset x is not required

	    // element at the point where the user lifted their thumb (event doesn't have any data)
	    let elem = document.elementFromPoint(x,y);
	    // FIXME: adopt better approach
	    // extract below logic (redundant in 3 places) to addToList method
	    let elementExists = this.liOrderArray.some(
                (z) => z.pointTo === elem
            );
            if (elementExists) {
                //do nothing
            } else {
		let addonPosX = e.target.getBoundingClientRect().x;
		let addonPosY = e.target.getBoundingClientRect().y;
		// make sure pin doesn't fall inside addon UI (UI at bottom right in mobile)
		if (this.moving && x<addonPosX && y<addonPosY) {
		    this.addToList({target:elem,clientY:e.changedTouches[0].clientY,ctrlKey:true})
		}
		this.moving=false
            }
	})
	// END MOBILE /////////////////////////////////////////////////////////

        this.marksList.insertAdjacentElement("afterbegin", pinImage);
    }

    addonInit() {
        // add event listener to body
	// if (this.device === "android") {
	// } else {
	    document.body.addEventListener("click", (event) => {
            let elementExists = this.liOrderArray.some(
                (z) => z.pointTo === event.target
            );
            if (elementExists) {
                //do nothing
            } else {
                this.addToList(event);
            }
        })
    }
    addToList({ target, ctrlKey, clientY }) {
        // check if ctrl was pressed
        if (ctrlKey) {
            //create list item
            let li = document.createElement("li");
            let div = document.createElement("div");
            div.innerText = target.textContent
                .replace(/\s{2,}/g, "")
                .slice(0, 19)
                .concat("...");
            div.onclick = function() {
                target.scrollIntoView({ block: "center", behavior: "smooth" });
                //animate target to get user attention
                target.animate(
                    [
                        // keyframes
                        { transform: "translateX(0)" },
                        { transform: "translateX(2%)" },
                        { transform: "translateX(-2%)" },
                        { transform: "translateX(0)" },
                    ],
                    {
                        // timing options
                        duration: 300,
                        iterations: 1,
                        delay: 800
                    }
                );
            };
            li.appendChild(div);

            //add delete button to li
            let del = document.createElement("span");
            del.innerText = "x";
            //onlick listener will be added later when we have the index value to
            //make deleting element from array easier
            li.appendChild(del);

            //find postion for element to be placed in the array in order of
            //its appearance in the document
            let scrollHeight = window.scrollY + clientY + this.factor;
            let index = this.liOrderArray.findIndex((z, i) => {
                // findIndex will return minus 1 if array empty and condition is false
                if (scrollHeight < z.scrollHeight) {
                    return true;
                }
            });

            //set attribute to animate it
            li.setAttribute("class", "add");

            if (index >= 0) {
                // element has to be placed in between somewhere in the list
                this.liOrderArray.splice(index, 0, {
                    pointTo: target,
                    button: li,
                    scrollHeight: window.scrollY + clientY + this.factor,
                });
                this.liOrderArray.forEach((z, i) => {
                    this.ul.appendChild(z.button);
                });
            } else {
                // push element at last index
                this.liOrderArray.push({
                    pointTo: target,
                    button: li,
                    scrollHeight: window.scrollY + clientY + this.factor,
                });

                this.ul.appendChild(
                    this.liOrderArray[this.liOrderArray.length - 1].button
                );
                index = this.liOrderArray.length - 1;
            }
            setTimeout(() => {
                li.removeAttribute("class");
            }, 500);

            del.onclick = (e) => {
                li.setAttribute("class", "remove");
                let index = this.liOrderArray.findIndex(
                    (z) => z.button === e.target.parentElement
                );
                setTimeout(() => {
                    this.ul.removeChild(this.liOrderArray.splice(index, 1)[0].button);
                }, 500);
            };
        }
    }
    zoom() {
        /*
         * avoid for now aka todo
         */
        // event listener for zoom +/-
        // window.onresize = function () {
        //   this.factor = document.body.scrollHeight - size;
        //   size = document.body.scrollHeight;
        //   this.liOrderArray.forEach((z) => {
        //     // elem.scrollHeight = elem.scrollHeight + this.factor;
        //   });
        // };
    }
}

let addon = new Addon();
addon.config();
addon.addonInit();
let ref = addon.marksList
let power = false; //initially do not display

browser.runtime.onMessage.addListener((request) => {
    // enable the addon in webpage
    if (power) {
        document.body.removeChild(ref)
        power = !power
    } else {
        document.body.appendChild(ref)
        power = !power
    }
    return Promise.resolve({ response: "Hi from content script" });
});



// disable ctrl click on addon UI 
ref.addEventListener("click", (e) => {
    if (e.ctrlKey) {
        e.stopPropagation()
    }
    if (e.target.innerHTML === "clear") {

        let ul = document.querySelector(".ff-addon1 ul")
        let count = ul.childElementCount;
        while (count--) {
            document.querySelector(".ff-addon1 ul span").click()
        }
    }
})
