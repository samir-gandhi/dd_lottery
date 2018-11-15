if (req.verb === 'POST') {
    var title = "conf-management - ProcessPayload Request Event (2): ";
    var extProps = null;  // see resource Extended Properties: ProcessCharges
    try {
        extProps = SysUtility.getExtendedPropertiesFor(req.resourceName);
    } catch(e) {
        // occurs for non-resources, etc
    }
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('PersistTo') ) {  // ProcessCharges ExtProp: { "PersistTo": "PersistCharges"}
        var persistToResponse = SysUtility.restPost(Config.settings.resourceURL + "/" + extProps.PersistTo, {}, Config.settings.authHeader, {msgContent: JSON.stringify(req.json)});
        print(title + req.resourceName + " was audited (per extProps) - persisting: " + ", url: " + Config.settings.resourceURL + "/" + extProps.PersistTo + ", payload: " + JSON.stringify({msgContent: req.json}));
    }
}
