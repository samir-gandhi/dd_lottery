var url = req.baseUrl;
//log.debug(url); // this is the base URL for this server
url = url.replace("/demo","/sample");// compute baseURL of target system
url = url + "v1/orders";   // add version/ resource endPoint on target
var key = containingRow.name;      // containingRow is system supplied
log.debug("..using key: " + key + ", and url: " + url);
key = JSON.stringify(key, null, 0);
var params= {
   sysfilter: "equal(customer_name:" + key + ")"
};

var response =  SysUtility.restGet(url, params, ConfigLib.sampleAuth);  // built in utility for REST calls - see Hint, above
return JSON.parse(response);
