// ==UserScript==
// @name         Transfer Bar Add
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extends Happychat Operators Script to add Transfer Availability Bubble
// @author       joweber123
// @match        https://hud.happychat.io/*
// @grant        none
// ==/UserScript==

//Calculate the load of all HEs with status as transfer
function transferLoadCalculator(){
    let transferLoadNumArray = [];
    document.querySelectorAll('.operators__busy.hasName').forEach((transferHEElement)=>{
        let transferInfoRaw = transferHEElement.firstElementChild.getAttribute('title');
        let transferLoadPos = transferInfoRaw.indexOf('Load: ');
        let transferLoadNum = transferInfoRaw.substr(transferLoadPos+6, 1);
        transferLoadNumArray.push(parseInt(transferLoadNum,10))
    })
    let transferLoadFinal = transferLoadNumArray.reduce((a,b) => a+b, 0)
    return transferLoadFinal;
}

//Calculate the total throttle capacity of all HEs with status as transfer
function transferThrottleCalculator(){
    let transferThrottleArray =[];
    document.querySelectorAll('.operators__busy.hasName').forEach((transferHEElement)=>{
        let transferInfoRaw = transferHEElement.firstElementChild.getAttribute('title');
        let transferThrottlePos = transferInfoRaw.indexOf('Throttle: ');
        let transferThrottleNum = transferInfoRaw.substr(transferThrottlePos+10, 1);
        transferThrottleArray.push( parseInt(transferThrottleNum,10));
    })
    let transferThrottleFinal = transferThrottleArray.reduce((a,b) => a+b, 0)
    return transferThrottleFinal
}

//Add the transfer bar as soon as the other bars are added to the page
function transferBarAdd(){
    let reserveBubble = document.querySelector(".capacity__stats-bubble.reserve");
    reserveBubble.insertAdjacentHTML('afterend', `<span class="capacity__stats-bubble transfer" style="margin-left:4px; background: #edcd8c; border: solid 1px #ad7301;; color:rgba(0,0,0,0.8);">0 / 0</span>`);
}

//Add the transfer bar the first time, then add dynamic content on subsequent attempts
window.setInterval(function(){
    let transferBubble = document.querySelector(".capacity__stats-bubble.transfer");
    if (transferBubble === null){
        transferBarAdd()
    }else{
    let transferAvailabilityCaculator = transferThrottleCalculator() - transferLoadCalculator();
    transferBubble.innerHTML = `${transferAvailabilityCaculator} / ${transferThrottleCalculator()}`;
    }
}, 5000);

