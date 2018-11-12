var raise = req.getUserProperties().get("RaisePercent");
log.debug("GiveRaise, arg=" + raise + ", row: " + row);
if (raise !== null) {
    var salaryAdj = 1 + raise/100;
    log.debug("**giving raise: " + salaryAdj);
    row.base_salary = row.base_salary * salaryAdj;
}
