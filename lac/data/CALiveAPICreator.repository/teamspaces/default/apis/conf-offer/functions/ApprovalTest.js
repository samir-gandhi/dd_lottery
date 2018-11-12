var testName = "Function testAcctgAlert: ";

// get App Economy World row, JSON Object
function getConfOffer(aMsg) {
    var url = req.localFullBaseURL;
    var eventGetURL = url + "Conferences_Test";
    var key = "App Economy World" ;
    var getParams = {sysfilter: "equal(\"name\":" + JSON.stringify( key ) + ")"};
    var eventString = SysUtility.restGet(eventGetURL, getParams, ConfigLib.confOfferAuth);  // see API Properties > Libraries
    db("getConfOffer[" + aMsg + "]: " + eventGetURL + ", getParams: " + JSON.stringify(getParams) + ", get returns: " + eventString + "");
    return JSON.parse(eventString)[0];
}

// put Conference Offer (JSON Object), returns putResponse
function putConfOffer(anEvent, anApprovedFlag) {
    anEvent.Approved = anApprovedFlag;
    var url = req.localFullBaseURL + 'Conferences_Test';
    var putParams = null;
    db("putConfOffer, updating url: " + url + ", with request data...\n" + JSON.stringify(anEvent) +
        "\nusing Auth: " + JSON.stringify(ConfigLib.confOfferAuth));
    var putResponseString = SysUtility.restPut(url, putParams, ConfigLib.confOfferAuth, anEvent);

    var putResponse = JSON.parse(putResponseString);
    db(".. putConfOffer, put completed with statusCode: " + putResponse.statusCode + ", putResponse: " + JSON.stringify(putResponse));
    if (putResponse.statusCode !== 200) {
        log.debug(testName + "ERROR: Post txSummary did not find expected 200...");
        log.debug(putResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
        throw new Error(testName + "ERROR: Post txSummary did not find expected 201...");
    }
    return putResponse;
}

// delay (e.g., allow aync message to complete processing)
function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

// debug prints to log and console
function db(aString) {
    var printString = testName + aString;
    log.debug(printString);
    print("");
    print(printString);
    return printString;
}

// get ConfManagement Charges data, returns JSON String
function getConfManagementCharges() {
    var url = req.localFullBaseURL;
    url = url.replace(ConfigLib.confOfferURLFragment, ConfigLib.confManagementURLFragment);
    var chargesGetURL = url + "Charges";
    db("getConfManagementCharges, acctgGetURL: " + chargesGetURL + ", with auth: " + JSON.stringify(ConfigLib.confManagementAuth) + ", getting");
    var chargesString = SysUtility.restGet(chargesGetURL, null, ConfigLib.confManagementAuth);
    db("getConfManagementCharges, acctgGetURL: " + chargesGetURL + ", with auth: " + JSON.stringify(ConfigLib.confManagementAuth) + ", get returns:\n" + chargesString);
    return chargesString;
}


//   ******************* MAIN CODE STARTS HERE

var confOffer = getConfOffer("Starting");
db('Checking if already approved: ' + "[" + confOffer.Approved + "] in: " + JSON.stringify(confOffer));
var reset = false;

if (confOffer.Approved === true) {
    db("Resetting Approved");
    reset = true;
    putConfOffer(confOffer, false);
    confOffer = getConfOffer("for optLock");
}

var chargesOld = getConfManagementCharges();  // this should add a charges record, visible in diff below

var approveResponse = putConfOffer(confOffer, true);

pausecomp(2000);  // put sends message, wait for it to complete...
var chargesNew = getConfManagementCharges();  // ALERT - diff fails if pagination occurs
var diff = SysUtility.jsonDiff(chargesOld, chargesNew, 0 ,false);
var diffResult = diff.contains("Different size arrays -") ;

if (diffResult === true){
    print("");
    db("Success... diff -->");
    db (diff);
    return {statusCode: 201, message: "ok - ConfManagement Charges row added"};
} else{
    print("");
    db("Diff fails-->");
    db("chargesOld: " + chargesOld);
    db("chargesNew: " + chargesNew);
    db("diff -->");
    db (diff);
    return {statusCode: undefined, message: "Diff failed: ", "diff": diff};
}
