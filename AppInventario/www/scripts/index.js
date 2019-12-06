(function () {
    "use strict";
    document.addEventListener( "deviceready", onDeviceReady.bind( this ), false );
    function onDeviceReady() {
        document.addEventListener( "pause", onPause.bind( this ), false );
        document.addEventListener( "resume", onResume.bind( this ), false );        
        var parentElement = document.getElementById("deviceready");
        var listeningElement = parentElement.querySelector(".listening");
        var receivedElement = parentElement.querySelector(".received");
        listeningElement.setAttribute("style", "display:none;");
        receivedElement.setAttribute("style", "display:block;");
        document.location = "login.html";
    }
    function onPause() {}
    function onResume() {}
})();