/**
 * Automatically get date for footer
 */
document.getElementsByTagName("footer")[0].innerHTML = "<p>© Copyright 2020-" + new Date().getFullYear() + " • Redentic</p>";

/**
 * Toggle on/off the dropdown spoiler '_WHOAMI'
 */
document.getElementById("collapsible").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("active");
    const content = e.currentTarget.nextElementSibling;
    if (content.style.height === "0px" || content.style.height === "") {
        content.style.height = content.scrollHeight + "px"; // magic property
    } else {
        content.style.height = "0px";
    }
});

/**
 * Dynamic markdown section in _WHOAMI
 */
new Promise((resolve, reject) => {
    try {
        const req = new XMLHttpRequest();
        req.onload = () => {
            if (req.readyState == 4 && req.status == 200) resolve(req.responseText);
            reject("An error occurred.\n(readyState = "
                + req.readyState + ", status = " + req.status + ")");
        }
        req.open("GET", "https://raw.githubusercontent.com/RedenticDev/RedenticDev/master/README.md", true);
        req.send();
    } catch (er) {
        reject(er.message);
    }
}).then(
    resolve => document.getElementById("markdown").innerHTML = marked(resolve),
    reject => document.getElementById("markdown").innerHTML = reject
);

/**
 * Add packages (almost) automatically in the appropriate section
 */
$(() => {
    // I have to put existing packages manually as GitHub Pages doesn't
    // accept Node.JS/PHP, so I can't browse subfolders automatically :(
    const packages = ["com.redenticdev.sbcolors", "com.redenticdev.fastlpm", "com.redenticdev.respringpack", "com.redenticdev.appmore", "com.redenticdev.swrespringpack"];

    // Random order with Chrome/Opera/Safari 14(?)+
    $.each(packages, (i, actualPackage) => {
        $.ajax({
            type: "GET",
            url: location.href + "depictions/" + actualPackage + "/info.xml",
            dataType: "xml",
            success: xml => {
                $(xml).find("packageInfo").each(() => {
                    $("section#packages").append("<a href=\"depictions/?p=" + actualPackage + "\" target=\"_blank\" class=\"package\">");
                    $("section#packages a:last-child").append("<img src=\"depictions/" + actualPackage + "/icon.png\" alt=\"\" />");
                    $(xml).find("name").each(function () {
                        $("section#packages a:last-child").append("<h3>" + $(this).text().trim() + "</h3>")
                    });
                    $(xml).find("description:first").each(function () {
                        $("section#packages a:last-child").append("<p>" + $(this).text().trim() + "</p>")
                    });
                    $("section#packages").append("</a>");
                });
            }
        });
    })
});

/**
 * Remove "Add to" section if not on iOS/iPadOS
 */
document.addEventListener("readystatechange", () => {
    if (document.readyState != "interactive") return;

    const section = document.getElementById("add-repo");
    const alert = document.getElementById("alert");
    function iOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13+ detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    if (section && alert && iOS()) {
        alert.style.display = "none";
        section.style.display = "flex";
    }
}, false);

/**
 * Add devices in section dynamically
 */
document.addEventListener("readystatechange", () => {
    if (document.readyState != "interactive") return;

    const devices = [
        ["taurine", "iPhone XS", "iOS 14.3", "64 GB", "Space Gray", "<strong><em>(Main device)</em></strong>"],
        ["checkra1n", "iPhone 7", "iOS 14.3", "128 GB", "PRODUCT(RED)"],
        ["checkra1n", "iPhone 6s", "iOS 13.7", "128 GB", "Space Gray"],
        ["checkra1n", "iPhone 6", "iOS 12.5.4", "64 GB", "Gold"],
        ["checkra1n", "iPad 6", "iPadOS 14.6", "32 GB", "Gold"],
        ["MacBook 2017", "macOS 11.5.1 Big Sur", "i5", "8 GB / 512 GB", "Space Gray"],
        ["Apple Watch Series 5", "watchOS 7.3.3", "Space Gray"],
        ["AirPods", "1st Gen", "Wireless Case"]
    ];
    let content = "";
    let spaceplease = false;

    devices.forEach(line => {
        content += "<tr><td>";
        line.forEach((word, index) => {
            switch (word) {
                case "unc0ver":
                    word = "<img src=\"https://unc0ver.dev/favicon.ico\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                case "taurine":
                    word = "<img src=\"https://taurine.app/assets/images/favicon.png\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                case "odyssey":
                    word = "<img src=\"https://theodyssey.dev/assets/images/favicon.png\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                case "chimera":
                    word = "<img src=\"https://chimera.coolstar.org/img/icon.png\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                case "electra":
                    word = "<img src=\"https://coolstar.org/electra/favicon.ico\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                case "checkra1n":
                    word = "<img src=\"https://checkra.in/img/favicon.png\" alt=\"" + word + "\" />";
                    content += word;
                    spaceplease = true;
                    return;

                default:
                    break;
            }
            if (index == 0) {
                if (!word.startsWith("<")) content += "<strong>" + word + "</strong>";
            } else if ((index == line.length - 1 && word.startsWith("<")) || spaceplease) {
                if (spaceplease) {
                    word = "<strong>" + word + "</strong>";
                    spaceplease = false;
                }
                content += " " + word;
            } else {
                content += " • " + word;
            }
        });
        content += "</td></tr>\n";
    });

    document.getElementById("devices-list").innerHTML += content;

}, false);

/**
 * Browser detector
 */
if (!/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
    document.getElementsByTagName("body")[0].className += " not-apple";
    document.getElementById("screenshots")?.classList.add("not-apple");
}
