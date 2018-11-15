row.ProcessedStatus = "processed: " + new Date(); // set table row attribute; starts update retry processing
log.debug("conf-management Initiate Retry - (re) Process Payload (5)");
return {statusCode: 201};
