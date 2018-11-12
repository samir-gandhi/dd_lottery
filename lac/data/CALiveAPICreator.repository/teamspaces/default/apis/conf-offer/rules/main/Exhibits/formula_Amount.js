var qty = row.Quantity || 1;  // idiomatic JavaScript for 1 if quantity is null
if (row.Use === false)
    log.debug("refer to Use so that derivation re-run if Use reset (for default value, above");
return row.Cost * qty;
