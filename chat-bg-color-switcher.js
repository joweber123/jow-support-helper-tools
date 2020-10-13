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
    PLUGIN_TITLE: "BG Color Select",
    randomAlways: 'false',
    colors: [
        "linear-gradient(to right top, #31bbda 20%, #35394b 20%)",
        "linear-gradient(to right top, #ce635b 20%, #35394b 20%)",
        "linear-gradient(to right top, #63d9b0 20%, #35394b 20%)"
    ],
    randomButton: 'false',
    randomFormula: "linear-gradient(to right top, random 20%, random 20%)"
};

// on window load test local storage and update bg color if necessary
window.onload = function(){
    const pathOnLoad = location.pathname.split('/');
    if (pathOnLoad[1] === 'chat' && pathOnLoad[2]) {
        urlArrayTester();
    }
  };

// Monkey patch history.pushState() so we can see URL changes in the SPA
const pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    urlArrayTester();
};


//if array of chats does not exist, set to empty array.  If exists, set to local storage
let storedChatIdsArray = JSON.parse(localStorage.getItem(`${bgColorOptions.LOCAL_STORAGE_KEY}ChatIdsObject`)) || [];

//check if array is empty or not
if (Array.isArray(storedChatIdsArray) &&storedChatIdsArray.length){

    storedChatIdsArray = storedChatIdsArray.filter(item => (Date.now() < (parseInt(item.timeStamp) + bgColorOptions.STORAGE_FLUSH_INTERVAL_MS)));

    //remove if the timestamp of the element is greater than the the current date minus 24 hours
}


//set iterator to 0 by default.  If there is a stored array, begin to iterate
let i = 1;
if (storedChatIdsArray.length == 0){
    i = 1;
}else{
    i = storedChatIdsArray[storedChatIdsArray.length-1].originalColorID;
}

//function to test if local storage entry exists or not and then add new entry if needed
function urlArrayTester(){
    const path = window.location.pathname.split('/');
    const urlEnding = path[path.length-1];
    //testing to see the current chat ID matches any IDs that are saved in the array
    const urlEndingCheck = storedChatIdsArray.some(e => e.url == urlEnding);
    if(urlEndingCheck){
        //if the URL does match an entry, then change color accordingly.
        backgroundColorChanger(urlEnding);
    }else{
        //if the URL does not match any entry, then push this URL into the array wtih appropriate colors
        urlPusher(i, urlEnding)
        localStorage.setItem(`${bgColorOptions.LOCAL_STORAGE_KEY}ChatIdsObject`, JSON.stringify(storedChatIdsArray));
        i<(bgColorOptions.colors.length) ? i++ : i=1;
        backgroundColorChanger(urlEnding);
    }
}

//function to push new local storage entry into array
function urlPusher(i, urlEnding){
    if(bgColorOptions.randomAlways === 'true'){
        storedChatIdsArray.push({url:`${urlEnding}`, color:`${changeRandomFunction(bgColorOptions.randomFormula, 'random')}`, originalColorID: `${i}`, timeStamp: `${Date.now()}`})

    }else{
        storedChatIdsArray.push({url:`${urlEnding}`, color:`${bgColorOptions.colors[i-1]}`, originalColorID: `${i}`, timeStamp: `${Date.now()}`})
    }

}

//funtion to change bg color based on local storage entries
function backgroundColorChanger(urlEnding){
    const buttonContainer = document.querySelector('.chat__current-chat');
    const arrayElement = storedChatIdsArray.find( ({ url }) => url === urlEnding );
    buttonContainer.style.background = arrayElement.color;
}

//function to wait for plugin area to load
function waitForElement(id, callback){
    var repeatingFunction = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(repeatingFunction);
            callback();
        }
    }, 100);
}

//function to wait for chat area to load after initially beginning chat session
function waitForElementByClassname(callback){
    var repeatingFunction = setInterval(function(){
        if(document.querySelector('.chat').children[1]){
            clearInterval(repeatingFunction);
            callback();
        }
    }, 100);
}

// on window load add listener to document testing for button click on initial sessino start modal
window.onload = function(){
    const pathOnLoad = location.pathname.split('/');
    if (pathOnLoad[1] === 'chat' && pathOnLoad[2]) {
        document.addEventListener( "click", buttonListener );
    }
  };
  function randomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
  }
//function to add buttons to plugin area
function buttonListener(event){
    var element = event.target;
    if(element.tagName == 'BUTTON'){
        waitForElementByClassname(urlArrayTester);
        waitForElement("chat-plugin-1", function(){
            const pluginFontColor = document.querySelector('.chat-toolbar__menu-item:not(.is-selected');
            const chatPlugin1 = document.querySelector("#chat-plugin-1");
            const plugin1Title = document.createElement("div");
            plugin1Title.textContent = bgColorOptions.PLUGIN_TITLE;
            plugin1Title.setAttribute("style", `color: ${getComputedStyle(pluginFontColor).color};`)
            chatPlugin1.append(plugin1Title);
            if(bgColorOptions.randomAlways === 'false'){
                const nodes = bgColorOptions.colors.map(item => {
                    const button = document.createElement('button');
                    button.value = item;
                    button.className = "plugin-bg-color-swab";
                    button.onclick = buttonClickBackgroundChange;
                    button.setAttribute("style", `background: ${item}; border-radius: 50%; height: 25px; width: 25px;`)
                    return button;
                });
                chatPlugin1.append(...nodes);
            }
            if (bgColorOptions.randomButton === 'true'){
                const randomButton = document.createElement('button');
                randomButton.className = "plugin-bg-color-swab";
                randomButton.onclick = buttonClickBackgroundChange;
                randomButton.value = 'randomize';
                randomButton.setAttribute("style", `background: red; border-radius: 50%; height: 25px; width: 25px;`)
                randomButton.animate([
                    { background: 'violet'},
                    { background: 'indigo'},
                    { background: 'blue' },
                    { background: 'green' },
                    { background: 'yellow' },
                    { background: 'orange'},
                    { background: 'red'},
                    { background: 'violet'}
                ],{
                    duration: 5000,
                    iterations: Infinity
                });
                chatPlugin1.append(randomButton);
            }
        });

        document.removeEventListener( "click", buttonListener );
        return;
    }
}

const changeRandomFunction = (string, oldPart) => {
    if (string.includes(oldPart) === false) {
      return string;
    }
    const newString = string.replace(oldPart, `#${randomColor()}`)
    return changeRandomFunction (newString, oldPart)
  }

//Function to change BG color and update local storage on click of plugin button
function buttonClickBackgroundChange(){
    const path = window.location.pathname.split('/');
    const urlEnding = path[path.length-1];
    const buttonContainer = document.querySelector('.chat__current-chat');
    const currentLocalStorageColorIndex = storedChatIdsArray.findIndex(element => element.url == urlEnding);
    if(this.value == 'randomize'){
        if(bgColorOptions.hasOwnProperty('randomFormula')){

            const randomFormulaUpdated = changeRandomFunction(bgColorOptions.randomFormula, 'random');
            buttonContainer.style.background = randomFormulaUpdated;
            storedChatIdsArray[currentLocalStorageColorIndex].color =randomFormulaUpdated;
        }else{
            buttonContainer.style.background = `#${randomColor()}`;
            storedChatIdsArray[currentLocalStorageColorIndex].color = `#${randomColor()}`;
        }
    }else{
        buttonContainer.style.background = this.value;
        storedChatIdsArray[currentLocalStorageColorIndex].color = this.value;
    }

    localStorage.setItem(`${bgColorOptions.LOCAL_STORAGE_KEY}ChatIdsObject`, JSON.stringify(storedChatIdsArray));
}

})();
