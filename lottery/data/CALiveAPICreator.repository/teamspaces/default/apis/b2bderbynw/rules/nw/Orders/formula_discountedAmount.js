// note - cannot call logicContext here; it does not exist on retrieval
var ruleParms = B2B.getDiscountRuleParms();  // cached read from single-row rule parameter table
var amt = row.AmountTotal;
if (row.healthyCount > ruleParms.qty_for_discount) {
    amt = amt * (ruleParms.discount_percent/100);
    log.debug("Orders.discountedAmount giving discount:" + (ruleParms.discount_percent/100));
}
// log.debug("Orders.discountedAmount[" + row.OrderID + "], amt: " + amt + ", (AmountTotal: " + row.AmountTotal + "), ruleParms: " + JSON.stringify(ruleParms));
return amt;
