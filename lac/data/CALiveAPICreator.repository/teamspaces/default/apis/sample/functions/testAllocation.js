var testName = "testAllocation";
var testData =
{
  "customer_name": "Gloria's Garden",
  "amount": 111
};
var url = req.localFullBaseURL;
var customerGetURL = url + "sample:customers";
var headerSettings = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }}; // created on Auth Tokens screen
var key = "Gloria\'s Garden" ;
var getParams = {sysfilter: "equal(\"name\":" + JSON.stringify( key ) + ")"};

log.debug("testAllocation -----");
log.debug(JSON.stringify(getParams, null, 2));

var oldGetResponseString = SysUtility.restGet(customerGetURL, getParams, headerSettings);
var oldGetResponse = JSON.parse(oldGetResponseString);

log.debug("Getting customer old data ");

var newPaymentJson = testData;
var paymentURL = url + "payments";
var postSettings = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }};  // created on Auth Tokens screen
var postParams = null;
log.debug(testName + "posting...");

var postResponseString = SysUtility.restPost(paymentURL, postParams, headerSettings, newPaymentJson);
var postResponse = JSON.parse(postResponseString);
log.debug(".. request completed with statusCode: " + postResponse.statusCode);
if (postResponse.statusCode !== 201) {
    log.debug("ERROR: Post txSummary did not find expected 201...");
    log.debug(postResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
    throw new Error("ERROR: Post txSummary did not find expected 201...");

}


var newGetResponseString = SysUtility.restGet(customerGetURL, getParams, headerSettings);
var newGetResponse = JSON.parse(newGetResponseString);

var diff = SysUtility.jsonDiff(JSON.stringify(oldGetResponse),JSON.stringify(newGetResponse),0 ,false);

var diffResult = diff.contains("==> DIFF [sample:customers/Gloria's%20Garden]: balance: -= 100   (0 <= 100)\n") ;
//log.debug("Testing diff.. "+diffResult);
//return {result:diff, diffresult:diffResult};

if (diffResult === true){
    var getPaymentResponseString = SysUtility.restGet(paymentURL, null, headerSettings);
    var getPaymentResponse = JSON.parse(getPaymentResponseString);
    var ident = getPaymentResponse[0].ident;
    var deleteUrl = paymentURL +"/"+ident + "?checksum=override";
    var deleteResponseString = SysUtility.restDelete(deleteUrl, null, headerSettings);
    var deleteResponse = JSON.parse(postResponseString);
    log.debug("Delete payment "+deleteResponse.statusCode+deleteUrl);

    return {statusCode: 201, message: "ok "+getPaymentResponse[0].ident};
}
else{
    return {statusCode: undefined, message: "Diff failed"};
}
