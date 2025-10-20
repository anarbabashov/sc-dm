// ==UserScript==
// @name         SoundCloud DM Test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Test if Tampermonkey works
// @author       You
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    console.log('🎯 TAMPERMONKEY IS WORKING!');

    window.testFunction = function() {
        console.log('✅ Test function works!');
    };
})();
