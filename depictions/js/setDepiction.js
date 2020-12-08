$(function () {
    var bundle = getQueryVariable("p");

    if (bundle == undefined) {
        console.log("Package not found. Aborting.");
        return;
    }

    var shouldShowNoScreenshots = true;
    var changelogExport = "";

    console.log("Package: " + getQueryVariable("p"));
    console.log("Fetching XML");
    var bundlePath = location.href.split("?")[0] + bundle;
    var apiDebs = "https://api.github.com/repos/RedenticDev/redenticdev.github.io/commits?path=debs/";

    $.ajax({
        type: "GET",
        url: bundlePath + "/info.xml",
        dataType: "xml",
        success: function (xml) {
            console.log("Beginning XML parsing");

            // Parse the xml file and get data
            $(xml).find("packageInfo").each(function () {
                document.title = $(this).find("name").text().trim();

                compatible($(this).find("miniOS").text().trim(), $(this).find("maxiOS").text().trim());

                $(xml).find("description").each(function () {
                    $("#description").append("<li>" + $(this).text().trim() + "</li>");
                });

                $(xml).find("dependency").each(function () {
                    $("#dependencies").append("<li>" + $(this).text().trim() + "</li>");
                });

                $(xml).find("change:first").each(function () {
                    $("#pill").append($(this).find("changeVersion").text().trim());
                    changelogExport += "<li>";
                    $(this).find("changeDescription").each(function () {
                        changelogExport += "<h2>- " + $(this).text().trim() + "</h2>";
                    });
                    changelogExport += "</li>";
                });
                lastUpdateDate(apiDebs + bundle + "_" + $(this).find("version").text().replace("v", "").trim() + "_iphoneos-arm.deb").then(res => { $("#changelog-date").append(res) });
                $("#changelog").append(changelogExport + "<table><tr><td><a href=\"changelog/?p=" + bundle + "\" target=\"_blank\">Full changelog</a></td></tr></table>");

                $(xml).find("screen").each(function () {
                    shouldShowNoScreenshots = false;
                    $("#screenshots").append("<li><a href=\"" + bundlePath + "/" + $(this).text().trim() + "\" target=\"_blank\"><img src=\"" + bundlePath + "/" + $(this).text().trim() + "\" draggable=\"false\" /></a></li>");
                });

                if (shouldShowNoScreenshots) $("#screenshots").append("<li>No screenshots provided.</li>");

                $("#infoTable").append("<tr><th>Developer</th><td>" + $(this).find("developer").text().trim() + "</td></tr>");
                $("#infoTable").append("<tr><th>Price</th><td>Free</td></tr>");
                $("#infoTable").append("<tr><th>Version</th><td>" + $(this).find("version").text().trim() + "</td></tr>");
                $("#infoTable").append("<tr><th>iOS Version</th><td>iOS " + $(this).find("miniOS").text().trim() + " to " + $(this).find("maxiOS").text().trim() + "</td></tr>");
                $("#infoTable").append("<tr><th>Last update</th></td><td id=\"last-update\"></td></tr>");
                $("#infoTable").append("<tr><th>Release date</th></td><td id=\"release-date\"></td></tr>");
                lastUpdateDate(apiDebs + bundle + "_" + $(this).find("version").text().replace("v", "").trim() + "_iphoneos-arm.deb").then(res => { $("#last-update").append(res) });
                lastUpdateDate(apiDebs + bundle + "_" + $(this).find("changeVersion:last").text().replace("v", "").trim() + "_iphoneos-arm.deb").then(res => { $("#release-date").append(res) });
                // $("#infoTable").append("<tr><th>Downloads</th><td>" +  + "</td></tr>");
                $("#infoTable").append("<tr><th>Category</th><td>" + $(this).find("category").text().trim() + "</td></tr>");

                $("#links").append("<tr><td><a href=\"" + $(this).find("github").text().trim() + "\" target=\"_blank\"><img src=\"https://is4-ssl.mzstatic.com/image/thumb/Purple113/v4/4b/75/74/4b757442-8ff0-1bcb-dfde-8d39fba370c4/AppIcon-0-1x_U007emarketing-0-7-0-85-220.png/460x0w.png\" />Github</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("twitter").text().trim() + "\" target=\"_blank\"><img src=\"https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/d3/95/33/d3953380-0fbb-a92e-3be4-d9c0daf90499/ProductionAppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/460x0w.png\" />Twitter</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("reddit").text().trim() + "\" target=\"_blank\"><img src=\"https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/3d/fa/7c/3dfa7c58-641e-73c9-73d6-979f4bdcfda7/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/460x0w.png\" />Reddit</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("mail").text().trim() + "\" target=\"_blank\"><img src=\"https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/c7/40/e5/c740e5f0-2a62-4fa7-dc1b-66ea3d519545/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-10.png/460x0w.png\" />Mail</a></td></tr>");
                $("#links").append("<tr><td><a href=\"" + $(this).find("paypal").text().trim() + "\" target=\"_blank\"><img src=\"https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/47/91/55/4791557c-5d1e-7357-9d5e-1eb20d3bb42b/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/460x0w.png\" />Paypal</a></td></tr>");
            });
            console.log("XML parsing done.");
        }
    });
});

$("img").bind("dragstart", function () {
    return false;
});
$("img").bind("mousedown", function () {
    return false;
});

async function lastUpdateDate(url) {
    return await new Promise((resolve, reject) => {
        var formatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
        try {
            // Switched to a GitHub-specific last commit
            // date fetching system
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.send();
            req.onload = () => {
                if (req.status == 200 && req.readyState == 4) {
                    console.log("Date successfully fetched for url: " + url);
                    resolve(new Date(JSON.parse(req.responseText)[0].commit.committer.date)
                        .toLocaleDateString("en-US", formatOptions));
                }
                else reject("Error (status: " + req.status + ", state: " + req.readyState + ")");
            }
        } catch (er) {
            reject(er.message);
        }
    });
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log("Query variable %s not found", variable);
}

// Inspired by repo.conorthedev.me/depiction/web (Silica?)
function compatible(works_min, works_max) {
    // iOS version detection by Dylan Duff
    // Does not work for iPadOS, as iPadOS is seen by the browser as a Mac :/
    let currentiOS = parseFloat(("" + (/CPU.*OS ([0-9_]{1,})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", ""));
    works_min = numerize(works_min);
    works_max = numerize(works_max);

    let text = document.getElementById("compatibility");
    let text_container = document.getElementById("compatibility-box");

    if (currentiOS < works_min) {
        text.innerHTML = "Your version of iOS is too old for this package. This package works from iOS " + works_min + "to iOS " + works_max + ".";
        text.style.color = "red";
        text_container.style.backgroundColor = "lightpink";
        text_container.style.border = "1px solid red";
    } else if (currentiOS > works_max) {
        text.innerHTML = "This package has not been tested with your iOS version. This package works from iOS " + works_min + "to iOS " + works_max + ".";
        text.style.color = "goldenrod";
        text_container.style.backgroundColor = "lightyellow";
        text_container.style.border = "1px solid goldenrod";
    } else if (String(currentiOS) != "NaN") {
        text.innerHTML = "This package works on your device!";
        text.style.color = "green";
        text_container.style.backgroundColor = "lightgreen";
        text_container.style.border = "1px solid green";
    } else {
        text.innerHTML = "Cannot determine your version. Open this page on an iOS device to check compatibility.";
        text.style.fontStyle = "italic";
    }
}

function numerize(x) {
    return x.substring(0, x.indexOf(".")) + "." + x.substring(x.indexOf(".") + 1).replace(".", "");
}
