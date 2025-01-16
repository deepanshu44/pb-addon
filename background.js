// background-script.js
"use strict";

function onError(error) {
    console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {icon_click:true}).catch(onError);
}

function clickListener() {
    browser.tabs
	.query({
	    currentWindow: true,
	    active: true,
	})
	.then(sendMessageToTabs)
	.catch(onError);
    
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.status === "complete") {
	// NOTE: page can be refreshed multiple times by the user
	browser.tabs
        .query({
            currentWindow: true,
            active: true,
        })
            .then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id, {status:"DOMLoaded"}).catch(onError)
		if (addonLoaded === false) {
		    // when tab opened for first time
		    browser.browserAction.onClicked.addListener(clickListener)
		    addonLoaded = true
		}
	    })
    }
    
}

let addonLoaded = false;
browser.tabs.onUpdated.addListener(handleUpdated);
// todo: deal with addon activation when window out of focus
