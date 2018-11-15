var title = "conf-management Listener (1): ";
try {    // persist payload (also see ProcessCharges Extended Properties)
    var postPayloadResponse = listenerUtil.restPost(Config.settings.resourceURL + "/ProcessCharges",
                                            {}, Config.settings.authHeader, message.toString());
    print(title + "Payload Processed, postPayloadResponse: " + postPayloadResponse + "\n\n");
} catch(e) {
    print (title + "post exception: " + e);
    throw title + "post exception: " + e;
}
