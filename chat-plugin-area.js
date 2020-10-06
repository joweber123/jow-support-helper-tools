// ==UserScript==
// @name         Development Happychat Plugin Area
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

function pluginAreaAddHTML(){
    const lastChatToolBarItem = document.querySelector(".chat-toolbar__menu-item:nth-child(3)");
    lastChatToolBarItem.insertAdjacentHTML('afterend', `<li id="chat-plugin-menu-item" class="chat-toolbar__menu-item"><svg class="gridicon gridicons-aside" height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M6.09 0.63C6.02 0.79 6.02 0.82 6.02 2.43C6.03 3.65 6.03 3.98 6.01 3.97C6 3.97 5.57 3.98 5.06 3.98C4.33 3.98 4.12 3.99 4.08 4C4.05 4.02 4.02 4.05 3.98 4.09C3.94 4.15 3.93 4.16 3.93 4.22C3.92 4.3 3.94 7.05 3.94 7.23C3.95 7.59 4.01 8.03 4.1 8.37C4.33 9.25 4.76 10 5.43 10.69C5.58 10.85 6.07 11.24 6.27 11.37C6.76 11.68 7.26 11.9 7.81 12.03C7.93 12.06 7.95 12.07 7.95 12.09C7.94 12.4 7.97 16.89 7.98 16.97C8.01 17.15 8.08 17.33 8.2 17.49C8.25 17.56 8.29 17.6 8.4 17.69C8.53 17.78 8.56 17.8 8.65 17.84C8.9 17.94 9.17 17.95 9.41 17.88C9.51 17.84 9.67 17.76 9.76 17.69C9.86 17.62 10.03 17.41 10.07 17.31C10.14 17.17 10.18 17.03 10.19 16.91C10.19 16.86 10.19 15.76 10.18 14.45C10.17 13.14 10.17 12.07 10.18 12.06C10.18 12.06 10.25 12.04 10.33 12.02C11.12 11.81 11.89 11.4 12.51 10.83C12.86 10.5 13.22 10.05 13.46 9.64C13.88 8.9 14.11 8.07 14.14 7.23C14.14 6.95 14.13 4.21 14.12 4.15C14.11 4.11 14.09 4.07 14.07 4.04C13.99 3.94 14 3.94 12.97 3.94C12.46 3.95 12.03 3.95 12.03 3.94C12.02 3.94 12.02 3.25 12.01 2.41C12.01 1.56 12 0.84 11.99 0.79C11.9 0.33 11.38 0.06 10.96 0.27C10.73 0.38 10.59 0.55 10.54 0.79C10.53 0.87 10.52 1.23 10.53 2.42L10.54 3.95L10.5 3.95C10.38 3.97 7.51 3.97 7.51 3.95C7.51 3.95 7.51 3.28 7.51 2.46C7.5 1.62 7.5 0.93 7.49 0.86C7.46 0.65 7.38 0.51 7.21 0.38C7.05 0.25 6.89 0.2 6.68 0.23C6.52 0.25 6.42 0.28 6.3 0.37C6.21 0.44 6.14 0.53 6.09 0.63Z"/></g></svg>Apps</li>`);
    const chatInfoStyles = document.querySelector('.chat-info');
    const chatToolBarStyles = document.querySelector('.chat-toolbar');
    const chatToolBar= document.querySelector(".chat-toolbar");
    const pluginContainer = document.createElement("div");
    pluginContainer.id = "chat-plugin-container";
    pluginContainer.setAttribute("style", `height: ${chatInfoStyles.offsetHeight*1.5}px; margin-top: -${chatInfoStyles.offsetHeight*1.5}px; background-color: ${getComputedStyle(chatInfoStyles).backgroundColor}`)
    const chatPluginElements = [
        { id: 'chat-plugin-1'},
        { id: 'chat-plugin-2'},
        { id: 'chat-plugin-3'},
        { id: 'chat-plugin-4'},
        { id: 'chat-plugin-5'}
    ];
    const nodes = chatPluginElements.map(item => {
    const divs = document.createElement('div');
    divs.id = item.id;
    divs.className = 'chat-plugin-element';
    divs.setAttribute("style", `background-color: ${getComputedStyle(chatToolBarStyles).backgroundColor};`)
    return divs;
    });
    pluginContainer.append(...nodes);
    chatToolBar.insertAdjacentElement('afterend',pluginContainer);
    const chatPluginElement = document.querySelector("#chat-plugin-menu-item");

    //Add click event to menu plugin menu item
    chatPluginElement.addEventListener("click", pluginAreaClickEvent);
}

//Check if event target is container.  If click is anywhere but container, close container by removing active class on element
function pluginAreaRemoveClick(e){
    if ( e.target.id === 'chat-plugin-container' || e.target.id === 'chat-plugin-menu-item' || e.target.parentElement.classList.contains("chat-plugin-element") ) {
        return;
    }
    console.log(e);
    const chatPluginElement = document.querySelector("#chat-plugin-container");
    chatPluginElement.classList.remove("chat-plugin-active");
    document.removeEventListener( 'click', pluginAreaRemoveClick );
}

//Toggle plugin container on menu item click. When container is open, add event listener on body so that any click outside of container will close container
function pluginAreaClickEvent(){
    const chatPluginElement = document.querySelector("#chat-plugin-container");
    chatPluginElement.classList.toggle("chat-plugin-active");
    document.addEventListener("click", pluginAreaRemoveClick );
}

// Check to see if Bookmarks menu item has loaded. When it has loaded, then add Plugin menu item

function waitForElement(classname, callback){
    var repeatingFunction = setInterval(function(){
        if(document.querySelector(classname)){
            clearInterval(repeatingFunction);
            callback();
        }
    }, 100);
}


window.onload = waitForElement(".chat-toolbar__menu", pluginAreaAddHTML);

})();
