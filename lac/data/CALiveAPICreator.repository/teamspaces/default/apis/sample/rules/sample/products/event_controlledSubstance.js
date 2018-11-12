if (row.name == "Dynamite" && row.total_quantity_ordered != oldRow.total_quantity_ordered) {
    log.debug("***controlled substance - notify authorities");
    var json = JSON.parse(req.json);  // convert req's JSON string to JSON objects
    var custName = json.customer;     // get the name from the request
    var options = { sysfilter: "equal(name:'" + custName + "')" };
    var custAccount = SysUtility.getResource("ComplianceReporting", options);  // get resource JSON
    log.debug("***sending compliance message" + JSON.stringify(custAccount[0]));
}
