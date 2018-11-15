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
//special Auth Token in this project to allow access from url (?auth=AdminKey:1)
var settings = {
   headers: {
      Authorization: "CALiveAPICreator AdminKey:1"
   }
}
//////////// Built in utility to make REST GET call
var response =  SysUtility.restGet(url, params, settings);
return JSON.parse(response);
