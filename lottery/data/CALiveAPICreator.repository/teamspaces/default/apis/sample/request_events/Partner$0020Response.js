var reqResourceName = req.resourceName;
if ("POST" == req.verb && "PartnerOrder" == reqResourceName) {
  delete json.txsummary;  // remove from response
  delete json.rulesummary;
  var reqJson = JSON.parse(req.json);  // convert req's JSON string to JSON objects
  var custName = reqJson.customer;     // get the name from the request (e.g., 'Max Air')
  var options = { filter: "\"name\" = '" + custName + "'" };
  // so.. http://localhost:8080/rest/default/sample/v1/cust?filter="name"='Max Air'
  var custAccount = SysUtility.getResourceAsString("cust", options);  // get resource JSON
  log.debug("***return account summary as response: " + custAccount);
  json.accountSummary = JSON.parse(custAccount);  // inject into response
}
