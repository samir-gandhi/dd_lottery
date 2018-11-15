// Test driver, runs each test below.  By convention, each test Function returns a response, or throws error.

var tests = [

     {"TestName": "testAllocation", "TestResult": "Not Run"},
     {"TestName": "testBillOfMaterials",   "TestResult": "Not Run"},
     {"TestName": "testReformatResponse",   "TestResult": "Not Run"}
];
var numFailures = 0;
tests.forEach(function(eachTest) {
    try {
        var functionResponse = SysUtility.getFunction(eachTest.TestName, null);
        eachTest.TestResult = JSON.parse(functionResponse);  // collect responses
        var statusCode = eachTest.TestResult.statusCode;
        if (typeof statusCode !== "undefined") {
            if (statusCode !== 201) {
                numFailures ++;
            }
        }
    }
    catch(err) {
        eachTest.TestResult = "Fail - Exception" + err;
        numFailures ++;  // run all the tests, even if one fails
    }
});
if (numFailures === 0)
    return {"Result": "Success", "Tests": tests};  // return result, responses
else
    return {"Result": numFailures + " FAILURE(S)", "Tests": tests};  // hmm

