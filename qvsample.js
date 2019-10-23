// QuickStart Sample Node.js Program for the IBM Cloud
// Use this sample to bootstrap your own logic into the IBM Cloud.  This code snippet 
// should be enough to one going to house a basic Node.js web application.  Later you will
// add code to support Services such as Databases, IBM Watson ...etc.  For now, to get
// started, modify this code snippet as you like, use QuickStart to push it up to the IBM Cloud 
// and see your changes take place
// 

// When working with the IBM Cloud, all file references must not be hard coded since we don't know
// where in the cloud we will land.  It is important for all references to be of the format of
// './finename.ext' or ./dir/finename.ext'.  That is why you will see that format on the file
// statements below

// Specify the required Node.js Services for this Sample web server 

var http  = require ('http');
var https = require ('https');
var fs    = require ('fs');
var tr    = require ('./qvsamplelib.js');  // External library for common functions


var listenPort = 8080;

const vcapserv = "./VCAP_SERVICES.json";
const vcapapp = "./VCAP_APPLICATION.json";

	
// Get the VCAP_SERVICES environment variables from the IBM Cloud	
 var  cfenv  = require("cfenv")
 var  cfobj = cfenv.getAppEnv();

 // If we happen to be running local on our desktop then read those same VCAP_SERVICE variables from our
 // VCAP_LOCAL set of files.  THese local vcap files are created by doing the following in the app directory
 // Issue:
 //          cf env server > server-vcap.json  (replace server name with your server name)
 //          q2cloud vcap server-vcap.json
 //
 // Those two commands already execute as part of the Quick2Cloud generated CLI commands so under normal conditions
 // the VCAP_LOCAL files are already in place.
 
 
if (cfobj.isLocal == true) {
    
	   var vapp         = fs.readFileSync("./VCAP_APPLICATION.json", "ascii"  ); 
	   cfobj.app        = JSON.parse(vapp);  // Needed to keep the cfobj.app an Object and not a string
       var vservices    = fs.readFileSync("./VCAP_SERVICES.json" , "ascii"  );
	   cfobj.services   = JSON.parse(vservices);  // Needed to keep the cfobj.services an Object and not a string
       
// Here are a few important bits of data that you can extract from the CFENV facility
//       console.log("List of Services=" ,  cfobj.getServices());
//       console.log("qvDB URL=" , cfobj.getServiceURL("qvDB"));
//       console.log("credentials=" , cfobj.getServiceCreds("qvDB"));      

// Look into the VCAP_APPLICATION and VCAP_SERVICES files to see all the fields you can access and
// take a look at CFENV NPM documentation to see some of the parsing capabilities the CFENV facility
// is capable of doing.
       
}

// Now, continue bringing up the web server


// Put out boiler messages that are seen on the node.js console.

console.log("QuickStart Sample Node.js Program designed and written by Paul Klein");
console.log("Copyright(c) Paul Klein Consulting - June 2019");
console.log("Designed specifically as a Bootstraping a Server for the IBM Cloud");
console.log(" ");
console.log("Enabling Port " + listenPort + " for both the IBM Cloud and LocalHost");

// If you provided a Cloudant Service as part of your College Course, then lets initialize it with two databases,
// MAKE SURE YOU ADD YOUR DATABASE Service NAME that you named it during the Service provisioning process
// Also, make sure you name your databases in LOWERCASE!
// createDB
//  First parm is the Database Service as named at the time you created the Service (it is also in the credentials)
//  Second parm is the name of the database "qvsample" will be used to keep count of the times qvsample was started
// Also, creates a database called "metering" it will keep track of any qvsample resource count you want.  Right now
// is is tracking the number of times someone comes to the homepage (/).  These are called visits in the database.
// You can see these database visits using the IBM Dashboard, clicking on the Cloudnat Service name and choosing the Cloudant 
// dashboard.  The Cloudant dashboard is pretty useful.

// Database calls are all async so they get created when Cloudant wants them created.  If you named something wrong or
// have a misspelling, you must recycle qvsample to get the metering to work.  If the credentials or the VCAP files did not
// get created correctly or they are missing or they were done outside of this directory - delete the Service by 
// issuing "cf delete-service userID-qvDB -f" then restarting College Course 101 and regenerate it.

// If no Cloudant Service or credentials were provisioned, the first DB call will figure that out and any dDatabase call after that 
// will just return, not harming any execution, only disabling the metering of your resources.

//**********************************************
//************* IMPORTANT **********************
//**********************************************
// You must add your Service Name to the following two statements for Cloudant to create a DB.  Change ibmID-DB to you database name

 if (tr.createDB("ibmID-qvDB", "qvsample")  == null) {console.log("Database qvsample failed creating");}
 if (tr.createDB("ibmID-qvDB", "qvmetering")  == null) {console.log("Database qvmetering failed creating");}
 
 // A few words about your use of Cloudant in IBM Cloud.  Initially, you are using the Cloudant Lite Plan which has restrictions.
 // Basically, you get around 10 reads, 5 writes per/second (which is not a lot.)  If you go over the limits your database
 // calls will fail and may disable all metering.  The way metering is written in this sample, care was taken so you would not
 // exceed those limits.  If you modify what gets logged and how much gets logged, or you use the database for other
 // purposes - keep in mind these limits because its easy to violate.  Also, you can upgrade from the Cloudant Lite plan
 // to the Cloudant standard plan, for just a little fee, and the standard plan should give you lots of headroom.
 
 
// Create an instance of a web server that receives requests from a web browser ('request') and 
// returns a response ('response') to be rendered at the web browser
http.createServer(function (request, response) {
	
	var opEnvironment;
	var oplanguage;
	var browserCookies; 
	var translatedURL;
	var ckDate;
	
//	console.log("Cookies=" + request.headers['cookie']);
//	console.log(request.headers);
	console.log("URL= " + request.url);
	

// Lets check for the browser's language,  operating system and any Cookies	
	
	try {
	opEnvironment = request.headers['user-agent'];
 	opLanguage = request.headers['accept-language'];
 	browserCookies = request.headers['cookie'];
	}
	catch {}

// Until supported, force to English

//  console.log("Language=" + opLanguage);	
	opLanguage = "en-US";
 	 	
// The URL may have some special characters embedded so we want to translate them  to a more usable form
 	translatedURL = tr.removeURLSpecialChars(request.url);
 	response.writeHead(200, {'Content-Type': 'text/html'});  // This must come before the Set-Cookie statement

// Lets see if we have a cookie that gives us the first time user came to this web server
 	ckDate =  tr.getCookie('ckdate', browserCookies);
 	if (ckDate == undefined) {console.log("No cookie found")}
 	
// If no Date cookie was found, lets set one with the current date indicating time of user's session with us
 	if (ckDate == undefined) { 
 	 	var date = new Date();
 	 	response.writeHead(200, {'Set-Cookie':'ckdate='+ date.toGMTString(),'Path':'/' });
 	}      
 	
// Now, lets serve up some web pages & web page elements to show how this web server could be used
// We do this by looking at the URL and firing off some logic based on the browser requests
 	
// The web browser will ask us for a tiny 16 x 16  icon representing our offering that it will put
// on the TAB next to our URL name.  Generate one using an online favicon maker
 	
 	if (request.url == '/favicon.ico') {
 	    var rspFavicon = fs.readFileSync('./favicon.ico');  
 	    response.end(rspFavicon);
 	}

// When there are no parameters on the URL, basically just arriving at our web page, then send out
// a redirect to 'index.htm' and display that instead.  This allows you to change  releases of
// your application by editing the redirect file and sending them to a new set of web displays.  It
// also allows you to revert to the old release by redirecting them back to the old web pages 	
 	
 	if (request.url == '/') {
 		var rspRedirect = fs.readFileSync('./redirect.htm');  // The file contains the redirect page
 		    response.end(rspRedirect);
 		    
// Here is where we do the metering.  This will count, in the Cloudant database, how many times your
// homepage was visited.  Again, you can view these stats by clicking the Service name in the IBM Dashboard and
// then selecting the Cloudant Dashboard
 		    
 		var urlPageLower = request.url.toLowerCase();
 	    tr.logVisits("qvmetering", urlPageLower);
 	}

// When a request for a specific web page is asked for, we serve it up 	
 	
  if (request.url.search('.htm') > 1) {
	  
	  try {
	  var rspPage = fs.readFileSync('.' + request.url);
	  }
	  catch (e) {console.log ("Could not read " + rspPage +  " - " + e)
		         response.end("Could not read " + rspPage +  " - " + e )}
	    response.end(rspPage);
     }
 	
 	
// If our web page has embeded graphics then we will have to provide them as well
// For now, lets restrict our web page to using only .jpgs, .pngs and .gifs - however, one can see
// how easy it is to add other kinds
 	
  if (request.url.search('.png') > 0 || 
	  request.url.search('.jpg') > 0 ||
      request.url.search('.gif') > 0 ) {
	  var rspPage = fs.readFileSync('.' + request.url);
	  response.end(rspPage);
    }
  
// If our web page has some java-script includes then we will have to provide them as well.  This
// occurs if the web page has a <script> src=name.js </script>.  
  
  if (request.url.search('.js') > 0 ) {
	  try {
	  var rspPage = fs.readFileSync('.' + request.url);
	  }
	  catch (e) {console.log ("Could not read " + rspPage +  " - " + e)
	         response.end("Could not read " + rspPage +  " - " + e )}
	  response.end(rspPage);
  }
  
  
// If our web page is asking for a file download then we will provide that as a zip or text file
// We will indicate that what is returned is to be a file and not a web page
  
  if (request.url.search('.zip') > 0 || request.url.search('.txt') > 0) {
	  var rspURL = request.url;
	  rspURL = rspURL.replace("?", "");
	  var rspFile = fs.readFileSync('.' + rspURL);
	  response.writeHead(200, { 'Content-Disposition': 'attachment' });
  	  response.writeHead(200, { 'Content-Encoding': 'compress' });
	  response.end(rspFile);
	}
  
 // console.log(response._header); 
  
}) 

  .listen(8080)  ;	
	
 	
 




	      	 

     