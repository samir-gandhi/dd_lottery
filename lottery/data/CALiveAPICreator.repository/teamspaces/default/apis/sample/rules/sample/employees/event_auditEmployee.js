if (logicContext.verb == "UPDATE") {
  SysLogic.insertChildFrom("employee_audits", logicContext);
  row.notes = "Hello from a JavaScript rule for " + row.name;
  logicContext.update(row);
}
