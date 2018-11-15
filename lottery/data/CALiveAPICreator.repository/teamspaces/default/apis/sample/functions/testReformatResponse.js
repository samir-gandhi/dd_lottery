var testName = "testFormatResponse - ";  // verify response event returns accountSummary, not txSummary
var testData =
{
 "customer": "Max Air",
 "isReady": true,
 "LineItems": [
  {
    "productName": "Dynamite",
    "quantityOrdered": 1
      },
  {
    "productName": "Hammer",
    "quantityOrdered": 1
      }
  ]
};

// post to PartnerOrder, check resposnse for accountSummary, with name Max Air
// Tests logic for placing order.  Returns order post response, or throws error.

var newPartnerOrderJson = testData;
var partnerOrderURL = req.localFullBaseURL + "PartnerOrder";
var postSettings = { headers: { Authorization: "CALiveAPICreator AdminKey:1" }};  // created on Auth Tokens screen
var postParams = null;
log.debug(testName + "posting...");

var postResponseString = SysUtility.restPost(partnerOrderURL, postParams, postSettings, newPartnerOrderJson);
var postResponse = JSON.parse(postResponseString);
log.debug(".. request completed with statusCode: " + postResponse.statusCode);
var orderNumber = 0;
if (postResponse.statusCode !== 201) {
    log.debug("ERROR: Post txSummary did not find expected 201...");
    log.debug(postResponse); //an object which will include a transaction summary and a summary of the rules fired during this request
    throw new Error("ERROR: Post txSummary did not find expected 201...");
}
var accountSummary = postResponse.accountSummary;
log.debug(testName + "postresponse: " + postResponseString);
var theCustomer = accountSummary[0].Name;     // val - I looked for Dynamite... did not find it...?  Let's find out why...
if (theCustomer !== testData.customer) {
    throw new Error("response did not include expected customer.Name: " + postResponseString);
}
log.debug("theCustomer ----"+ JSON.stringify(theCustomer));
var theOrder = accountSummary[0].orders_c[0];
var theItem = theOrder.items_o[0];
var CurrentPrice = theItem.CurrentPrice;
if (CurrentPrice === null){
    throw new Error("response did not include combined item.CurrentPrice");
}
log.debug(" ");
return postResponse;
