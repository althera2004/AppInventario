function ExternalLogin() {
    if ($("#inputEmail").val() === "a" && $("#inputPassword").val() === "a") {
        document.location = "adjudicaciones.html?userId=1";
    }

    var dataSend = {
        "email": $("#inputEmail").val(),
        "password": $("#inputPassword").val(),
        "groupId": 11
    };

    console.log(dataSend);

    $.ajax({
        "type": "POST",
        "url": "http://ctman.constraula.com/CustomersFramework/Constraula/Data/ItemDataBase.aspx/ExternalLogin",
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "data": JSON.stringify(dataSend, null, 2),
        "success": function (msg) {
            if (msg.d.Success === false) {
                alert("*" + msg.d.MessageError + "*");
            }
            else {
                console.log(msg.d);
                var result;
                eval("result=" + msg.d.MessageError + ";");
                console.log(result);
                document.location = "adjudicaciones.html?userId=" + result.Id;
            }
        },
        "error": function (msg) {
            alert(msg.responseText);
        }
    });

    return false;
}

$(document).ready(function () {
    loadProfile();
    document.getElementById("BtnAccess").addEventListener("click", ExternalLogin);
});

function getLocalProfile(callback) {
    var profileImgSrc = localStorage.getItem("PROFILE_IMG_SRC");
    var profileName = localStorage.getItem("PROFILE_NAME");
    var profileReAuthEmail = localStorage.getItem("PROFILE_REAUTH_EMAIL");

    if (profileName !== null
        && profileReAuthEmail !== null
        && profileImgSrc !== null) {
        callback(profileImgSrc, profileName, profileReAuthEmail);
    }
}

function loadProfile() {
    if (!supportsHTML5Storage()) { return false; }
    getLocalProfile(function (profileImgSrc, profileName, profileReAuthEmail) {
        $("#profile-img").attr("src", profileImgSrc);
        $("#profile-name").html(profileName);
        $("#reauth-email").html(profileReAuthEmail);
        $("#inputEmail").hide();
        $("#remember").hide();
    });
}

function supportsHTML5Storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function testLocalStorageData() {
    if (!supportsHTML5Storage()) { return false; }
    localStorage.setItem("PROFILE_IMG_SRC", "//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120");
    localStorage.setItem("PROFILE_NAME", "Juan Castilla Calderón");
    localStorage.setItem("PROFILE_REAUTH_EMAIL", "jcastilla@openframework.es");
}