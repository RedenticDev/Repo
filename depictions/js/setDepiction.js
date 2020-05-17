$(function() {
    var bundle = getQueryVariable('p');

    if (bundle != undefined) {
        //Now fetch the appropriate file from this query string
    }


    console.log(getQueryVariable('p'));
    console.log("Fetching XML");
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    var pathTo = baseUrl + "/" + bundle;

    $.ajax({
        type: "GET",
        url: pathTo + "/info.xml",
        dataType: "xml",
        success: function(xml) {
            console.log("Beginning XML Parsing");

            // Parse the xml file and get data
            $(xml).find("packageInfo").each(function() {
                // document.getElementById("packageTitle").innerHTML = $(this).find("name").text();
                // document.getElementById("bundleId").innerHTML = $(this).find("bundleId").text();
                // document.getElementById("version").innerHTML = $(this).find("version").text();
                document.getElementById("miniOS").innerHTML = $(this).find("miniOS").text();
                document.getElementById("maxiOS").innerHTML = $(this).find("maxiOS").text();

                $(xml).find("description").each(function() {
                    $("#description").append("<li>" + $(this).text() + "</li>");
                });

                $(xml).find("dependency").each(function() {
                    $("#dependencies").append("<li>" + $(this).text() + "</li>");
                });

                $(xml).find("change").each(function() {
                    $("#changeLog").append("<li><h1>" + $(this).find("changeVersion").text() + "</h1>");
                    $(this).find("changeDescription").each(function() {
                        $("#changeLog").append("<h2>- " + $(this).text() + "<h2>");
                    });
                    $("#changeLog").append("<li>");
                });

                $(xml).find("screen").each(function() {
                    $("#screenshots").append('<li><a href="' + pathTo + "/" + $(this).text() + '"><img src="' + pathTo + "/" + $(this).text() + '" draggable="false" /></a></li>');
                });

                $("#tableInfo").append('<tr><th>Developer</th><td>' + $(this).find("developer").text() + '</td></tr>');
                $("#tableInfo").append('<tr><th>Price</th><td>' + $(this).find("price").text() + '</td></tr>');
                $("#tableInfo").append('<tr><th>Version</th><td>iOS ' + $(this).find("miniOS").text() + ' to ' + $(this).find("maxiOS").text() + '</td></tr>');
                // $("#tableInfo").append('<tr><th>Downloads</th><td>' +  + '</td></tr>');
                $("#tableInfo").append('<tr><th>Category</th><td>' + $(this).find("category").text() + '</td></tr>');

                $("#links").append('<tr><td><a href="' + $(this).find("github").text() + '"><img src="https://is4-ssl.mzstatic.com/image/thumb/Purple113/v4/4b/75/74/4b757442-8ff0-1bcb-dfde-8d39fba370c4/AppIcon-0-1x_U007emarketing-0-7-0-85-220.png/460x0w.png" />Github</a></td></tr>');
                $("#links").append('<tr><td><a href="' + $(this).find("twitter").text() + '"><img src="https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/d3/95/33/d3953380-0fbb-a92e-3be4-d9c0daf90499/ProductionAppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/460x0w.png" />Twitter</a></td></tr>');
                $("#links").append('<tr><td><a href="' + $(this).find("mail").text() + '"><img src="https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/c7/40/e5/c740e5f0-2a62-4fa7-dc1b-66ea3d519545/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-10.png/460x0w.png" />Mail</a></td></tr>');
                $("#links").append('<tr><td><a href="' + $(this).find("paypal").text() + '"><img src="https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/47/91/55/4791557c-5d1e-7357-9d5e-1eb20d3bb42b/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/460x0w.png" />Paypal</a></td></tr>');
            });
        }
    });
});

$("img").bind("dragstart", function(){
    return false;
});
$("img").bind("mousedown", function(){
    return false;
});

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log("Query variable %s not found", variable);
}
