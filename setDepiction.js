
$(function(){
    var bundle = getQueryVariable('p');

    if(bundle != undefined){
        //Now fetch the appropriate file from this query string
    }

    console.log(getQueryVariable('p'));
    console.log("Fetching XML");
    var getUrl = window.location;
    var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    var pathTo = baseUrl + "/" + bundle;

    $.ajax({
        type: "GET",
        url: pathTo + "/info.xml",
        dataType: "xml",
        success: function (xml) {
            console.log("Beginning XML Parsing");

            // Parse the xml file and get data
            $(xml).find('packageInfo').each(function(){
                  // document.getElementById("packageTitle").innerHTML = $(this).find("name").text();
                   //document.getElementById("bundleId").innerHTML = $(this).find("bundleId").text();
                   //document.getElementById("version").innerHTML = $(this).find("version").text();

                   document.getElementById("miniOS").innerHTML = $(this).find("miniOS").text();
                   document.getElementById("maxiOS").innerHTML = $(this).find("maxiOS").text();


                   var UA = navigator.userAgent;
                   var regEx = /\iPhone OS ([^)]+)\like/;
                   var match = regEx.exec(UA);
                   if(match != null){
                      var deviceString = match.pop();
                      var version = deviceString.replace(/\_/g, '.');

                      //Parse ios version
                      var lowOS = document.getElementById("miniOS").innerHTML.trim().split('.');
                      var highOS = document.getElementById("maxiOS").innerHTML.trim().split('.');
                      var userOS = version.trim().split('.');
                      var userIsLower = false;
                      var userIsHigher = false;


                     if(lowOS.length > userOS.length){
                       var i = 0;
                       for (i = 0; i < userOS.length; ++i) {
                         if(lowOS[i] > userOS[i])
                            userIsLower = true;
                            if(lowOS[i] < userOS[i])
                              break;
                       }
                     }else{
                       var i = 0;
                       for (i = 0; i < lowOS.length; ++i) {
                         if(lowOS[i] > userOS[i])
                            userIsLower = true;
                          if(lowOS[i] < userOS[i])
                            break;
                       }
                     }

                     if(highOS.length > userOS.length){
                       var i = 0;
                       for (i = 0; i < userOS.length; ++i) {
                         if(highOS[i] < userOS[i]){
                            userIsHigher = true;
                         }
                          if(highOS[i] > userOS[i])
                            break;
                       }
                     }else{
                       var i = 0;
                       for (i = 0; i < highOS.length; ++i) {
                         if(highOS[i] < userOS[i]){
                           userIsHigher = true;
                          }
                          if(highOS[i] > userOS[i])
                            break;
                       }
                       if ((userOS[i] > 0) && (userOS[i - 1] == highOS[i - 1]))
                           userIsHigher = true;
                   }

                   // if(userIsHigher == false && userIsLower == false){
                   //    document.getElementById("Compatibility").style["backgroundColor"] = "#6dff91";
                   //    document.getElementById("youriOS").innerHTML = "Your device is compatible";
                   //    document.getElementById("compatibilityIcon").innerHTML = "😀";
                   //
                   // }else {
                   //   document.getElementById("Compatibility").style["backgroundColor"] = "#ff5151";
                   //   document.getElementById("youriOS").innerHTML = "Your device is not compatible";
                   //   document.getElementById("compatibilityIcon").innerHTML = "😞";
                   //
                   // }
                 }else{
                   // document.getElementById("Compatibility").style["backgroundColor"] = "#fff45b";
                   // document.getElementById("youriOS").innerHTML = "Your device could not be identified";
                   // document.getElementById("compatibilityIcon").innerHTML = "⚠️";

                 }

                   $(xml).find('description').each(function(){
                       $("#description" ).append('<li>' +$(this).text()+ '</li>');
                   });

                   $(xml).find('dependency').each(function(){
                       $("#dependencies" ).append('<li>' +$(this).text()+ '</li>');
                   });

                   $(xml).find('linkName').each(function(){
                       $("#dependencies" ).append('<li>' +$(this).text()+ '</li>');
                   });

                   $(xml).find('change').each(function(){
                       $("#changeLog" ).append('<li>' + '<h1>' + $(this).find("changeVersion").text() + '</h1>');
                       $(this).find('changeDescription').each(function(){
                            $("#changeLog" ).append('<h2>' + $(this).text()+ '<h2>');
                       });
                       $("#changeLog" ).append('<li>');
                   });

                   $(xml).find('screen').each(function(){
                       $("#screenshots" ).append('<li>' + '<img src="' + pathTo + "/" + $(this).text() + '" draggable="false" />' + '</li>');
                   });
            });

        }
    });
});


$("img").bind('dragstart', function(){
    return false;
});
$("img").bind('mousedown', function(){
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
    console.log('Query variable %s not found', variable);
}
