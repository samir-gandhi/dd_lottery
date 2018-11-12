if (row.amount_total != oldRow.amount_total) {
  var newPurchaseorder_audit = logicContext.createPersistentBean("demo:purchaseorder_audit");
  newPurchaseorder_audit.amount_total = oldRow.amount_total;  // set attributes from old values
  newPurchaseorder_audit.paid = oldRow.paid;
  newPurchaseorder_audit.customer_name = oldRow.customer_name;
  newPurchaseorder_audit.order_number = oldRow.order_number;  // set the foreign key
  logicContext.insert(newPurchaseorder_audit);                // saves (fires logic)
}
// better: re-use alternative using Loadable Libraries
// if (row.amount_total != oldRow.amount_total)
//   SysLogic.insertChildFrom("purchaseorder_audit", logicContext);
