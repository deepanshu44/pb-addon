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
    //find postion for element to be placed to preserve flow
    let index = arrc.findIndex(function (z, i) {
      console.log(z.scrollHeight, arrc[i + 1]);
      if (arrc[i + 1]) {
        console.log("data", z.scrollHeight, arrc[i + 1].scrollHeight, i);
        if (z.scrollHeight < arrc[i + 1].scrollHeight) {
          return true;
        } else {
          console.log("false");
          return false;
        }
      } else {
        console.log("elseT");
        // at last index, threfore return it
        return true;
      }
    });
    console.log(index);
    // pos is at btwn somwhre
    if (index >= 0) {
      arrc.splice(index + 1, 0, {
        element: event.target,
        scrollHeight: window.scrollY + event.clientY + factor,
      });
      console.log("append", arrc);
      arrc.forEach((z) => {
        el.appendChild(z.element);
      });
      // el.insertBefore(bu, arrc[index + 1].element);
    }
    // push element at last index
    else {
      console.log("else");
      arrc.push({
        element: event.target,
        scrollHeight: window.scrollY + event.clientY + factor,
      });
      el.appendChild(bu);
    }

    console.log(arrc);
  }
});

window.onresize = function () {
  factor = document.body.scrollHeight - size;
  arrc.forEach((z) => {
    z.scrollHeight = z.scrollHeight + factor;
  });
};
