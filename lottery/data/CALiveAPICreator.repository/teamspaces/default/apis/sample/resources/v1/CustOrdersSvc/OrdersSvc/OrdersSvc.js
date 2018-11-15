var url = req.baseUrl;                      // e.g., http://server.acme.com/rest/abl/sample/
url = url.replace("/sample","/demo");    // compute baseURL of target system
url = url + "v1/PurchaseOrders";       // add version/endPoint
var key = containingRow.name;       // containingRow is system supplied
var params = {
   sysfilter: "equal(customer_name:\"" + key + "\")"
};
var settings = {
   headers: {
      Authorization: "CALiveAPICreator demo_full:1"
   }
}
log.debug("..using key: " + key + ", and url: " + url);
var response =  SysUtility.restGet(url, params , settings);
return JSON.parse(response);
