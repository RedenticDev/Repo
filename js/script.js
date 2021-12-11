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
        req.open("GET", "https://raw.githubusercontent.com/RedenticDev/RedenticDev/master/README.md");
        req.send();
    } catch (er) {
        reject(er.message);
    }
}).then(
    resolve => document.getElementById("markdown").innerHTML = marked.parse(resolve),
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
    $.each(packages, (_, actualPackage) => {
        $.ajax({
            type: "GET",
            url: location.href + "depictions/" + actualPackage + "/info.xml",
            dataType: "xml"
        }).done(xml => {
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
        }).fail(() => console.warn(actualPackage + " not found!"));
    });
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
        ["iPhone 13 Pro", "iOS 15.1.1", "256 GB", "Graphite"],
        ["taurine", "iPhone XS", "iOS 14.3", "64 GB", "Space Gray"],
        ["checkra1n", "iPhone 7", "iOS 14.3", "128 GB", "(PRODUCT)<sup>RED</sup>"],
        ["checkra1n", "iPhone 6s", "iOS 13.7", "128 GB", "Space Gray"],
        ["checkra1n", "iPhone 6", "iOS 12.5.5", "64 GB", "Gold"],
        ["checkra1n", "iPad 6", "iPadOS 14.8", "32 GB", "Gold"],
        ["MacBook Pro 2021", "macOS 12.0.1 Monterey", "M1 Pro 10C/16C", "16 GB / 1 TB", "Space Gray"]
    ];

    function wordToImage(word) {
        switch (word) {
            case "unc0ver":
                return "<img src=\"https://unc0ver.dev/favicon.ico\" alt=\"" + word + "\" /> ";

            case "taurine":
                return "<img src=\"https://taurine.app/assets/images/favicon.png\" alt=\"" + word + "\" /> ";

            case "odyssey":
                return "<img src=\"https://theodyssey.dev/assets/images/favicon.png\" alt=\"" + word + "\" /> ";

            case "chimera":
                return "<img src=\"https://chimera.coolstar.org/img/icon.png\" alt=\"" + word + "\" /> ";

            case "electra":
                return "<img src=\"https://coolstar.org/electra/favicon.ico\" alt=\"" + word + "\" /> ";

            case "checkra1n":
                return "<img src=\"https://checkra.in/img/favicon.png\" alt=\"" + word + "\" /> ";

            default:
                return "<strong>" + word + "</strong>";
        }
    }

    let content = "";
    devices.forEach((line, lineNumber) => {
        content += "<tr><td>";
        line.forEach((word, index) => {
            if (index == 0) {
                word = wordToImage(word); // For all first words
            } else if (index == 1 && wordToImage(line[0]).startsWith("<img")) {
                word = "<strong>" + word + "</strong>"; // Backup for words after img
            } else if (index == line.length - 1 && lineNumber == 0) {
                word += " <strong><em>(Main device)</em></strong>"; // First line is always main device
            }
            content += word + (index < line.length - 1 && !word.startsWith("<img") ? " • " : "");
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
