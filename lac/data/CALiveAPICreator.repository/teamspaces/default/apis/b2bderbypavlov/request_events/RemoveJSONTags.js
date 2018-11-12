if ("SalesReports" == req.resourceName && req.verb.toString() == 'POST') {
   //log.debug('***SalesReports Req Event - json: ' + json);
    var data = JSON.parse(json);  // json from the request
    if(data && Array.isArray(data) && data.length > 0) {
        var theOrder = data[0];
        var keptItemNum = 0;
        var keptItems = [];
        log.debug("theOrder: " + JSON.stringify(theOrder));
        for ( var i = 0; i < theOrder.OrderDetails_List.length; i ++) {
            var eachItem = theOrder.OrderDetails_List[i];
            delete eachItem["@metadata"];
            if (eachItem.SupplierName == "Pavlova, Ltd.") {
                delete eachItem.OrderID;
                delete eachItem.ProductID;
                delete eachItem.Quantity;
                delete eachItem.SupplierName;
                eachItem.CompanyName = theOrder.CompanyName;
                log.debug("*********keep item: " + JSON.stringify(eachItem));
                log.debug("from Order: " + JSON.stringify(theOrder));
                keptItems[keptItemNum] = eachItem;
                keptItemNum ++;
            }
        }
        log.debug("Kept Items"); log.debug(keptItems);
        json = JSON.stringify(keptItems);  // Important: you must serialize the data back to a string if you want to change it
    }
    log.debug('***SalesReports Req Event - ALTERED json: ' + json);
}
