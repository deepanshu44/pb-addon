// background-script.js
"use strict";
let power = false;
function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  browser.tabs
    .sendMessage(tabs[0].id, { power: power })
    .then((response) => {
      console.log("Message from the content script:");
      console.log(response.response);
    })
    .catch(onError);
}

browser.browserAction.onClicked.addListener(() => {
  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then(sendMessageToTabs)
    .catch(onError);
  power = !power;
});
