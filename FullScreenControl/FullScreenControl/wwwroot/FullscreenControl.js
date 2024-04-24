// Copyright 2024 Hugh Maaskant
// License: MIT - https://opensource.org/license/mit 

"use strict";

// A Custom HTML element (component) that can put the browser in fullscreen mode and back.

// Also see: https://www.w3docs.com/learn-javascript/custom-elements.html 
// The component extends the HTMLButtonElement and binds the click event to toggling
// the browser's fullscreen mode on the main window. 
// The component has two observed Attributes: enterHTML and exitHTML that will set
// the button's innerHTML when in non-fullscreen and fullscreen mode respectively.
// The component registers an event handler to
class FullscreenControl extends HTMLButtonElement {
    
    static observedAttributes = ["data-enter-html" , "data-exit-html"];
    
    // preserves the fullscreenchange event handler that is registered on document so that it can be removed
    handlerRef = undefined;
    
    constructor() {
        // Always call super first in constructor
        super();
        
        // https://stackoverflow.com/questions/43727516/how-adding-event-handler-inside-a-class-with-a-class-method-as-the-callback
        const that = this;
        this.handlerRef = function(event) { that.#fullscreenChangedHandler(event) }; 
        console.log("FullscreenControl element constructed")
    }

    connectedCallback() {
        console.log("FullscreenControl element added to page.");
        
        this.enterhtml = this.getAttribute('data-enter-html') || "Enter Fullscreen";
        this.exithtml = this.getAttribute('data-exit-html') || "Exit Fullscreen";
        
        this.innerHTML = this.isFullscreen() ? this.exithtml : this.enterhtml;

        document.addEventListener("fullscreenchange", this.handlerRef);
        this.addEventListener('click', this.#toggleFullscreen);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#toggleFullscreen);
        document.removeEventListener("fullscreenchange", this.handlerRef);
        console.log("FullscreenControl element removed from page.");
    }

    adoptedCallback() {
        console.log("FullscreenControl element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("Attribute", name, "has changed from", oldValue, "to", newValue);
        
        if (name === 'data-enter-html')
        {
            this.enterhtml = newValue;
        }
        
        if (name === 'data-exit-html')
        {
            this.exithtml = newValue;
        }
    }

    // Returns true iff the browser is in fullscreen mode
    isFullscreen() {
        console.log("isFullscreen");
        // check if we are on Safari as it needs a prefix :-( ...
        let safari = navigator.userAgent.indexOf("Safari") > -1;
        // Discard Safari since it is also matched by Chrome
        if ((navigator.userAgent.indexOf("Chrome") > -1) && safari) safari = false;
        console.log("On Safari => ", safari);
        if (safari) {
            return document.webkitFullscreenElement !== null;
        }
        return document.fullscreenElement !== null;
    }

    // Update the button's innerHTML to reflect the new fullscreen mode
    #fullscreenChangedHandler(event) {
        const fullscreen = this.isFullscreen();
        console.log("#fullscreenChangedHandler", fullscreen ? 'Entered Fullscreen' : 'Exited Fullscreen');
        this.innerHTML = fullscreen ? this.exithtml : this.enterhtml;
    }
    
    // Enter Fullscreen mode
    #enterFullscreen() {
        console.log("enterFullscreen");
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        } else console.error("#enterFullscreen failed");
    }

    // Exit Fullscreen mode
    #exitFullscreen() {
        console.log("exitFullscreen");
        const elem = document;
        if (elem.exitFullscreen) {
            elem.exitFullscreen();
        } else if (elem.webkitExitFullscreen) { /* Safari */
            elem.webkitExitFullscreen();
        } else if (elem.mozCancelFullScreen) { /* Firefox */
            elem.mozCancelFullScreen();
        } else if (elem.msExitFullscreen) { /* IE11 */
            elem.msExitFullscreen();
        } else console.error("#exitFullscreen failed");
    }
    
    // Toggle the fullscreen mode
    #toggleFullscreen() {
        console.log("toggleFullscreen");
        if (this.isFullscreen())
        {
            this.#exitFullscreen();
        }
        else
        {
            this.#enterFullscreen();
        }
    }
}

// Register the custom element
customElements.define("fullscreen-control", FullscreenControl, {extends: 'button'});

