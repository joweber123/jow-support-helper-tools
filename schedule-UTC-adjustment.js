// ==UserScript==
// @name         Happy Schedule Times
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add UTC time to scheduler
// @author       joweber123
// @match        https://schedule.happy.tools/schedule
// @icon         https://www.google.com/s2/favicons?domain=happy.tools
// @grant        none
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';

// Function to add in the UTC times

function addUTC(){
    document.querySelectorAll(".block-graph__header-time-text").forEach(getTimeValues)
    function getTimeValues(item){
      let existingTimeParent = item.parentNode;
      let timeInt = parseInt(item.innerHTML);
      let timeUTCAdjusted = (timeInt - 9);
      if (timeUTCAdjusted < 0){
            let timeUTCNegativeAdjusted = (timeUTCAdjusted + 24);
            let newUTCTimeElement = document.createElement("div");
            newUTCTimeElement.innerHTML = timeUTCNegativeAdjusted+" UTC";
            newUTCTimeElement.classList.add("block-graph__header-time-text");
            existingTimeParent.prepend(newUTCTimeElement);
      }else{
            let newUTCTimeElement = document.createElement("div");
            newUTCTimeElement.innerHTML = timeUTCAdjusted+" UTC";
            newUTCTimeElement.classList.add("block-graph__header-time-text");
            existingTimeParent.prepend(newUTCTimeElement);
      }
    }
}


// Check to see if default times are loaded and if not, it will continue to check

function waitForElement(classname, callback){
    var repeatingFunction = setInterval(function(){
        if(document.querySelector(classname)){
            clearInterval(repeatingFunction);
            callback();
        }
    }, 100);
}

window.onload = waitForElement(".block-graph__header-hours-list", addUTC);

})();
