/**
 * Add packages (almost) automatically in the appropriate section
 */
$(function () {
    // I have to put existing packages manually as GitHub Pages doesn't
    // accept Node.JS/PHP, so I can't browse subfolders automatically :(
    const packages = ["sbcolors", "fastlpm", "respringpack"];

    // Random order with Chrome/Opera
    $.each(packages, function (i, actualPackage) {
        $.ajax({
            type: "GET",
            url: window.location.origin + "/depictions/com.redenticdev." + actualPackage + "/info.xml",
            dataType: "xml",
            success: function (xml) {
                console.log(i)
                $(xml).find("packageInfo").each(function () {
                    $("section#packages").append("<a href=\"depictions/?p=com.redenticdev." + actualPackage + "\" target=\"_blank\" class=\"package\">");
                    $("section#packages a:last-child").append("<img src=\"depictions/com.redenticdev." + actualPackage + "/icon.png\" alt=\"\" />");
                    $(xml).find("name").each(function () {
                        $("section#packages a:last-child").append("<h3>" + $(this).text().trim() + "</h3>");
                    });
                    $(xml).find("description:first").each(function () {
                        $("section#packages a:last-child").append("<p>" + $(this).text().trim() + "</p>");
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
document.onreadystatechange = function () {
	var section = document.getElementById("add-repo");
	var alert = document.getElementById("alert");
	function iOS() {
		return [
		  'iPad Simulator',
		  'iPhone Simulator',
		  'iPod Simulator',
		  'iPad',
		  'iPhone',
		  'iPod'
		].includes(navigator.platform)
		// iPad on iOS 13(+?) detection
		|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
	}
	if (section && alert && iOS()) {
		alert.style.display = "none";
		section.style.display = "flex";
	}
}
