// background-script.js
"use strict";
let power = true;
function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  browser.tabs.sendMessage(tabs[0].id, { power: power }).catch(onError);
  power = !power;
}

browser.browserAction.onClicked.addListener(() => {
  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then(sendMessageToTabs)
    .catch(onError);
});
