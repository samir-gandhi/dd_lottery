var teamSpaceName = listenerUtil.getTeamSpaceInfo().urlFragment;

var title = "conf-management Startup [teamspace: " + teamSpaceName + "]: ";
MktStart = {};  // scope our functions

/* When the API in started, this code runes to load outboard strings such as urls, http headers etc.
    We load from a property file (<teamSpaceName>.Properties) into ConfManagementLib's Config (a data structure in our library).
    API.Properties goes into your LAC folder (where the Derby DBs are - Finance, Marketing, MktConfOffers etc):

#<teamSpaceName> Properties

authHeader={ "headers": {"Authorization" : "CALiveAPICreator AcctgToken:1"} }
resourceURL=http://localhost:8080/rest/default/conf-management/v1
loadResourcesFromTable=true
resourcesToAudit={"ProcessCharges": true, "DummyResourceName": true}

*/

// read the properties file, return props
MktStart.readAPIProperties = function readAPIProperties(aPropFileName) {
    var response = {};
    var prop;
    try {
        prop = java.util.Optional.of(new java.util.Properties()).map(function(p)
                { p.load(new java.io.FileInputStream(aPropFileName)); return p;}).get();
    } catch (e) {
        // print (title + "** readAPIProperties - exception reading properties [" + aPropFileName + "]: " + e);
        return null;
    }
    var propEnum = prop.propertyNames();
    while (propEnum.hasMoreElements()) {  // you could make these per-API
        var propName = propEnum.nextElement();
        var propValue = prop.getProperty(propName); //  + "";
        // print(title + "......each prop: " + propName + " = " + propValue);
        if (propValue.startsWith("{"))
            response[propName] = JSON.parse(propValue);
        else
            response[propName] = propValue;
    }
    // print (title + "..readAPIProperties from file [" + propFileName + "] returns -->\n" + JSON.stringify(response));
    return response;
};

// table-driven technique so response event can be generic code
MktStart.loadResourcesToAudit = function loadResourcesToAudit(aConfig) {
    var result = {"ProcessCharges": true, "DummyFromStub": true};
    var settings = aConfig.settings;
    if ( settings.loadResourcesFromTable === false) {
        // print(title + "-- resourcesToAudit stub, per aConfig.loadResource: " + settings.loadResource);
    } else {
        result={};
        // print(title + "..loadResourcesToAudit() using aConfig: " + JSON.stringify(aConfig));
        var sysResourceInfoRows = listenerUtil.restGet(
                settings.resourceURL + "/main:SysResourceInfo", null, settings.authHeader);
        // print(title + "..sysResourceInfoRows");
        var sysResourceRows = JSON.parse(sysResourceInfoRows);
        for (var i = 0 ; i < sysResourceRows.length ; i++) {
            var eachSysResourceInfoRow = sysResourceRows[i];
            var resourceName = eachSysResourceInfoRow.ResourceName;
            result[resourceName] = true;
            // print(title + "  ..resourceName: " + resourceName + ", in: " + JSON.stringify(eachSysResourceInfoRow) + "\n");
        }
    }
    return result;
};


/* *************************************************
    Execution begins here
    Initialize ConfManagement (a library) Config.settings
**************************************************** */

var userDir = Java.type("java.lang.System").getProperty("user.dir");
var propFileName = teamSpaceName + ".properties";
// print("\n" + title + "running... reading propFileName[" + propFileName +  "] in LAC default dir: " + userDir);

var prepareConfig = {
    createdOn: new Date(),
    settings: {
        loadedBy: "conf-management default settings - no API.properties file in LAC Default dir: " + userDir,
        resourceURL: "http://localhost:8080/rest/default/conf-management/v1",
        authHeader: { 'headers': {'Authorization' : 'CALiveAPICreator AcctgToken:1' } },
        loadResourcesFromTable: true  // set false to bypass restGet for resource names to audit
    }
};
var props = MktStart.readAPIProperties(propFileName);
if (props !== null) {
    prepareConfig.settings = props;
    prepareConfig.settings.loadedBy = teamSpaceName + ".properties file in " + userDir;
}

prepareConfig.settings.resourcesToAudit = MktStart.loadResourcesToAudit(prepareConfig);
// print(title + "MktMgmtLib configuring MktStart.loadResourcesToAudit: " + JSON.stringify(prepareConfig) + "\n");

Config.save(prepareConfig.settings);
print("\n" + title + "..completed - Config -->\n" + JSON.stringify(Config) + "\n\n");

print(title + "*********************************************************");
print(title + "LAC is started and initialized");
print(title + "Start your Browser at http://localhost:8080/APICreator/#/");
print(title + "*********************************************************");
