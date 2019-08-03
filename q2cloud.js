// Quick2Cloud command processor
// Houses various command features to help with Cloud Deployments
// 
// Paul Klein
// pklein@us.ibm.com

const fs = require('fs');

const vserv     = "VCAP_SERVICES";
const vapp      = "VCAP_APPLICATION";
const cfenvApp  = "application";
const cfenvServ = "services";
const cfexten   = ".json";
var   cmdOption  = 0;

//Lets get the existing vcap file name that was passed into us
var myargv = process.argv;

if (myargv[2] == undefined  ||  myargv[3] == undefined) {
    console.log("q2Cloud is missing required input parameters");
    return
}

// Process the feature to read a vcap file, generated ibm's cf env command and parse its VCAP output into two files
// that are used to feed the CFENV facility in a Cloud Application.  See the Quick2Cloud Sample Web Server for
// how to use the CFENV command inside an application.  Also, read the CFENV NPM documentation.

if (myargv[2].toLowerCase() == "vcap") {
cmdOption = 1;	

// This section processes the conversion of the "cf env server > file" command's output into CFENV
// format to be used in an application
	
// Lets get the existing vcap file name that was passed into us
var myargv = process.argv;
var vcapIN = myargv[3];

// If an input file was given then read it in a proceed
if (vcapIN != null) 
 {
	var vcapContents = "";
	
	try { 
	vcapContents = fs.readFileSync(__dirname + '\\'  + vcapIN);	
	}
	
    catch (e) {console.log("Q2Cloud VCAP  was passed a file that does not exist");
	    return ;}

// Processing VCAP_SERVICES first.  We do this by looking for it and if not found bypass and go right
// to processing VCAP_APPLICATION
	

// We found a VCAP_SERVICE definition
	var x = String(vcapContents).search(vserv)

// Do we have a VCAP_APPLICATION following it
	if (x > 0) {
	   	 var y = String(vcapContents).search(vapp);

// Its embedded with a VCAP_APPLICATION definition as well.  Format the Services for CFENV	   	 
		 if (y > 0) {
		     
			 for (; String(vcapContents[y]) != 0x7B ; y--) {}
 			 var vcapServices =  String(vcapContents).substring(x-1, y);
		     vcapServices = vcapServices.replace(vserv, "");
		     vcapServices = vcapServices.replace('"":' , "");
		     x = vcapServices.lastIndexOf("}")
		 	 vcapServices = vcapServices.substring(0,x-1);
//		     console.log(vcapServices);
		 }
// Its not embedded with a VCAP_APPLICATION definition.  Format the Services for CFENV		     
		 else {
			 vcapServices = String(vcapContents).substring(x-1);
			 vcapServices = vcapServices.replace(vserv, "");
		     vcapServices = vcapServices.replace('"":' , "");
		     x = vcapServices.lastIndexOf("}")
		 	 vcapServices = vcapServices.substring(0,x-1);
//			 console.log( vcapServices);
		 }
		
	 fs.writeFileSync(__dirname + '\\'  + vserv + cfexten, vcapServices);		

	}
// We found a VCAP_APPLICATION definition.  Format the Application for CFENV
	 x = String(vcapContents).search(vapp);
	 y = String(vcapContents).lastIndexOf("}");
	 	 
	 var vcapApp = String(vcapContents).substring(x-1,y+1);
	 vcapApp = vcapApp.replace(vapp, "");
	 vcapApp = vcapApp.replace('"":', "");
	 x = vcapApp.lastIndexOf("}")
 	 vcapApp = vcapApp.substring(0,x-1);
	  
	 fs.writeFileSync(__dirname + '\\'  + vapp + cfexten, vcapApp);
//	 console.log(String(vcapApp)) 
	 
	
 }

else {console.log("Q2Cloud Command requires a VCAP file as input");
      console.log("+ Example:  node q2cvcap.js qvserver-vcap.json ");
	
}

// Place the next q2Cloud command here!!!!
//  if (myargv[2].toLowerCase == "cmd") {}

}

// If no q2Cloud valid option was given then come here
if (cmdOption == 0) {
	console.log("Q2Cloud " + myargv[2] + " is not a valid option for this command");

 

}



 



















	
 




	      	 

     