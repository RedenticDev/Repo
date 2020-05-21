$(function() {
    var bundle = getQueryVariable('p');

    if (bundle == undefined) {
        console.log("Package not found. Aborting.");
        return;
    }

    var changelogExport = "";

    console.log("Package: " + getQueryVariable('p'));
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
                document.title = $(this).find("name").text().trim() + "'s changelog";

                $(xml).find("change").each(function() {
                    changelogExport += "<li><h1>" + $(this).find("changeVersion").text().trim() + "</h1>";
                    $(this).find("changeDescription").each(function() {
                        changelogExport += "<h2>- " + $(this).text().trim() + "</h2>";
                    });
                    changelogExport += "</li>";
                });
                $("#changelog").append(changelogExport);
            });
        }
    });
});

$("img").bind("dragstart", function() {
    return false;
});
$("img").bind("mousedown", function() {
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
