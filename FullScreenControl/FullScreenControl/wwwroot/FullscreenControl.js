"use strict";

// Create a class for the element
class FullscreenControl extends HTMLButtonElement {
    
    static observedAttributes = ["enterText" , "exitText"];
    
    constructor() {
        // Always call super first in constructor
        super();
        
        this.addEventListener('click', this.#toggleFullscreen);
        // console.log("FullscreenControl element constructed")
    }

    connectedCallback() {
        // console.log("FullscreenControl element added to page.");
        
        this.enterText = this.getAttribute('enterText') || "Enter Fullscreen";
        this.exitText = this.getAttribute('exitText') || "Exit Fullscreen";
        
        this.updateInnerText();
    }

    disconnectedCallback() {
        console.log("FullscreenControl element removed from page.");
    }

    adoptedCallback() {
        console.log("FullscreenControl element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
        
        if (name === 'enterText')
        {
            this.enterTextVal = newValue;
        }
        
        if (name === 'exitText')
        {
            this.exitTextVal = newValue;
        }
    }

    isFullscreen() {
        // console.log("isFullscreen");
        // check if we are on Safari as it needs a prefix :-( ...
        let safari = navigator.userAgent.indexOf("Safari") > -1;
        // Discard Safari since it is also matched by Chrome
        if ((navigator.userAgent.indexOf("Chrome") > -1) && safari) safari = false;
        // console.log("On Safari => " + safari);
        if (safari) {
            return document.webkitFullscreenElement !== null;
        }
        return document.fullscreenElement !== null;
    }

    updateInnerText() {
        this.innerText = this.isFullscreen() ? this.exitText : this.enterText;
    }

    // Enter Fullscreen
    #enterFullscreen() {
        // console.log("enterFullscreen");
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        } else console.error("enterFullscreen failed");
    }

    // Exit Fullscreen
    #exitFullscreen() {
        // console.log("exitFullscreen");
        const elem = document;
        if (elem.exitFullscreen) {
            elem.exitFullscreen();
        } else if (elem.webkitExitFullscreen) { /* Safari */
            elem.webkitExitFullscreen();
        } else if (elem.mozCancelFullScreen) { /* Firefox */
            elem.mozCancelFullScreen();
        } else if (elem.msExitFullscreen) { /* IE11 */
            elem.msExitFullscreen();
        } else console.error("exitFullscreen failed");
    }
    
    #toggleFullscreen() {
        // console.log("toggleFullscreen");
        if (this.isFullscreen())
        {
            this.#exitFullscreen();
            // this.innerText = this.enterText;
        }
        else
        {
            this.#enterFullscreen();
            // this.innerText = this.exitText;
        }
    }
}

customElements.define("fullscreen-control", FullscreenControl, {extends: 'button'});

addEventListener("fullscreenchange", (event) => {
    /*
    if (document.fullscreenElement) {
        console.log('Entered Fullscreen');
    } else {
        console.log('Exited Fullscreen');
    }
    */
    
    let elements = document.getElementsByTagName('button');
    
    // console.log('Counted', elements.length, 'buttons');

    for (let i = 0; i < elements.length; i++) {
        let button = elements.item(i);
        if (button instanceof FullscreenControl) {
            button.updateInnerText();
            // console.log('innerText set');
        }
    }
    
});

