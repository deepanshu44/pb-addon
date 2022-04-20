/**
   |--------------------------------------------------
   | Basic flow:
   | - create all variables
   | - config them, i.e. attach css
   | - add event listener to body which will
   |   add particular element to the list
   |
   | Todos:
   | - persisting entries using storage api
   | - UI improvement
   | - ablity to delete entries(stylesheet bug first needed to be resolved)
   | - add smooth scroll
   | - dark/light mode
   | - zooming
   |--------------------------------------------------
*/

class Addon {
  constructor() {
    //this will contain your marked items
    this.marksList = document.createElement("div");
    this.ul = document.createElement("ul");
    // css added with stylesheet
    this.style_main = document.createElement("link");
    this.map = new WeakMap();
    //required to keep the items in order of appearance in the document
    this.arrc = [];
    //todo add zoom
    this.factor = 0;
    this.size = document.body.scrollHeight;
  }
  config() {
    this.marksList.setAttribute("class", "ff-addon1");
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

    //css in content.css after ".ff-addon1{...}" not working, threfore
    //have to do this
    pinImage.setAttribute(
      "style",
      "position:absolute;top: -72px; right: -39px;}"
    );
  }

  addonInit() {
    // add event listener to body
    document.body.addEventListener("click", (event) => {
      if (this.map.has(event.target)) {
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
      li.setAttribute("style", "padding:5px 10px 0 10px");
      li.innerText = target.textContent
        .replace(/\s/g, "")
        .slice(0, 7)
        .concat("...");
      li.onclick = function () {
        target.scrollIntoView();
      };
      //todo as first stylesheet problem needed to be resolved
      //add delete button to li
      let del = document.createElement("span");
      del.innerText = "x";
      del.setAttribute(
        "style",
        "position:absolute;right:12px;font-weigth:12px;color:white;background-color:#ff6a6a;padding: 0px 4px 0px 4px;"
      );
      //onlick listener will be added later when we have the index value to
      //make deleting element from array easier
      li.appendChild(del);

      //find postion for element to be placed in the array in order of
      //its appearance in the document
      let scrollHeight = window.scrollY + clientY + this.factor;
      let index = this.arrc.findIndex((z) => {
        // findIndex will return minus 1 if array empty and condition is false
        let getElemNext = this.map.get(z);
        if (getElemNext) {
          if (scrollHeight < getElemNext.scrollHeight) {
            return true;
          }
        }
      });
      if (index >= 0) {
        // element has to be placed in between somewhere in the list
        this.arrc.splice(index, 0, target);
        this.map.set(this.arrc[index], {
          button: li,
          scrollHeight: scrollHeight,
        });
        this.arrc.forEach((z) => {
          this.ul.appendChild(this.map.get(z).button);
        });
      } else {
        // push element at last index
        this.arrc.push(target);
        this.map.set(this.arrc[this.arrc.length - 1], {
          button: li,
          scrollHeight: window.scrollY + clientY + this.factor,
        });
        this.ul.appendChild(this.map.get(target).button);
      }
      del.onclick = function () {
        this.arrc.splice(index, 1);
      };
    }
  }
  delete(arg) {}
  zoom() {
    /*
     * avoid for now aka todo
     */

    // event listener for zoom +/-
    window.onresize = function () {
      this.factor = document.body.scrollHeight - size;
      size = document.body.scrollHeight;
      this.arrc.forEach((z) => {
        let elem = this.map.get(z);
        elem.scrollHeight = elem.scrollHeight + this.factor;
      });
    };
  }
}

let addon = new Addon();
addon.config();
addon.addonInit();

browser.runtime.onMessage.addListener((request) => {
  // enable the addon in webpage
  console.log("Message from the background script:-");
  console.log(request);
  if (request.power) {
    document.body.getElementsByClassName("ff-addon1")[0].style.display = "";
  } else {
    document.body.getElementsByClassName("ff-addon1")[0].style.display = "none";
  }
  return Promise.resolve({ response: "Hi from content script" });
});
