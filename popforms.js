// Populate all Input Forms who's 'name' starts with 'ck' with their Cookie value
// Loops thru all the forms on page and performs this task.  Works with any form.
    
    var ckField = document.querySelectorAll('input');
    var ckCookies = document.cookie.split(";"); 
    
// Check every 'ck' named input field to see if it has associated Cookie    
    for (var i = 1; i <= ckField.length; i++) {
    	if (ckField[i-1].name != '') {
    	   for (var j = 1; j <= ckCookies.length; j++) {   
    	       ckElement = ckCookies[j-1].split('=');

// If a 'ck' named input field matches a Cookie then replace form value using the Cookie value    	       
                 if (ckElement[0].indexOf(ckField[i-1].name) >= 0) {ckField[i-1].value = ckElement[1] ;}   // this is where i left off
    	          
        		}
    	  
    	    } 
       
    	}