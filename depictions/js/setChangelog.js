$(function () {
    var bundle = getQueryVariable('p');

    if (bundle == undefined) {
        console.log("Package not found. Aborting.");
        return;
    }

    var changelogExport = "";

    console.log("Package: " + getQueryVariable('p'));
    console.log("Fetching XML");
    var bundlePath = location.href.split("/").slice(0, -2).join("/") + "/" + bundle;

    $.ajax({
        type: "GET",
        url: bundlePath + "/info.xml",
        dataType: "xml",
        success: function (xml) {
            console.log("Beginning XML Parsing");

            // Parse the xml file and get data
            $(xml).find("packageInfo").each(function () {
                var tweakName = "Changelog of " + $(this).find("name").text().trim();
                var tweakDescription = $(xml).find("description:first").text().trim();
                document.title = tweakName;
                document.querySelector('meta[name="title"]').setAttribute("content", tweakName);
                document.querySelector('meta[name="description"]').setAttribute("content", tweakDescription);
                document.querySelector('meta[property="og:url"]').setAttribute("content", location.href);
                document.querySelector('meta[property="og:title"]').setAttribute("content", tweakName);
                document.querySelector('meta[property="og:description"]').setAttribute("content", tweakDescription);
                document.querySelector('meta[name="twitter:url"]').setAttribute("content", location.href);
                document.querySelector('meta[name="twitter:title"]').setAttribute("content", tweakName);
                document.querySelector('meta[name="twitter:description"]').setAttribute("content", tweakDescription);

                // Dynamic banner/icon handling for twitter cards
                if (fileExists(bundlePath + "/banner.png") || fileExists(bundlePath + "/banner.jpg")) {
                    var bext = fileExists(bundlePath + "/banner.png") ? ".png" : ".jpg";
                    document.querySelector('meta[name="twitter:card"]').setAttribute("content", "summary_large_image");
                    document.querySelector('meta[property="og:image"]').setAttribute("content", bundlePath + "/banner" + bext);
                    document.querySelector('meta[name="twitter:image"]').setAttribute("content", bundlePath + "/banner" + bext);
                    document.querySelector('meta[name="twitter:image:alt"]').setAttribute("content", "Banner of " + tweakName);
                } else if (fileExists(bundlePath + "/icon.png") || fileExists(bundlePath + "/icon.jpg")) {
                    var iext = fileExists(bundlePath + "/icon.png") ? ".png" : ".jpg";
                    document.querySelector('meta[property="og:image"]').setAttribute("content", bundlePath + "/icon" + iext);
                    document.querySelector('meta[name="twitter:image"]').setAttribute("content", bundlePath + "/icon" + iext);
                    document.querySelector('meta[name="twitter:image:alt"]').setAttribute("content", "Icon of " + tweakName);
                }

                $(xml).find("change").each(function () {
                    changelogExport += "<li><h1>" + $(this).find("changeVersion").text().trim() + " <span>- (" +
                        lastUpdateDate(location.href.split("/").slice(0, -3).join("/") + "/debs/" + bundle + "_" + $(this).find("changeVersion").text().replace("v", "").trim() + "_iphoneos-arm.deb") + ")</span></h1>";
                    $(this).find("changeDescription").each(function () {
                        changelogExport += "<h2>- " + $(this).text().trim() + "</h2>";
                    });
                    changelogExport += "</li>";
                });
                $("#changelog").append(changelogExport);
            });
        }
    });
});

$("img").bind("dragstart", function () {
    return false;
});
$("img").bind("mousedown", function () {
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

function fileExists(url) {
    try {
        var req = new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send(null);
        return req.status != 404;
    } catch (er) {
        return er.message;
    }
}

function lastUpdateDate(url) {
    var formatOptions = {year: "numeric", month: "2-digit", day: "2-digit"};
    try {
        var req = new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send(null);
        if (req.status == 200)
            return new Date(req.getResponseHeader('Last-Modified'))
                .toLocaleDateString("en-US", formatOptions);
        else return "Unknown";
    } catch (er) {
        return er.message;
    }
}
