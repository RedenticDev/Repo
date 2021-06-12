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
    var apiDebs = "https://api.github.com/repos/RedenticDev/redenticdev.github.io/commits?path=debs/";

    $.ajax({
        type: "GET",
        url: bundlePath + "/info.xml",
        dataType: "xml",
        success: function (xml) {
            console.log("Beginning XML parsing");

            // Parse the xml file and get data
            $(xml).find("packageInfo").each(function () {
                document.title = "Changelog of " + $(this).find("name").text().trim();

                $(xml).find("change").each(function () {
                    var version = $(this).find("changeVersion").text().trim();
                    changelogExport += "<li><h1>" + version + " <span id=\"" + version.replaceAll(".", "") + "\"></span></h1>";
                    $(this).find("changeDescription").each(function () {
                        changelogExport += "<h2>- " + $(this).text().trim() + "</h2>";
                    });
                    changelogExport += "</li>";
                });
                $("#changelog").append(changelogExport);
            });
            // Add versions at proper places
            $(xml).find("packageInfo").each(function () {
                $(xml).find("change").each(function () {
                    var version = $(this).find("changeVersion").text().trim();
                    lastUpdateDate(apiDebs + bundle + "_" + version.replace("v", "").trim() + "_iphoneos-arm.deb").then(res => $("#" + version.replaceAll(".", "")).append("- (" + res + ")"));
                });
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
    return new Promise((resolve, reject) => {
        var formatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
        try {
            // Switched to a GitHub-specific last commit
            // date fetching system
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.send();
            req.onload = () => {
                if (req.status == 200 && req.readyState == 4) {
                    let date = new Date(JSON.parse(req.responseText)[0].commit.committer.date);
                    console.log("Date successfully fetched for url: " + url + " (" + date + ")");
                    resolve(date.toLocaleDateString("en-US", formatOptions));
                }
                else reject("Error (status: " + req.status + ", state: " + req.readyState + ")");
            }
        } catch (er) {
            reject(er.message);
        }
    });
}

function getQueryVariable(variable) {
    var query = location.search.substring(1);
    var vars = query.split("&");
    for (let vari of vars) {
        var pair = vari.split("=");
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log("Query variable %s not found", variable);
}
