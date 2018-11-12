var shipper = row.Shippers;     // object model (row) provides accessors to related objects
if (shipper !== null && shipper.OrderChangeWebHook !== null) { 
    var response = logicContext.transformCurrentRow("ShipperAPIDef");                           // ShipperAPIDef resource: transformation
    SysUtility.restPost(shipper.OrderChangeWebHook, {}, ConstantsLib.supplierAuth, response);   // find with Control-Space, or Examples (above)
}
