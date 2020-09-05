// ==UserScript==
// @name         Transfer Bar Add
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extends Happychat Operators Script to add Operators
// @author       joweber123
// @match        https://hud.happychat.io/*
// @grant        none
// ==/UserScript==

function transferLoadCalculator(){
    let transferLoadNumArray = [];
    document.querySelectorAll('.operators__busy').forEach((transferHEElement)=>{
        let transferInfoRaw = transferHEElement.firstElementChild.getAttribute('title');
        let transferLoadPos = transferInfoRaw.indexOf('Load: ');
        var transferLoadNum = transferInfoRaw.substr(transferLoadPos+6, 1);
        transferLoadNumArray.push(parseInt(transferLoadNum,10))
    })
    let transferLoadFinal = transferLoadNumArray.reduce((a,b) => a+b, 0)
    return transferLoadFinal;
}
function transferThrottleCalculator(){
    let transferThrottleArray =[];
    document.querySelectorAll('.operators__busy').forEach((transferHEElement)=>{
        let transferInfoRaw = transferHEElement.firstElementChild.getAttribute('title');
        let transferThrottlePos = transferInfoRaw.indexOf('Throttle: ');
        var transferThrottleNum = transferInfoRaw.substr(transferThrottlePos+10, 1);
        transferThrottleArray.push( parseInt(transferThrottleNum,10));
    })
    let transferThrottleFinal = transferThrottleArray.reduce((a,b) => a+b, 0)
    return transferThrottleFinal
}

function transferBarAdd(){
    let reserveBubble = document.querySelector(".capacity__stats-bubble.reserve");
    reserveBubble.insertAdjacentHTML('afterend', `<span class="capacity__stats-bubble transfer" style="margin-left:4px; background: #edcd8c; border: solid 1px #ad7301;; color:rgba(0,0,0,0.8);">0 / 0</span>`);
}

window.setInterval(function(){
    let transferBubble = document.querySelector(".capacity__stats-bubble.transfer");
    if (transferBubble === null){
        transferBarAdd()
    }else{
    transferBubble.innerHTML = `${transferLoadCalculator()} / ${transferThrottleCalculator()}`;
    }
}, 5000);
