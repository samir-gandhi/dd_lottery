log.info("Begin MongoDB delete code");
var logMessage = "";

// Validation
if (key.length == 0) {
	logMessage = "No key was provided for DELETE. Please provide a key in the URL.";
	log.error(logMessage);
	applog.error(logMessage);
	throw new Error(logMessage);
}

var coll = connection.db.getCollection(entityName);
var idQuery = new env.BasicDBObject();
if (log.isFinestEnabled()) {
	log.finest("MongoDB - Collection :" + coll.toString());
}

// MongoDB allows you to either set your own _id with a value of your choosing,
// like a number or a string, or let it generate an _id, in which case it
// will be an ObjectId.
// Here we look at the key -- if it's exactly 24 hexadecimals, then we assume
// it's an ObjectId. If it's surrounded by single quotes, we treat it as a string.
// If it's between 1 and 15 decimals, then it's an integer. In all other cases,
// it's a string.
if (key[0].match(/^[0-9a-fA-F]{24}$/)) {
	idQuery.put("_id", new env.ObjectId(key[0]));
}
else {
	if (key[0].charAt(0) == "'" && key[0].charAt(key[0].length - 1) == "'") {
		idQuery.put("_id", key[0].substring(1, key[0].length - 1));
	}
	else {
		if (key[0].length <= 15 && key[0].match(/[0-9]+/)) {
			idQuery.put("_id", parseInt(key[0]));
		}
		else {
			idQuery.put("_id", key[0]);
		}
	}
}

if (log.isFinestEnabled()) {
	log.finest("MongoDB - Query before deleting " + key + ". Query object : " + idQuery.toString());
}
var doc = coll.find(idQuery).first();
if (!doc) {
	logMessage = "MongoDB - Could not find the entity to be deleted." + key;
	log.error(logMessage);
	applog.error(logMessage);
	throw new env.KahunaException(4045, [entityName, key, entityName, entityName]);
}

log.debug("Deleting an entity:" + entityName + " for key:" + idQuery);

var result = coll.deleteOne(idQuery);
log.debug("Delete completed successfully");
if (!result.deletedCount) {
	logMessage = "MongoDB - Exception while deleting " + key;
	log.error(logMessage);
	applog.error(logMessage);
	throw new env.KahunaException(4045, [entityName, key, entityName, entityName]);
}

// Now add the metadata sections to the top-level object
var metaDoc = new env.Document();
metaDoc.put("href", parameters.baseUrl + parameters.qualifiedEntityName + "/" + key[0]);
doc.put(parameters.metadataName, metaDoc);

var returnedObj = doc.toJson();
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "MongoDB - delete - Returned " + returnedObj;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End MongoDB delete code")
return returnedObj;
