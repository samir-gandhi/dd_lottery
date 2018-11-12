if (row.ProcessedStatus != oldRow.ProcessedStatus) {
    var title = "conf-management Retry Process Payload (6): ";
    logicContext.logDebug (title + "Running***");

    var resourceURL = req.localFullBaseURL + 'ProcessCharges';  // mapping and transformation defined by Custom Resource
    if (messageContent.startsWith("<"))
        settings.headers["Content-Type"] = "application/xml";  // not required if strictly JSON

    var postResponse = SysUtility.restPost(resourceURL, {}, Config.settings.authHeader, row.msgContent);
    logicContext.logDebug(title + "Post Response: " + postResponse);

    // built using Examples (Persist Payload) and Control-Space
}
