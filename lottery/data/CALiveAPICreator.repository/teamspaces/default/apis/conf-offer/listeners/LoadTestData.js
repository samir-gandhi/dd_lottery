var title = "ConfOffer Startup Listener, LoadTestData - ";

// db("SysUtility.getTeamSpaceInfo(): " + JSON.stringify(listenerUtil.getTeamSpaceInfo()));
var teamSpaceUrlFragment = listenerUtil.getTeamSpaceInfo().urlFragment;   //.getProjectInfo().urlFragment;
var apiURLFragment = listenerUtil.getApiInfo().urlFragment;    
var url = "http://" + listenerUtil.getHostName() + ':8080/rest/' + teamSpaceUrlFragment + '/' + apiURLFragment + '/v1/PartnerPost';
var noFilter = {};
var optionsAuth = { 'headers': {'Authorization' : 'CALiveAPICreator AdminKey:1'}};

var response = "";
// print(title + 'running, check for data at: ' + url);  // http://localhost:8080/rest/default/conf-offer/v1/PartnerPost
response = listenerUtil.restGet(url, noFilter, optionsAuth);
// db(title + 'running, restGet response: ' + response);

if ("[]" !== response) {
    log.debug(title + 'test data data already loaded... no action for server at: ' + url);  // http://localhost:8080/rest/default/conf-offer/v1/PartnerPost
}  else {
    var data = testData();
    print("\n" + title + 'test data empty - posting testData() with server at: ' + url);  // http://localhost:8080/rest/default/conf-offer/v1/PartnerPost
    var postResponse = listenerUtil.restPost(url, null, optionsAuth, data);
    // db('empty - postResponse: ' + postResponse);
}
print('');

function db(aString) {
    var printString = title + aString;
    print(printString);
    log.debug(printString);
}

function testData() {
    return [
      {
        "name": "App Economy World",
        "Talks_List": [
          {
            "name": "Small Stage",
            "Price": 1000
          },
          {
            "name": "Big Stage",
            "Price": 4000
          },
          {
            "name": "Phone Booth",
            "Price": 100
          }
        ],
        "Exhibits_List": [
          {
            "Price": 1000,
            "name": "Small Table"
          },
          {
            "Price": 10000,
            "name": "Multi-Booth Area"
          },
          {
            "Price": 5000,
            "name": "Booth"
          },
          {
            "Price": 100,
            "name": "Card Table in Parking Lot"
          }
        ]
      },
      {
        "name": "Agility Achieved"
      },
      {
        "name": "Making Friends in Politics"
      }
    ];
}
