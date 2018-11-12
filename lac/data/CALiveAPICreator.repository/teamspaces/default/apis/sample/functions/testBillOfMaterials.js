var testName = "testBillOfMaterials";
var testData =
{
    "customer" : "Alpha and Sons" ,
    "isReady" : false,
    "LineItems" : [
        {
        "productName" : "Boing 747" ,
        "quantityOrdered" : 2
        }
    ]
};

var url = req.localFullBaseURL;
var orderGetURL = url + "sample:orders";
var headerSettings = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }}; // created on Auth Tokens screen
var key = "Alpha and Sons" ;
var getParams = {sysfilter: "equal(\"customer_name\":" + JSON.stringify( key ) + ")"};

log.debug("testBillOfMaterials -----");
log.debug(JSON.stringify(getParams, null, 2));

var oldGetResponseString = SysUtility.restGet(orderGetURL, getParams, headerSettings);
var oldGetResponse = JSON.parse(oldGetResponseString);

log.debug("Getting orders old data ");

var newParterOrderJson = testData;
var ParterOrderURL = url + "PartnerOrder";
var postSettings = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }};  // created on Auth Tokens screen
var postParams = null;
log.debug(testName + "posting...");

var postResponseString = SysUtility.restPost(ParterOrderURL, postParams, headerSettings, newParterOrderJson);
var postResponse = JSON.parse(postResponseString);
log.debug(".. request completed with statusCode: " + postResponse.statusCode);
if (postResponse.statusCode !== 201) {
    log.debug("ERROR: Post txSummary did not find expected 201...");
    log.debug(postResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
    throw new Error("ERROR: Post txSummary did not find expected 201...");
}


var newGetResponseString = SysUtility.restGet(orderGetURL, getParams, headerSettings);
var newGetResponse = JSON.parse(newGetResponseString);

var diff = SysUtility.jsonDiff(JSON.stringify(oldGetResponse),JSON.stringify(newGetResponse),0 ,false);
var newobjectcheck = !!diff.match("new object");
var diffArray = diff.split("\{");
diffArray.shift();
var diffRaw = "{"+diffArray.join("{");
var diffParsed = JSON.parse(diffRaw);
//log.debug ("Json Diff " +diffParsed);
var amount = diffParsed.amount_total;

if (amount === 20600 && newobjectcheck === true )
{
    var ident = diffParsed.ident;
    var deleteUrl = orderGetURL +"/"+ident + "?checksum=override";
    var deleteResponseString = SysUtility.restDelete(deleteUrl, null, headerSettings);
    var deleteResponse = JSON.parse(postResponseString);
    log.debug("Delete order "+deleteResponse.statusCode+deleteUrl);

    return {statusCode: 201, message: "ok"};
}
else
{
    return {statusCode: undefined, message: "Diff failed"};
}
