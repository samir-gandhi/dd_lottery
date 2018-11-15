var ConfigLib = {    // preferably, load values from property files, as in Conference - Management
    confOfferURLFragment: "conf-offer",
    confManagementURLFragment: "conf-management",
    confManagementURL: 'http://localhost:8080/rest/default/conf-management/v1/ProcessCharges',
    confManagementAuth: { headers: { Authorization: "CALiveAPICreator AcctgToken:1" }},  // see Auth Tokens screen
    confOfferAuth: { headers: { Authorization: "CALiveAPICreator AdminKey:1" }}
    
};
