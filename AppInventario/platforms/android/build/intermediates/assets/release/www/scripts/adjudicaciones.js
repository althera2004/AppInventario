function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function RenderList() {
    var userId = getParameterByName('userId') * 1;
    var list = document.getElementById("ButtonList");
    var res = "";
    
    for (var x = 0; x < adjudicaciones.length; x++) {
        if (adjudicaciones[x].UserId === userId) {
            res += "<div style=\"margin:4px;padding:8px;border:1px solid #333;background-color:#3a3;color:#fff;\" id=\"Go" + adjudicaciones[x].Id + "\">";
            res += adjudicaciones[x].Description;
            res += "</div>";
        }
    }

    list.innerHTML = res;

    for (var y = 0; y < adjudicaciones.length; y++) {
        if (adjudicaciones[y].UserId === userId) {
            document.getElementById("Go" + adjudicaciones[y].Id).addEventListener("click", Go);
        }
    }

    if (res === "") {
        res = "<div style=\"margin:4px;padding:8px;border:1px solid #333;background-color:#f01010;color:#f6f610;\"><strong>Ho hi ha cap adjudicació disponible per aquest usuari</strong></div>";
        res += "<br /><br />";
        res += "<button id=\"BackButton\" style=\"width:100%;\"> Sortir </button>";
        list.innerHTML = res;
    }
}

function Go(sender) {
    var tipo = 1;
    for (var x = 0; x < adjudicaciones.length; x++) {
        if ("Go" + adjudicaciones[x].Id === this.id) {
            tipo = adjudicaciones[x].T;
            break;
        }
    }

    document.location = "captura.html?id=" + this.id.substring(2) + "&T=" + tipo;
}

function goLogin() {
    document.location = "login.html";
}

(function () {
    "use strict";

    document.addEventListener("deviceready", onDeviceReady.bind(this), false);

    function onDeviceReady() {
        RenderList();
        document.getElementById("LinkBack").addEventListener("click", goLogin);
        //document.getElementById("BackButton").addEventListener("click", goLogin);
    }
})();