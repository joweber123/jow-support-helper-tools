// ==UserScript==
// @name         Looker Sales Dashboard Copy button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy revenue data to clipboard
// @author       joweber123
// @match        https://looker.a8c.com/dashboards/1713*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=a8c.com
// @downloadURL  https://github.com/joweber123/jow-support-helper-tools/raw/main/looker-sales-dashboard-copy-button.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variables to hold the text strings and number of amounts to capture
    const excludeDashboard1 = "Offer rate"; //exclude any dashboard with this text
    const excludeDashboard2 = "Sora"; //exclude any dashboard with this text too
    const numberOfAmountsToCapture = 4; // Adjust this number to change the amount of data captured

    function addCopyButtons() {
        const dashboardTiles = document.querySelectorAll("#styled-tile-dashboard");
        dashboardTiles.forEach((tile, index) => {
            const ellipsisDiv = tile.querySelector('.ElementTitle__EllipsisDiv-sc-cy6gpn-2');
            if (ellipsisDiv) {
                const textContent = ellipsisDiv.textContent;
                // Check against the variables
                if (!textContent.includes(excludeDashboard1) && !textContent.includes(excludeDashboard2)) {
                    const h2Element = tile.querySelector('h2');
                    if (h2Element) {
                        h2Element.insertAdjacentHTML('afterend', `<button id="CopyButton${index}" class="btn btn-default" style="display: block; margin: 10px auto;">Copy All Revenue Data</button>`);
                        document.getElementById(`CopyButton${index}`).addEventListener("click", function() { copySvgData(tile); });
                    }
                }
            }
        });
    }

    function copySvgData(tile) {
        const gElement = tile.querySelector('g.highcharts-data-labels');
        if (!gElement) {
            console.error('SVG data not found');
            return;
        }

        const textElements = gElement.querySelectorAll('text');
        let numbers = [];

        textElements.forEach((textElement) => {
            const tspanElement = textElement.querySelector('tspan');
            if (!tspanElement) {
                console.error('tspan element not found');
                return;
            }

            const textContent = tspanElement.textContent;
            const match = textContent.match(/\$[\d,]+/);

            if (match) {
                const dollarAmount = match[0].substring(1).replace(/,/g, '');
                numbers.push(dollarAmount);
            } else if (textContent === "∅") {
                numbers.push('0');
            }
        });

        // Capture only the last 'numberOfAmountsToCapture' instances
        numbers = numbers.slice(-numberOfAmountsToCapture);

        const text = numbers.join('\n');
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function waitForElement(classname, callback) {
        var repeatingFunction = setInterval(function() {
            if (document.querySelector(classname)) {
                clearInterval(repeatingFunction);
                callback();
            }
        }, 100);
    }

    window.onload = function() {
        waitForElement("#styled-tile-dashboard", addCopyButtons);
    };

})();
