// Function library where all common services reside.  Add your own services at the bottom
// but don't forget to put the '},' between each service with the last service just ending
// in a '}'



// URLs can embed special characters if they have a URI portion coded.  This function translates
// these special characters into something more usable in web page logic.  For example 
// /index.htm?cookie1= paul&cookie2=paul klein will look like the following in the URL
// /index.htm?cookie=%20paul=cookie1&cookie2=paul%20klein

exports.removeURLSpecialChars = function(url)

 {
	var translatedURL = url;
	translatedURL = translatedURL.replace(/\%3A/g, ':');  // :
    translatedURL = translatedURL.replace(/\%5C/g, '\\')  // \
    translatedURL = translatedURL.replace(/\+/g, ' ');    // +
    translatedURL = translatedURL.replace(/\%2F/g, '/');  // /
    translatedURL = translatedURL.replace(/\%3F/g, '?');  // ?
    translatedURL = translatedURL.replace(/\%26/g, '&');  // &
    translatedURL = translatedURL.replace(/\%40/g, '@');  // @ 
	return(translatedURL);
	
 },
 
 
 // Here is a function that scans through all the cookies looking for a specific name and when
 // found it returns the cookie's value.  If the cookie is not found then returns undefined
 
 exports.getCookie = function(cookie, browserCookies)
 {
        const cookieName = 0;
        const cookieValue = 1;
	    
        if (browserCookies == undefined) {return(undefined)};
	    var cmCookie = browserCookies.split(";");
 	    for (var i = 1; i <= cmCookie.length; i++) {
 	      var cmCookieElm = cmCookie[i-1].split("=");
 	      if (cmCookieElm[cookieName].search(cookie) != -1) {return(cmCookieElm[cookieValue])}
 	    }		
 	 return(undefined);
 
  
 
 }  // put a ',' after this when you add more functions
 