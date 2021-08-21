$(() => {
    let bundle;
    for (const vari of location.search.substring(1).split("&")) {
        const pair = vari.split("=");
        if (decodeURIComponent(pair[0]) == "p") {
            bundle = decodeURIComponent(pair[1]);
        }
    }

    if (!bundle) {
        console.log("Package not found. Aborting.");
        return;
    }

    let changelogExport = "";

    console.log("Package: " + bundle);
    const bundlePath = location.href.split("/").slice(0, -2).join("/") + "/" + bundle;
    const debsAPI = "https://api.github.com/repos/RedenticDev/Repo/commits?path=debs/";

    $.ajax({
        type: "GET",
        url: bundlePath + "/info.xml",
        dataType: "xml"
    }).done(xml => {
        console.log("Beginning XML parsing");

        // Parse the xml file and get data
        $(xml).find("packageInfo").each(function () {
            document.title = "Changelog of " + $(this).find("name").text().trim();

            $(xml).find("change").each(function () {
                const version = $(this).find("changeVersion").text().trim();
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
                const version = $(this).find("changeVersion").text().trim();
                lastUpdateDate(debsAPI + bundle + "_" + version.replace("v", "").trim() + "_iphoneos-arm.deb").then(res => $("#" + version.replaceAll(".", "")).append("- (" + res + ")")).catch(error => console.error(error));
            });
        });
        console.log("XML parsing done.");
    }).fail(() => {
        $("#changelog").append("Package \"" + bundle + "\" not found. Incorrect parameter or no depiction for this package.");
    });
});

$("img").bind("dragstart", () => false);
$("img").bind("mousedown", () => false);

let updateDatesDict = {};
/**
 * GitHub-specific commit-based date fetching system
 * 
 * Input url: https://api.github.com/repos/RedenticDev/Repo/commits?path=debs/<package>.deb
 * 
 * 1. Get "sha" from input from 1st child (counter)
 * 2. Go to https://api.github.com/repos/RedenticDev/Repo/contents/debs/<package>.deb?ref=<sha>
 *      - if it contains "message": "Not Found" -> counter +1 and back to 1.
 *      - else get and return date from 1st child of 1.
 */
function lastUpdateDate(url) {
    function makeRequest(getUrl) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    resolve(xhr.response);
                }
                reject(xhr.status);
            }
            xhr.onerror = () => reject(xhr.status);
            xhr.open("GET", getUrl);
            xhr.send();
        });
    }

    return new Promise((resolve, reject) => {
        // Almost never goes into this if because requests are started almost at the same time, but who knows
        if (url in updateDatesDict) {
            console.log("Using cached value for url " + url + " (" + updateDatesDict[url] + ")");
            resolve(updateDatesDict[url]);
        } else {
            let currentCommit = 0;
            const requests = () => {
                makeRequest(url).then(response => {
                    makeRequest(String(url).replace("mmits?path=", "ntents/").concat("?ref=", JSON.parse(response)[currentCommit].sha)).then(_ => {
                        // Good value
                        const date = new Date(JSON.parse(response)[currentCommit].commit.author.date);
                        console.log("Date successfully fetched for url: " + url + " (" + date + ")");
                        const formattedDate = date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
                        updateDatesDict[url] = formattedDate;
                        resolve(formattedDate);
                    }).catch(_ => {
                        // Retry with next commit of file
                        currentCommit++;
                        console.warn("Retrying call with commit " + currentCommit + " for url " + url);
                        requests();
                    });
                }).catch(errorStatus => {
                    reject("Error getting sha value (" + errorStatus + ")");
                });
            }
            requests();
        }
    });
}
