var arg = req.getUserProperties().get("clone");
log.debug("cloneXX: checking request arg.clone parameter was provided: " + arg);
if (arg !== null && logicContext.logicNestLevel < 1) {
    log.debug("cloning: " + row);
    var deepCopy = ["lineitemsList"];
    SysLogic.copyTo("orders", logicContext, deepCopy, false);
}
