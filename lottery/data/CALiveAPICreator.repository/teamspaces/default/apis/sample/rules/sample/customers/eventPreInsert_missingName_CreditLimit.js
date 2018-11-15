// With this rule in place, we can post an empty {} json to the customers table and it will
// not fail for the missing primary key.

logicContext.logDebug("eventPreInsert_missingName_CreditLimit: " + row.name);
if (null === row.name) {
    row.name = "Customer " + Math.floor(Math.random() * 200000);
}

if (null === row.credit_limit) {
    row.credit_limit = 100;
}

logicContext.logDebug("eventPreInsert_missingName_CreditLimit: " + row.name);
