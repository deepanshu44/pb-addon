class Addon {
  constructor() {
    this.marksList = document.createElement("div");
    this.el = document.createElement("ul");
    this.style_main = document.createElement("style");
    //todo
    this.factor = 0;
    this.size = document.body.scrollHeight;
    this.map = new WeakMap();
    //required to keep items in list in order of documents
    this.arrc = [];
  }
  config() {
    this.marksList.setAttribute("class", "ff-addon1");
    this.style_main.innerText =
      ".ff-addon1{\
	    top: 100px;\
	    right: 50px;\
            width: 100px;\
	    height: auto;\
            color:grey;\
	    z-index: 9999;\
	    position: fixed;\
            padding-top:20px;\
            padding-left:10px;\
	    border: 11px solid #eaeac7;\
	    border-top-width: 37px;\
            background-color: white;\
	    border-top-left-radius: 28px;\
             },\
	.ff-addon1 li{\
	    width: 100%;\
	    padding: 10px;\
	}\
";
    document.body.appendChild(this.style_main);
    document.body.insertBefore(this.marksList, document.body.firstChild);
    this.el.style.listStyle = "none";
    this.marksList.appendChild(this.el);
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
      let bu = document.createElement("li");
      bu.innerText = target.textContent
        .replace(/\s/g, "")
        .slice(0, 7)
        .concat("...");
      bu.style.width = "100%";
      bu.onclick = function () {
        target.scrollIntoView();
      };
      this.map.set(target, {
        button: bu,
        scrollHeight: window.scrollY + clientY + this.factor,
      });
      //find postion for element to be placed in order of appearance in the document

      let index = this.arrc.findIndex((z) => {
        // findIndex will return minus 1 if array empty and condition is false
        let getElem = this.map.get(target);
        let getElemNext = this.map.get(z);
        if (getElemNext) {
          if (getElem.scrollHeight < getElemNext.scrollHeight) {
            return true;
          }
        }
      });
      if (index >= 0) {
        // element has to be placed in between somewhere in the list
        this.arrc.splice(index, 0, target);
        this.arrc.forEach((z) => {
          this.el.appendChild(this.map.get(z).button);
        });
      } else {
        // push element at last index
        this.arrc.push(target);
        this.el.appendChild(this.map.get(target).button);
      }
    }
  }
  zoom() {
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
