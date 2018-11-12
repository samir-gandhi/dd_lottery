log.info("Begin MongoDB query code");

var theFilters = [];
var logMessage;

if (log.isFinestEnabled() || applog.isFinestEnabled()) {
	logMessage = "MongoDB - Processing filters for getByQuery started";
	log.finest(logMessage);
	applog.finest(logMessage);
}

parameters.filters.forEach(function (k, v) {
	for (var i = 0; i < v.size(); i++) {
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			var paramValue = param.value;
			if (param.name == '_id') {
				if (!paramValue) {
					paramValue = "null";
				}
				else if (paramValue["$oid"]) {
					paramValue = new env.ObjectId(paramValue["$oid"]);
				}
				else if (paramValue.match && paramValue.match(/^[0-9a-fA-F]{24}$/)) {
					paramValue = new env.ObjectId(paramValue);
				}
			}
			switch (v[i].filterName) {
				case 'equal' :
					theFilters.push(env.Filters.eq(param.name, paramValue));
					break;
				case 'notequal' :
					theFilters.push(env.Filters.ne(param.name, paramValue));
					break;
				case 'greater' :
					theFilters.push(env.Filters.gt(param.name, paramValue));
					break;
				case 'greaterequal' :
					theFilters.push(env.Filters.gte(param.name, paramValue));
					break;
				case 'less' :
					theFilters.push(env.Filters.lt(param.name, paramValue));
					break;
				case 'lessequal' :
					theFilters.push(env.Filters.lte(param.name, paramValue));
					break;
				case 'like' :
					theFilters.push(env.Filters.regex(param.name, paramValue));
					break;
				default:
				// Do nothing?
			}
		}
	}
});
if (log.isFinestEnabled()) {
	log.finest("MongoDB - Processing filters for getByQuery finished with filters " + JSON.stringify(theFilters));
}

// Deal with sorts
log.finest("MongoDB - Processing sorts for getByQuery started");
var sortObjs = new env.BasicDBObject();
parameters.orders.forEach(function (k, v) {
	for (var i = 0; i < v.size(); i++) {
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			sortObjs.put(param.name, (!param.action || param.action == "asc") ? 1 : -1);
		}
	}
});

if (log.isFinestEnabled()) {
	log.finest("MongoDB - Processing sorts for getByQuery finished with sorts " + sortObjs.toString());
}

var coll = connection.db.getCollection(entityName);
if (!coll) {
	logMessage = "No such Mongo collection: " + entityName;
	log.error(logMessage);
	applog.error(logMessage);
	throw logMessage;
}

var docs = null;
log.finest("MongoDB - Calling find() on the collection to fetch data.");
if (theFilters.length) {
	docs = coll.find(env.Filters.and(theFilters)).limit(parameters.pagesize).sort(sortObjs).skip(parameters.offset).iterator();
}
else {
	docs = coll.find().limit(parameters.pagesize + 1).sort(sortObjs).skip(parameters.offset).iterator();
}

if (log.isFinestEnabled() || applog.isFinestEnabled()) {
	logMessage = "MongoDB - Completed find() on the collection to fetch data.Data " + docs.toString();
	log.finest(logMessage);
	applog.finest(logMessage);
}

// Now add the metadata sections to all top-level objects
log.finest("MongoDB - getByQuery - Postprocessing results started.");
var result = "[";
var numObjects = 0;
while (docs.hasNext()) {
	// We've retrieved one more than necessary -- is it there, in which case
	// we need to add a nextPage URL to the result?
	numObjects++;
	if (numObjects > parameters.pagesize) {
		break;
	}
	if (result.length > 1) {
		result += ",\n";
	}
	var doc = docs.next();
	var metaDoc = new env.Document();
	var idValue = doc.get("_id");
	if ('string' === typeof idValue) {
		idValue = "'" + idValue + "'";
	}
	else {
		idValue = idValue.toString();
	}
	metaDoc.put("href", parameters.baseUrl + parameters.qualifiedEntityName + "/" + idValue);
	doc.put(parameters.metadataName, metaDoc);
	result += doc.toJson();
}

// Do we need to add a nextPage URL to the result?
log.finest("MongoDB - getByQuery - Adding pagination logic.");
if (numObjects > parameters.pagesize) {
	result += ",\n";
	var metaDoc = new env.Document();
	var nextBatchDoc = new env.Document();
	nextBatchDoc.put("next_batch", parameters.baseUrl + parameters.qualifiedEntityName + "/" + "?offset=" + (parameters.offset + numObjects));
	metaDoc.put(parameters.metadataName, nextBatchDoc);
	result += metaDoc.toJson();
}
result += "\n]\n";

if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "MongoDB - getByQuery - Result " + result;
	log.debug(logMessage);
	applog.debug(logMessage);
}
return result;
