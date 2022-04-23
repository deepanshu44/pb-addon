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
    // hide initially
    this.marksList.style.display = "none";
    this.style_main.rel = "stylesheet";
    this.style_main.href = browser.runtime.getURL("content.css");
    document.body.appendChild(this.style_main);
    document.body.insertBefore(this.marksList, document.body.firstChild);
    this.marksList.appendChild(this.ul);

    //pinImage
    let pinImage = document.createElement("img");
    pinImage.src = browser.runtime.getURL("icons/ylw-pushpin.png");
    pinImage.className = "image";
    this.marksList.insertAdjacentElement("afterbegin", pinImage);
  }

  addonInit() {
    // add event listener to body
    document.body.addEventListener("click", (event) => {
      let elementExists = this.liOrderArray.some(
        (z) => z.pointTo === event.target
      );
      if (elementExists) {
        //do nothing
      } else {
        this.addToList(event);
      }
    });
  }
  addToList({ target, ctrlKey, clientY }) {
    // check if ctrl was pressed
    if (ctrlKey) {
      //create list item
      let li = document.createElement("li");
      let div = document.createElement("div");
      div.innerText = target.textContent
        .replace(/\s/g, "")
        .slice(0, 7)
        .concat("...");
      div.onclick = function () {
        target.scrollIntoView();
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

browser.runtime.onMessage.addListener((request) => {
  // enable the addon in webpage
  if (request.power) {
    document.body.getElementsByClassName("ff-addon1")[0].style.display = "";
  } else {
    document.body.getElementsByClassName("ff-addon1")[0].style.display = "none";
  }
  return Promise.resolve({ response: "Hi from content script" });
});
