if(req.verb == 'POST') {   // see PartnerPost ExtProp: { "PersistTo": "PartnerPostAudit"}
    var title = "conf-offer - ProcessPayload Request Event: ";
    var extProps = null;
    try {
        extProps = SysUtility.getExtendedPropertiesFor(req.resourceName);
    } catch(e) {
        // occurs for non-resources, etc
    }
    if (extProps && 'object' === typeof extProps && ! Array.isArray(extProps) && extProps.hasOwnProperty('PersistTo') ) {
        print(title + req.resourceName + " is audited (per extProps) - persisting: " + {msgContent: req.json});
        var persistToResponse = SysUtility.restPost(req.localFullBaseURL + extProps.PersistTo, {}, ConfigLib.confOfferAuth, {auditContent: req.json});
    }
}
