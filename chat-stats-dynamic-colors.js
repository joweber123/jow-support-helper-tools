// ==UserScript==
// @name         chatStatsDynamicColors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hud.happychat.io/
// @grant        none
// ==/UserScript==

function availableUnavailableRatioColorChanger(fullColor, availableColor, unavailableColor){
    var bubble = document.getElementsByClassName('capacity__stats-bubble')[0];
    var bubbleRawText = bubble.innerHTML
    var bubbleCleaned = bubbleRawText.replace(/<\!--.*?-->/g, "");
    var bubbleCleanedFirstNumber = parseInt(bubbleCleaned.charAt(1), 10);
    var bubbleCleanedSecondNumberRaw = bubbleCleaned.charAt(5);
    var bubbleCleanedThirdNumberRaw = bubbleCleaned.charAt(6);
    var bubbleCleanedSecondNumber = parseInt(bubbleCleanedSecondNumberRaw + bubbleCleanedThirdNumberRaw );
    var percentage_available = (bubbleCleanedFirstNumber / bubbleCleanedSecondNumber)*100;
    if(percentage_available == 0){
        document.querySelectorAll('.capacity__stats-bubble.available').forEach((element) => {
        element.style.background = `${fullColor}`;
       });
   }else{
        document.querySelectorAll('.capacity__stats-bubble.available').forEach((element) => {
        element.style.background = `linear-gradient(90deg, ${availableColor} ${percentage_available}%, ${unavailableColor} ${percentage_available}% 100%)`;
    });
   }
}


function reserveColorChanger(selector, availableColor, unavailableColor){
    let bubble = document.querySelector(`${selector}`);
    let bubbleRawText = bubble.innerHTML
    let bubbleCleaned = bubbleRawText.replace(/<\!--.*?-->/g, "");
    let bubbleFirstNumber = parseInt(bubbleCleaned.charAt(1), 10);
    document.querySelector(`${selector}`).style.border =`1px solid ${availableColor}`;
    if(bubbleFirstNumber == 0){
        document.querySelector(`${selector}`).style.background = `${unavailableColor}`;
    }else{
        document.querySelector(`${selector}`).style.background = `${availableColor}`;
    }
}
function transferColorChanger(selector, availableColor, unavailableColor){
    let bubble = document.querySelector(`${selector}`);
    let bubbleRawText = bubble.innerHTML;
    let bubbleFirstNumber = parseInt(bubbleRawText.charAt(0), 10);
    document.querySelector(`${selector}`).style.border =`1px solid ${availableColor}`;
    if(bubbleFirstNumber == 0){
        document.querySelector(`${selector}`).style.background = `${unavailableColor}`;
    }else{
        document.querySelector(`${selector}`).style.background = `${availableColor}`;
    }
}
window.setInterval(function(){
    availableUnavailableRatioColorChanger( '#ff7e7e', '#63d9b0', '#E0E0E0');
    reserveColorChanger('.capacity__stats-bubble.reserve', '#31bbda', '#E0E0E0');
    transferColorChanger('.capacity__stats-bubble.transfer', '#edcd8c', '#E0E0E0');
}, 2000);
