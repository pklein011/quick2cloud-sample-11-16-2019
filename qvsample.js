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

var vcapS =  {
	  "cloudantNoSQLDB": [
	                      {
	                       "binding_name": null,
	                       "credentials": {
	                        "apikey": "35T_T6revOJTDXcSNEtSVLIA9ZlWVKmoZF8XjYek6U6f",
	                        "host": "66662d51-5162-4a6a-ac4b-9755b37b6e18-bluemix.cloudantnosqldb.appdomain.cloud",
	                        "iam_apikey_description": "Auto-generated for binding f818cc19-6c18-43be-ab26-27040d46dcf6",
	                        "iam_apikey_name": "Cloudant-ds",
	                        "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/73b1bf3361064d5fb259cbe6c6cdae09::serviceid:ServiceId-7d2eee0e-8f70-42bd-8382-f5cbb590ccd0",
	                        "password": "2cd19928ee68a92b9263df18da986ebba41633e2554a73bdfa7065d40f03e2e7",
	                        "port": 443,
	                        "url": "https://66662d51-5162-4a6a-ac4b-9755b37b6e18-bluemix:2cd19928ee68a92b9263df18da986ebba41633e2554a73bdfa7065d40f03e2e7@66662d51-5162-4a6a-ac4b-9755b37b6e18-bluemix.cloudantnosqldb.appdomain.cloud",
	                        "username": "66662d51-5162-4a6a-ac4b-9755b37b6e18-bluemix"
	                       },
	                       "instance_name": "qvDB",
	                       "label": "cloudantNoSQLDB",
	                       "name": "qvDB",
	                       "plan": "Lite",
	                       "provider": null,
	                       "syslog_drain_url": null,
	                       "tags": [
	                        "data_management",
	                        "ibm_created",
	                        "lite",
	                        "ibm_dedicated_public"
	                       ],
	                       "volume_mounts": []
	                      }
	                     ]
	                    }
	                      ;
     

var vcapA = {
	  "application_id": "0e2f8bf9-f284-4f84-9628-53be08d5b9cb",
	  "application_name": "qvserver",
	  "application_uris": [
	   "qvserver-grouchy-puku.mybluemix.net"
	  ],
	  "application_version": "ae7d4450-7b10-4af5-9ff8-e457d3457a49",
	  "cf_api": "https://api.us-south.cf.cloud.ibm.com",
	  "limits": {
	   "disk": 1024,
	   "fds": 16384,
	   "mem": 128
	  },
	  "name": "qvserver",
	  "space_id": "1c226db1-24c7-4644-ba99-e754a6ce6160",
	  "space_name": "dev",
	  "uris": [
	   "qvserver-grouchy-puku.mybluemix.net"
	  ],
	  "users": null,
	  "version": "ae7d4450-7b10-4af5-9ff8-e457d3457a49"
	 } ;
	 
	
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
       console.log("List of Services=" ,  cfobj.getServices());
       console.log("qvDB URL=" , cfobj.getServiceURL("qvDB"));
       console.log("credentials=" , cfobj.getServiceCreds("qvDB"));      

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
	opEnvironment = request.headers['user-agent'];
 	opLanguage = request.headers['accept-language'];
 	browserCookies = request.headers['cookie'];
 	 	
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
	
 	
 




	      	 

     