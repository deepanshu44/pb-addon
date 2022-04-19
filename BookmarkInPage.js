/*
Just draw a border round the document.body.
*/
document.body.style.border = "5px solid green";

let map = new WeakMap();

let elem = document.createElement("div");
elem.style.width = "100px";
elem.style.top = "100px";
elem.style.right = "50px";
elem.style.height = "100px";
elem.style.zIndex = "9999";
elem.style.position = "fixed";
elem.style.border = "11px solid yellow";

document.body.insertBefore(elem, document.body.firstChild);
let el = document.createElement("li");
el.style.listStyle = "none";
el.id = 123;

elem.appendChild(el);

let factor = 0;
let size = document.body.scrollHeight;
let arrc = [];

// add event listener to body
document.body.addEventListener("click", (event) => {
  // check if ctrl was pressed
  if (event.ctrlKey) {
    let bu = document.createElement("button");
    bu.innerText = "testb";
    bu.onclick = function () {
      event.target.scrollIntoView();
    };
    map.set(event.target, {
      button: bu,
      scrollHeight: window.scrollY + event.clientY + factor,
    });
    //find postion for element to be placed to preserve flow
    // findIndex will rt -1 if array empty
    let index = arrc.findIndex(function (z, i) {
      let getElem = map.get(event.target);
      let getElemNext = map.get(z);

      if (getElemNext) {
        if (getElem.scrollHeight < getElemNext.scrollHeight) {
          return true;
        }
      }
    });

    if (index >= 0) {
      // pos is at btwn somwhre
      arrc.splice(index, 0, event.target);
      arrc.forEach((z) => {
        el.appendChild(map.get(z).button);
      });
    } else {
      // push element at last index
      arrc.push(event.target);
      el.appendChild(map.get(event.target).button);
    }
  }
});

// event listener for zoom +/-
window.onresize = function () {
  factor = document.body.scrollHeight - size;
  size = document.body.scrollHeight;
  arrc.forEach((z) => {
    let elem = map.get(z);
    elem.scrollHeight = elem.scrollHeight + factor;
  });
};
