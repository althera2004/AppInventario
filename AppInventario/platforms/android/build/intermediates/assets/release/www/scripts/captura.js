var lockedGPS = false;
var actualPhoto = 0;
var geocoder;
var imageCounter = 0;
var map;
var firstTime = true;
var marker;
var marker2;
var lockResolve = false;
var clienteId;
var adjudicacionId;
var lastLat;
var lastLng;
var address = {
    street_number: 0,
    route: 'calle',
    locality: 'ciudad',
    province:'provincia',
    postal_code:'00000'
};

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

function GetAdjudicacionById(id) {
    for (var x = 0; x < adjudicaciones.length; x++) {
        if (adjudicaciones[x].Id === id) {
            return adjudicaciones[x].Description;
        }
    }
    return "Sin adjudicación";
}

function GetClienteAdjudicacionById(id) {
    for (var x = 0; x < adjudicaciones.length; x++) {
        if (adjudicaciones[x].Id === id) {
            return adjudicaciones[x].C;
        }
    }
    return "Sin adjudicación";
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function onError(error) {
    if (error.code !== 3) {
        alert("GPS error: " + error.code + "\n" + "message: " + error.message + "\n");
    }
}

function onSuccess(position) {
    ReolverAddress(position.coords.latitude, position.coords.longitude);
    $("#TXTGPSAccurary").html(position.coords.accuracy);
    setCurrentPosition(position.coords.latitude, position.coords.longitude);
}

function getPosition() {
    var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000
    };
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}

function watchPosition() {
    var options = {
        maximumAge: 3600000,
        timeout: 1000,
        enableHighAccuracy: true
    };
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}

function setCurrentPosition(lat, lng) {
    if (lat === lastLat && lng === lastLng) {
        return false;
    }

    lastLat = lat;
    lastLng = lng;
    if (firstTime === false) {
        marker.setLatLng([lat, lng]);
        marker2.setLatLng([lat, lng]);
    }
    else {
        marker = L.marker([lat, lng]);
        marker2 = L.marker([lat, lng]);
    }

    map.panTo([lat, lng]);
    return false;
}

function ShowMap(lat, lng) {
    if (firstTime === false) {
        setCurrentPosition(lat, lng);
        return;
    }

    firstTime = false;
    map = L.map("map");

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
        "maxZoom": 18,
        "minZoom": 10,
        "attribution": ' © <a href="https://www.openframework.es/">OpenFramework</a>',
        "id": 'mapbox.streets'
    }).addTo(map);

    function onLocationFound(e) {
        var greenIcon = L.icon({
            "iconUrl": "img/green.png",
            "iconSize": [12, 12],
            "iconAnchor": [6, 6],
            "popupAnchor": [0, 0]
        });
        var greenIcon2 = L.icon({
            "iconUrl": "img/green.png",
            "iconSize": [18, 18],
            "iconAnchor": [9, 9],
            "popupAnchor": [0, 0],
            "className": "blinking"
        });

        marker = L.marker(e.latlng, { "icon": greenIcon }).addTo(map);
        marker2 = L.marker(e.latlng, { "icon": greenIcon2 }).addTo(map);
    }

    function onLocationError(e) {
        alert("GPS error: " + e.message);
    }

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    map.locate({ "setView": true, "maxZoom": 24 });
    firstTime = false;
    ReolverAddress(lat, lng);
}

function ReolverAddress(lat, lng) {
    if (lockedGPS === true) {
        return false;
    }
    // var url = "https:/ / nominatim.openstreetmap.org / reverse ? format = jsonv2 & lat=" + lat + " & lon=" + lng;
    // var url = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=EZd8malIygUbWRn4ATcf&app_code=dk_d7CjchKbCXzGrZEfMlw&mode=retrieveAddresses&prox=' + lat + ',' + lng;
    var url = "https://eu1.locationiq.com/v1/reverse.php?key=00b89fb3e41e86&lat=" + lat + "&lon=" + lng + "&format=json&namedetails=1";

    $("#TXTLat").html(lat);
    $("#TXTLng").html(lng);
    if (lat !== lastLat && lng !== lastLng) {
        $.ajax({
            "type": "GET",
            "url": url,
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": JSON.stringify(null, null, 2),
            "success": function (response) {
                console.clear();
                console.log(response);
                var numero = "";

                /*for (var x = 0; x < response.results[0].locations.length; x++) {
                    data = response.results[0].locations[x];
                    numero = data.HouseNumber;
                    if (typeof numero !== "undefined" && numero !== null && numero !== "") {
                        break;
                    }
                    console.log(numero, data.Label);
                }*/
                

                /*address.route = response.address.road;
                address.street_number = response.address.house_number;
                address.locality = response.address.city;
                address.postal_code = response.address.postcode;
                address.province = "Barcelona";*/

                var dir = response.address.road;
                var num = response.address.house_number;
                if (typeof num === "undefined") {
                    num = "";
                } else {
                    num = " " + num;
                }

                if (typeof dir === "undefined") {
                    dir = response.address.pedestrian;
                }
                if (typeof dir === "undefined") {
                    dir = response.address.cycleway;
                }
                if (typeof dir === "undefined") {
                    dir = response.address.address27;
                }
                if (typeof dir === "undefined") {
                    dir = response.address.footway;
                }

                if (typeof dir === "undefined") {
                    $("#TXTDireccion").val("Desconocido");
                    return false;
                }

                var wayType = dir.split(" ")[0];

                var res = wayType;
                res += " " + dir.substr(wayType.length);
                res += num;
                res += ", " + response.address.postcode;

                if (typeof response.namedetails !== "undefined") {
                    if (typeof response.namedetails.name !== "undefined") {
                        res += " (" + response.namedetails.name + ")";
                    }
                }
                console.log(res);
                $("#TXTDireccion").val(res);


                /*if (typeof direccion === "undefined") {
                    console.log("Replay GPS");
                    timeaReolverAddress(lat + 0.0001, lng + 0.0001);
                }*/
            },
            "error": function (msg) {
                alert(msg.responseText);
            }
        });
    }
}

function RenderElementos() {
    for (var x = 0; x < elementos.length; x++) {
        var option = document.createElement("OPTION");
        option.value = elementos[x].Id;
        option.appendChild(document.createTextNode(elementos[x].Description + " (" + elementos[x].Unidad + ")"));
        document.getElementById("CMBElemento").appendChild(option);
    }
}

function RenderPatologias() {
    for (var x = 0; x < patologias.length; x++) {
        var option = document.createElement("OPTION");
        option.value = patologias[x].Id;
        option.appendChild(document.createTextNode(patologias[x].Description));
        document.getElementById("CMBPatologia").appendChild(option);
    }
}

function RenderProblemas() {
    for (var x = 0; x < nivelesProblemas.length; x++) {
        var option = document.createElement("OPTION");
        option.value = nivelesProblemas[x].Id;
        option.appendChild(document.createTextNode(nivelesProblemas[x].Description));
        document.getElementById("CMBProblema").appendChild(option);
    }
}

function RenderBarrios() {
    for (var x = 0; x < barrios.length; x++) {
        if (barrios[x].C === clienteId) {
            var option = document.createElement("OPTION");
            option.value = barrios[x].Id;
            option.appendChild(document.createTextNode(barrios[x].Description));
            document.getElementById("CMBBarrio").appendChild(option);
        }
    }
}

//-------------------------------
function onPhotoDataSuccess(imageData) {
    /*if (document.getElementById("IMG0") !== null) {
        var victim = document.getElementById("IMG0");
        $("#IMG0").parent().remove();
    }*/

    var div = document.createElement("DIV");
    div.className = "col-md-3 col-sm-4 col-xs-6";
    div.style.width = "100%";

    var smallImage = document.createElement("IMG");
    smallImage.className = "img-responsive";
    smallImage.src = "data:image/jpeg;base64," + imageData;
    smallImage.id = "IMG" + imageCounter;
    imageCounter++;

    div.appendChild(smallImage);
    document.getElementById("ImageGallery").appendChild(div);

    if (imageCounter === 2) {
        $("#BtnPhoto").css("background-color", "green");
    }

    $("#BtnPhoto").html("<i class=\"fa fa-camera\" style=\"margin-top:14px;font-size:24px;\"></i> "+ imageCounter);
}

// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}

function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        "quality": 40,
        "targetWidth": 1000,
        "destinationType": Camera.DestinationType.DATA_URL
    });
}

    // A button will call this function
    //
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        "quality": 24,
        "allowEdit": true,
        "destinationType": Camera.DestinationType.DATA_URL
    });
}

    // A button will call this function
    //
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        "quality": 50,
        "destinationType": navigator.camera.DestinationType.FILE_URI,
        "sourceType": source
    });
}

    // Called if something bad happens.
    //
    function onFail(message) {
      //alert('Failed because: ' + message);
    }
//-------------------------------

    function goAdjudicaciones() {
        history.go(-1);
}

function LockGPS(status) {
    console.log("LockGPS", status);
    lockedGPS = status;
    if (status === true) {
        $("#BtnGPS").show();
    } else {
        $("#BtnGPS").hide();
    }
}

(function () {
    "use strict";
    document.addEventListener("deviceready", onDeviceReady.bind(this), false);
    $("#BtnPhoto").on("click", capturePhoto);
    $("#BtnSave").on("click", saveInventario);
    $("#BtnCancel").on("click", goAdjudicaciones);
    $("#TxtCantidad").on("keypress", validate);
    $("#TXTDireccion").on("focus", function () { LockGPS(true); });
    $("#LinkBack").on("click", goAdjudicaciones);
    $("#BtnGPS").on("click", function () { LockGPS(false); });

    function onDeviceReady() {
        adjudicacionId = getParameterByName('id') * 1;
        clienteId = GetClienteAdjudicacionById(adjudicacionId) * 1;
        $("#AdjudicacionName").html(GetAdjudicacionById(adjudicacionId));
        $("#TXTDireccion").css("width", "100%");
        RenderElementos();
        RenderPatologias();
        RenderProblemas();
        RenderBarrios();
        $("#TXTDireccion").css("width", "100%");
        lastLat = 41.3948976;
        lastLng = 2.078728;
        ShowMap(41.3948976, 2.078728);
        watchPosition();
        getPosition();
    }
    })();
	
function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function Validate() {
    var ok = true;
    var errorMessage = "Revise los siguientes datos:\n";
    if ($("#TxtCantidad").val() === "") {
        ok = false;
        errorMessage += "Hay que indicar la cantidad.\n";
    }
    if ($("#CMBElemento").val() * 1 === 0) {
        ok = false;
        errorMessage += "Hay que especificar el elemento.\n";
    }
    if ($("#CMBPatologia").val() * 1 === 0) {
        ok = false;
        errorMessage += "Hay que especificar la patología.\n";
    }
    if ($("#CMBProblema").val() * 1 === 0) {
        ok = false;
        errorMessage += "Hay que especificar el nivel de problema.\n";
    }
    if (imageCounter < 2) {
        ok = false;
        errorMessage += "Hay que adjuntar dos fotografías.\n";
    }

    if (ok === false) {
        alert(errorMessage);
    }

    return ok;
}

function saveInventario() {
    if (Validate() === true) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var imgdata0 = "";
            var imgdata1 = "";
            var image0 = document.getElementById("IMG0");
            var image1 = document.getElementById("IMG1");

            if (imageCounter < 2) {
                alert("Hay que realizar al menos una foto");
                return false;
            }

            if (image0 !== null) { imgdata0 = image0.src.split(";base64,")[1]; }
            if (image1 !== null) { imgdata1 = image1.src.split(";base64,")[1]; }

            var data = {
                "image0": imgdata0,
                "image1": imgdata1,
                "elementoId": $("#CMBElemento").val() * 1,
                "patologiaId": $("#CMBPatologia").val() * 1,
                "problemaId": $("#CMBProblema").val() * 1,
                "barrioId": $("#CMBBarrio").val() * 1,
                "adjudicacionId": adjudicacionId,
                "tipoVia": address.route,
                "codigoPostal": address.postal_code,
                "localidad": address.locality,
                "provincia": address.province,
                "numero": address.street_number,
                "direccion": address.route,
                "latitud": $("#TXTLat").html(),
                "longitud": $("#TXTLng").html(),
                "cantidad": $("#TxtCantidad").val(),
                "applicationUserId": 81,
                "observaciones": $("#TxtObservaciones").val(),
                "direccionAlternativa": $("#TXTDireccion").val()
            };

            console.log(data);
            $("#block").show();
            $.ajax({
                "type": "POST",
                "url": "http://ctman.constraula.com/CustomersFramework/Constraula/Data/ItemDataBase.aspx/InventarioFromAPPv2",
                "data": JSON.stringify(data, null, 2),
                "contentType": "application/json; charset=utf-8",
                "success": function (msg) {
                    alert("Inventario guardado con código " + msg.d.MessageError);
                    goAdjudicaciones();
                },
                "error": function (xhr, status, msg) {
                    alert(msg);
                    $("#block").hide();
                }
            });
        }
    }
}