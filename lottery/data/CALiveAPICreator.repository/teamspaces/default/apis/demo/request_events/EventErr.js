// Insert error event handling code here
/*
This example demonstrates how an error thrown by Live API Creator 
can be captured and modified before being sent back to client.
Activate the Error event and see how Error response changes.
*/
var temp = json;
print("ERROR EVENT" + JSON.stringify(json));
log.debug("ERROR EVENT" + JSON.stringify(json));
json = {
    success : false,
    payload:{"req":JSON.parse(req.json)},
    error: {
        code: temp.errorCode,
        statusCode: temp.statusCode,
        errorMessage: temp.errorMessage,
        message: temp.message
    }
};
