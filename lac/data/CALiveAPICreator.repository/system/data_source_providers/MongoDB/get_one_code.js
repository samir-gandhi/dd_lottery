log.info("Begin MongoDB getByKey");

// Validation
if (key.length === 0) {
	var errorMessage = "No key was provided to retrieve a single MongoDB object."
	log.error(errorMessage);
	// API log
	applog.error(errorMessage);
	throw new Error(errorMessage);
}

var coll = connection.db.getCollection(entityName);
var idQuery = new env.BasicDBObject();
if (log.isFinestEnabled())
	log.finest("MongoDB - Collection for entity " + entityName + " is " + coll.toString());

// Mongo allows you to either set your own _id with a value of your choosing,
// like a number or a string, or let it generate an _id, in which case it
// will be an ObjectId.
// Here we look at the key -- if it's exactly 24 hexadecimals, then we assume
// it's an ObjectId. If it's surrounded by single quotes, we treat it as a string.
// If it's between 1 and 15 decimals, then it's an integer. In all other cases,
// it's a string.
var keyIsString = false;
if (key[0].toString().match(/^\s*\{\s*\"\$oid\"\s*:\s*\"[a-fA-F0-9]{24}\"\s*\}$/)) {
	var keyObj = JSON.parse(key[0]);
	idQuery.put("_id", new env.ObjectId(keyObj["$oid"]));
}
else if (key[0].match(/^[0-9a-fA-F]{24}$/)) {
	idQuery.put("_id", new env.ObjectId(key[0]));
}
else {
	if (key[0].charAt(0) == "'" && key[0].charAt(key[0].length - 1) == "'") {
		idQuery.put("_id", key[0].substring(1, key[0].length - 1));
		keyIsString = true;
	}
	else {
		if (key[0].length <= 15 && key[0].match(/^[0-9]+$/)) {
			idQuery.put("_id", parseInt(key[0]));
		}
		else {
			idQuery.put("_id", key[0]);
			keyIsString = true;
		}
	}
}

var doc = coll.find(idQuery).first();
if (log.isFinestEnabled() || applog.isFinestEnabled()) {
	var logMessage = "MongoDB - Querying Entity: " + entityName + " with key:" + idQuery;
	log.finest(logMessage);
	applog.finest(logMessage);
}
if (!doc) {
	var errorMessage = "No documents returned for " + entityName + " and key " + key;
	log.error(errorMessage);
	applog.error(errorMessage);
	return null;
}

// Now add the metadata sections to the top-level object
var result = "[";
var metaDoc = new env.Document();
var keyStr = "" + key[0];
if (keyIsString && !keyStr.startsWith("'") && !keyStr.endsWith("'")) {
	keyStr = "'" + keyStr + "'";
}
metaDoc.put("href", parameters.baseUrl + parameters.qualifiedEntityName + "/" + keyStr);
doc.put(parameters.metadataName, metaDoc);
result += doc.toJson();
result += "\n]\n";

if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "Mongo getByKey result for key " + key[0] + " is " + result;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End MongoDB getByKey");
return result;
