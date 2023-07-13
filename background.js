// background-script.js
"use strict";

function onError(error) {
    console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {}).catch(onError);
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
