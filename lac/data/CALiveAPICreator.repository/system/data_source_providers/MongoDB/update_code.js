log.info("Begin MongoDB update code");
var logMessage = "";

var coll = connection.db.getCollection(entityName);
if (!coll) {
	logMessage = "MongoDB - No such MongoDB collection:" + entityName;
	log.error(logMessage);
	applog.error(logMessage);
	throw logMessage;
}

// If it's a single object, put it in an array for simplicity
if (payload && payload.trim().startsWith("{")) {
	payload = "[" + payload + "]";
}

if (log.isFinestEnabled()) {
	log.finest("MongoDB - Update - Payload : " + payload);
}
// One object at a time
if (payload && payload.trim().startsWith("[")) {
	var objs = JSON.parse(payload);
	var result = "[";
	for (var idx in objs) {
		var query = null;
		var obj = objs[idx];
		if (!obj._id) {
			logMessage = "Unable to update MongoDB object without an _id property";
			log.error(logMessage);
			applog.error(logMessage);
			throw logMessage;
		}
		if (obj._id["$oid"]) {
			query = env.Filters.eq("_id", new env.ObjectId(obj._id["$oid"]));
		}
		else {
			query = env.Filters.eq("_id", obj._id);
		}

		log.finest("MongoDB - Query for update :" + query.toString());
		delete obj[parameters.metadataName];
		var updatedObj = env.Document.parse(JSON.stringify(obj));

		if (log.isFinestEnabled() || applog.isFinestEnabled()) {
			logMessage = "MongoDB - Updating the entity:" + entityName + " for key:" + query;
			log.finest(logMessage);
			applog.finest(logMessage);
		}

		var updateRes = coll.replaceOne(query, updatedObj);
		log.debug("MongoDB - Update completed successfully");
		if (!updateRes.matchedCount) {
			throw new env.KahunaException(4045, [entityName, obj._id, entityName, entityName]);
		}

		if (!skipMetadata) {
			var metaDoc = new env.Document();
			var objId = updatedObj.get("_id");
			if (objId && typeof(objId) == "string") {
				objId = "'" + objId + "'";
			}
			metaDoc.put("href", parameters.baseUrl + parameters.qualifiedEntityName + "/" + objId);
			updatedObj.put(parameters.metadataName, metaDoc);
		}
		if (result.length > 1) {
			result += ",\n";
		}
		result += updatedObj.toJson();
	}
	result += "]";

	if (log.isDebugEnabled() || applog.isDebugEnabled()) {
		logMessage = "MongoDB - update code. Result " + result;
		log.debug(logMessage);
		applog.debug(logMessage);
	}

	log.info("End MongoDB update code");
	return result;
}
else {
	logMessage = "Invalid JSON payload for MongoDB update: only an object or an array of objects can be submitted";
	log.error(logMessage);
	applog.error(logMessage);
}
