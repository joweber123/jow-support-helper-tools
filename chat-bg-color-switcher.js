// ==UserScript==
// @name         Development Happychat Background Color
// @namespace    https://github.com/Automattic/support-helper-tools/tree/main/happytools-enhancements/happychat-floating-note
// @version      2.1.0
// @description  Creates a floating note entry for each Happychat.
// @author       joweber
// @downloadURL  none
// @grant        none
// @match        http://localhost:3311/*
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';

// Script bgColorOptions - Customize Me!
const bgColorOptions = {
    LOCAL_STORAGE_KEY: 'bgc', // Locale storage key prefix
    STORAGE_FLUSH_INTERVAL_MS: 86400000, // 24 hours
    color1: "linear-gradient(to right, #d9a7c7, #fffcdc)",
    color2: "linear-gradient(to right, #06beb6, #48b1bf)",
    color3: "linear-gradient(to right, #1c92d2, #f2fcfe)",
};

window.onload = function() { // same as window.addEventListener('load', (event) => {
    const pathOnLoad = location.pathname.split('/');
    if (pathOnLoad[1] === 'chat' && pathOnLoad[2]) {
        console.log(pathOnLoad[1]);
        console.log(pathOnLoad[2]);
        urlArrayTester();

    }
  };
// Monkey patch history.pushState() so we can see URL changes in the SPA
const pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    getActiveChatId();
    urlArrayTester();
};

function getActiveChatId() {
    const path = location.pathname.split('/');
    console.log(path[2]);
}

//if array of chats does not exist, set to empty array.  If exists, set to local storage
const storedChatIdsArray = JSON.parse(localStorage.getItem(`${bgColorOptions.LOCAL_STORAGE_KEY}ChatIdsObject`)) || [];

//set iterator to 0 by default.  If there is a stored array, begin to iterate
let i = 0;
if (storedChatIdsArray.length == 0){
    i = 0;
}else{
    i = storedChatIdsArray[storedChatIdsArray.length - 1].colorID;
}

console.log(storedChatIdsArray);

function urlArrayTester(){
    const path = window.location.pathname.split('/');
    const urlEnding = path[path.length-1];
    console.log(urlEnding);

    //testing to see the current chat ID matches any IDs that are saved in the array
    const urlEndingCheck = storedChatIdsArray.some(e => e.url == urlEnding);
    if(urlEndingCheck){
        console.log('value already exists');
        console.log(storedChatIdsArray);
        //if the URL does match an entry, then change color accordingly.
        backgroundColorChanger(urlEnding);
    }else{
        console.log('new value');
        //if the URL does not match any entry, then push this URL into the array wtih appropriate colors
        urlPusher(i, urlEnding)
        localStorage.setItem(`${bgColorOptions.LOCAL_STORAGE_KEY}ChatIdsObject`, JSON.stringify(storedChatIdsArray));
        console.log(storedChatIdsArray);
        i<2 ? i++ : i=0;
        backgroundColorChanger(urlEnding);
    }
}
function urlPusher(i, urlEnding){
    if(i == 0){
        storedChatIdsArray.push({url:`${urlEnding}`, color:`${bgColorOptions.color1}`, colorID: `${i}`})
    }else if(i == 1){
        storedChatIdsArray.push({url:`${urlEnding}`, color:`${bgColorOptions.color2}`, colorID: `${i}`})
    }else{
        storedChatIdsArray.push({url:`${urlEnding}`, color:`${bgColorOptions.color3}`, colorID: `${i}`})
    }
}

function backgroundColorChanger(urlEnding){
    console.log(urlEnding);
    const buttonContainer = document.querySelector('.chat__current-chat');
    const arrayElement = storedChatIdsArray.find( ({ url }) => url === urlEnding );
    console.log(arrayElement)
    buttonContainer.style.background = arrayElement.color;
}

//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
window.onload = function() { // same as window.addEventListener('load', (event) => {
    const pathOnLoad = location.pathname.split('/');
    if (pathOnLoad[1] === 'chat' && pathOnLoad[2]) {
        document.addEventListener( "click", someListener );
    }
  };


//here you are waiting for when someone clicks the modal button.  Then the mutation observation starts to see when a childList change occurs.  Then the URLArrayTester begins.
function someListener(event){
    var element = event.target;
    if(element.tagName == 'BUTTON'){
    const targetNode = document.querySelector('.chat');

    // bgColorOptions for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        console.log(mutationsList);
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.addedNodes[0].classList.contains("chat__chat-panels")) {
                urlArrayTester();
                observer.disconnect();
                document.removeEventListener( "click", someListener );
                return;
            }
        }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    }
}
})();
