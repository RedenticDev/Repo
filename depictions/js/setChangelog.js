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
    const debsAPI = "https://api.github.com/repos/RedenticDev/redenticdev.github.io/commits?path=debs/";

    $.ajax({
        type: "GET",
        url: bundlePath + "/info.xml",
        dataType: "xml",
        success: xml => {
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
                    lastUpdateDate(debsAPI + bundle + "_" + version.replace("v", "").trim() + "_iphoneos-arm.deb").then(res => $("#" + version.replaceAll(".", "")).append("- (" + res + ")"));
                });
            });
            console.log("XML parsing done.");
        }
    });
});

$("img").bind("dragstart", () => false);
$("img").bind("mousedown", () => false);

function lastUpdateDate(url) {
    return new Promise((resolve, reject) => {
        const formatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
        try {
            // Switched to a GitHub-specific last commit
            // date fetching system
            const req = new XMLHttpRequest();
            req.onload = () => {
                if (req.status == 200 && req.readyState == 4) {
                    const date = new Date(JSON.parse(req.responseText)[0].commit.committer.date);
                    console.log("Date successfully fetched for url: " + url + " (" + date + ")");
                    resolve(date.toLocaleDateString("en-US", formatOptions));
                } else reject("Error (status: " + req.status + ", state: " + req.readyState + ")");
            }
            req.open("GET", url, true);
            req.send();
        } catch (er) {
            reject(er.message);
        }
    });
}
