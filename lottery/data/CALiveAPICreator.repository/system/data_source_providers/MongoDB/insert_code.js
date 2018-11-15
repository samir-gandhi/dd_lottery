log.info("Begin MongoDB insert code");
var logMessage = "";

var coll = connection.db.getCollection(entityName);
if (!coll) {
	logMessage = "Error fetching collection. No such MongoDB collection: " + entityName;
	log.error(logMessage);
	applog.error(logMessage);
	throw logMessage;
}

if (log.isFinestEnabled() || applog.isFinestEnabled()) {
	logMessage = "MongoDB - Insert Payload :" + payload;
	log.finest(logMessage);
	applog.finest(logMessage);
}
// If we get an array of objects, we have to convert them one by one to a Document,
// then we can insert them all at once
if (payload && payload.trim().startsWith("[")) {
	var objs = JSON.parse(payload);
	var ArrayList = java.util.ArrayList;
	var newList = new ArrayList();
	for (var idx in objs) {
		var obj = objs[idx];
		delete obj[parameters.metadataName];
		var newObj = env.Document.parse(JSON.stringify(obj));
		newList.add(newObj);
	}

	if (log.isFinestEnabled() || applog.isFinestEnabled()) {
		logMessage = "Inserting an array of data to entity:" + entityName;
		log.finest(logMessage);
		applog.finest(logMessage);
	}
	try {
		coll.insertMany(newList);
	} catch (e) {
		var errorMessage = "Insert to " + entityName + " failed.Error: " + e.message;
		log.error(errorMessage);
		applog.error(errorMessage);
		throw e;
	}
	log.finest("Insert completed successfully");
	var result = "[";
	for (var idx = 0; idx < newList.size(); idx++) {
		var obj = newList.get(idx);
		if (!skipMetadata) {
			var metaDoc = new env.Document();
			var objId = obj.get("_id");
			if (objId && typeof(objId) == "string") {
				objId = "'" + objId + "'";
			}
			metaDoc.put("href", parameters.baseUrl + parameters.qualifiedEntityName + "/" + objId);
			obj.put(parameters.metadataName, metaDoc);
		}
		if (result.length > 1) {
			result += ",\n";
		}
		result += obj.toJson();
	}
	result += "]";
	return result;
}
// If it's a single object, it's easier
else if (payload && payload.trim().startsWith("{")) {
	var newObj = env.Document.parse(payload);
	newObj.remove(parameters.metadataName);
	if (log.isFinestEnabled()) {
		log.finest("MongoDB - Inserting an object to entity:" + entityName);
	}
	try {
		coll.insertOne(newObj);
	} catch (e) {
		var errorMessage = "Insert to " + entityName + " failed.Error: " + e.message;
		log.error(errorMessage);
		applog.error(errorMessage);
		throw e;
	}
	log.finest("MongoDB - Insert completed successfully");
	if (!skipMetadata) {
		var metaDoc = new env.Document();
		var objId = newObj.get("_id");
		if (objId && typeof(objId) == "string") {
			objId = "'" + objId + "'";
		}
		metaDoc.put("href", parameters.baseUrl + parameters.qualifiedEntityName + "/" + objId);
		newObj.put(parameters.metadataName, metaDoc);
	}

	var finalResult = newObj.toJson();
	if (log.isFinestEnabled() || applog.isFinestEnabled()) {
		logMessage = "MongoDB - insert code returning " + finalResult;
		log.debug(logMessage);
		applog.debug(logMessage);
	}

	log.info("End MongoDB insert code");
	return finalResult;
}
else {
	log.info("End MongoDB insert code");
	return "";
}
