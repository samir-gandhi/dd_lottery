print("\n\nCustomerOrders_JS_Totally");  // see Description, below

var demoUrl = req.baseUrl;  // the current API

var sampleUrl = req.baseUrl;
sampleUrl = sampleUrl.replace("/demo","/sample");  // compute baseURL of target system

var result = [];

var key = req.urlParameters.custName;
if (key === null) {
    key = "Alpha and Sons";  // the only row in common between demo and sample (so, use it)
    print("..using default key: " + key);
}
print("..using key: " + key + ", and url: " + demoUrl);
key = JSON.stringify(key, null, 0);
var customerFilter = {
   sysfilter: "equal(name:" + key + ")"
};
var custsString =  SysUtility.restGet(demoUrl + "v1/AllCustomers", customerFilter, ConfigLib.demoAuth);
var custRows = JSON.parse(custsString);
print("..custRows: " + JSON.stringify(custRows));

for (var eachRowNum = 0; eachRowNum < custRows.length; eachRowNum++) {  // add orders for each cust
    print("....iterating cust rows, eachRowNum: " + eachRowNum);
    var eachCust = custRows[eachRowNum];   // as necessary, drop / alias attributes here
    var key = eachCust.name;               // containingRow is system supplied
    print("....get orders using parent (cust) key: " + key + ", and sampleUrl: " + sampleUrl);
    key = JSON.stringify(key, null, 0);
    var ordersFilter = {
       sysfilter: "equal(customer_name:" + key + ")"
    };
    var ordersList = [];
    var ordersString =  SysUtility.restGet(sampleUrl + "v1/orders", ordersFilter, ConfigLib.sampleAuth);
    var orders = JSON.parse(ordersString);
    for (var eachOrderNum = 0; eachOrderNum < orders.length; eachOrderNum++) {
        var eachOrder = orders[eachOrderNum];
        ordersList.push(eachOrder);
    }
    eachCust.ordersList = ordersList;
    result.push(eachCust);

}
// print("..processed; result: " + JSON.stringify(result));
return result;
