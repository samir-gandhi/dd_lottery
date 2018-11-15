if (logicContext.verb == "INSERT") {
  SysLogic.allocateFromToUndisbursed(
    logicContext,
    SysLogic.findWhere(
      row.paymentCustomer.ordersList,
      "row.is_ready == true && row.amount_un_paid > 0",
      "placed_date a"),
    "payment_order_allocations",
    "amount_un_disbursed");
}
