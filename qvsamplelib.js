// Function library where all common services reside.  Add your own services at the bottom
// but don't forget to put the '},' between each service with the last service just ending
// in a '}'



// URLs can embed special characters if they have a URI portion coded.  This function translates
// these special characters into something more usable in web page logic.  For example 
// /index.htm?cookie1= paul&cookie2=paul klein will look like the following in the URL
// /index.htm?cookie=%20paul=cookie1&cookie2=paul%20klein

var globalDBflg = true;
var cloudant; 


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
 
  
 
 },  

//This will create a Cloudant database.  We will read the VCAP variables 
//and get the DB URL and use it to bind to a Cloudant instant.  
// createDB 
//   servName - this is the Cloudant Service name given when it was provisioned
//   dbName - this is the database name to create
//This runs async and there is no exact way for the caller to know when the passed database gets created, hopefully it will
//be quick.  The caller will make another call later, to another function, to read and write to that database.  All this function 
//does is create the database.  Note: if the database already exists, then no harm no foul, just keep using it as if it
//was created.
 exports.createDB = function(servName, dbName)  { 'use strict';  // Required by Cloudant
	 if (globalDBflg == false ) {return null;}
	 var  fs     = require ('fs');
	 var  cfenv  = require("cfenv")
	 
// cfenv needs the name of the application.  Some say it can figure it out by itself, I take no chances.  If you change the sample's
// name don't forget to change it here a well.
	 
	 var  cfobj  = cfenv.getAppEnv("qvsample");
	 
//Get the Cloudant VCAP Variables from the system.  They are already in cfenv if this running in the
//cloud or located in a file on the desktop if this is local.  If we can't find any part of the Cloudant Service , or the
//credentials are missing, then we return null, meaning, we run but with database access not working.
	 
	 if (cfobj.isLocal == true) {
		    
	  try { var vapp = fs.readFileSync("./VCAP_APPLICATION.json", "ascii"  );}
	  catch {console.log("app vcap file missing") ; globalDBflg = false ; return null };	 
	  cfobj.app = JSON.parse(vapp);  
	  
	  try {var vservices  = fs.readFileSync("./VCAP_SERVICES.json" , "ascii"  );}
	  catch {console.log("serv vcap file missing"); globalDBflg = false ; return null  }
	  cfobj.services = JSON.parse(vservices);  	
	  }
	 
	  console.log("qvDB URL=" , cfobj.getServiceURL(servName));
	 
//OK, we now have the Cloudant Service credentials and ready to do database work.  Create an instance inside quick2cloud 
//of the Cloudant Service and save the cloudant service returned object in Global variable storage since it will be the same
//value for the life of qvsample
//Note: the Cloudant Service URL contains the userID and Password in its very cryptic name.

// This is the very cool part of using Cloudant locally.  You just give it the uRL of the service in IBM Cloud and it uses it
// as if it were on your desktop.  By picking your database names carefully, you can have a set of databases for your production
// work and a set of databases for you testing locally on the desktop.  You can also install a local version of Cloudant on the 
// desktop and use that URL and not touch the one in IBM's Cloud at all.
	 
	  try { cloudant = require("cloudant")(cfobj.getServiceURL(servName));} // Relates Cloudant to this URL
	  catch {console.log("Cloudant Service not found"); globalDBflg = false; return null }
	 
//Ok, we have a connection to Cloudant in IBM's Cloud and now ready to create the database being requested
//This function is async so the database will get created when IBM Cloud wants it to.  However, this database 
//may have been created prior so it is not unreasonable that it exists.  If so, just log it out and move on
//as if it just got created.
	   	  
	  cloudant.db.create(dbName, function(err, res) {
//  if (err) {console.log("DB=" + dbName + " failed creation because it may already exist and will be reused"); } 
	           
	    });
	  return 0;
	},
	
// The database has been created.

	
	
// This function meters the number of visits a qvsample resource has had.  Basically, it takes the name in the 
// id, such as a webpage name, and counts this call as a hit increasing that webpage's visit count by one.
//   dbName - is the name of the database to use
//   id - is the resource name to have its visit count increased, resources are all initialized with 1 on the counter
// Note: the variable cloudant is declared at top of module in Global storage, its value was gotten from a previous 
// database create function
		  
// If you added this call in the mainline and you don't see the counts in the database, via IBM's cloudant Dashboard, then the most
// likely reason is you misspelled the database name on either the createDB or logVisits function call.  That problem will 
// shut off metering for the life of qvsample and will require a restart to it back going again.  The reason for the shutoff
// is because the database costs money to make calls to and we don't want to call it, over and over, just to get errors logged
// in our app log while running up the bill.	
	
	
exports.logVisits = function(dbName, id)  { 'use strict';
	 
	  if (globalDBflg == false) {return null;}
	  var db = cloudant.use(dbName);
	  
// we start by async reading a json object from the database.  Thre are a couple of reasons why this read may fail.  One,
// the database exists but no object has yet been created.  That failed read is fine, it means we just need to insert the first
// object for the id.  Another reason it can fail is because the database does not exists - which is more problematic
	  
	  db.get(id, function(err, doc)  {
		  if (err) { 
	 	       db.insert({
				   name: "visits",
				   value: 1,
				     }, id, function(err, doc) {
				   if (err) { console.log("Error in initial insert for recording resource visits");
				      globalDBflg=false; 
				      return  null ;
				     } else  {}
				  });  
			 }  

// OK, either the resource was already being metered or we added it to be metered. Either way we need to 
// read it back to update it.  We use the _rev id on the read to target what we will be updating.  We read 
// the old resource count, then add 1, then write it back.
			 
		   else {		  
			      db.get(id, function(err, doc)  {
				   
		   	        db.insert({
		 	        name: "visits",
		 	        value: doc.value+1,
		 	        _rev: doc._rev
		 	       }, id, function(err, doc) { });
		    });
		   }
		});
	  
	 
	 // Metering is complete, the count to what you have been measuring has been increased by 1
	   return 0;
	 	 } 
		  
  