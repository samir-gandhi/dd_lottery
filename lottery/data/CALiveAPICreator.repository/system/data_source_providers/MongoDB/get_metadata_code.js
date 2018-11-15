log.info("Begin MongoDB getStructure");
var isFinestLoggingEnabled = log.isFinestEnabled();

var result = {entities: []};
// Each collection is surfaced as a "table"
var namesIt = connection.db.listCollectionNames().iterator();
if (isFinestLoggingEnabled) {
	log.finest("Collections found " + namesIt);
}

while (namesIt.hasNext()) {
	result.entities.push(
		{
			name: namesIt.next(),
			columns: [
				{
					name: "_id"
				}
			],
			keys: [
				{
					name: "_id",
					type: "PRIMARY",
					columns: [
						"_id"
					]

				}
			]
		}
	);
}

// Add functions
result.procedures = [
	{name: "db.currentOp", columns: [], remarks: "Reports the current in-progress operations"},
	{name: "db.getLastError", columns: [], remarks: "Checks and returns the status of the last operation"},
	{name: "db.getName", columns: [], remarks: "Returns the name of the current database"},
	{name: "db.hostInfo", columns: [], remarks: "Returns a document with information about the system MongoDB runs on" },
	{name: "db.isMaster", columns: [], remarks: "Returns a document that reports the state of the replica set"},
	{name: "db.serverBuildInfo", columns: [], remarks: "Returns a document that displays the compilation parameters for the mongod instance"},
	{name: "db.serverStatus", columns: [], remarks: "Returns a document that provides an overview of the state of the database process"},
	{name: "db.stats", columns: [], remarks: "Returns a document that reports on the state of the current database" },
	{name: "db.version", columns: [], remarks: "Returns the version of the mongod instance" }
];
if (isFinestLoggingEnabled) {
	log.finest("MongoDB functions added" + JSON.stringify(result.procedures));
}

// Add user-defined functions, at least the ones in system.js
var adminDb = connection.client.getDatabase("admin");
if (adminDb) {
	var coll = adminDb.getCollection("system.js");
	if (coll) {
		var all = coll.find().iterator();
		while (all.hasNext()) {
			var funcDef = all.next();
			if (!funcDef.value) {
				//print("Ignoring function 1: " + funcDef._id);
				continue;
			}
			// Extract the parameters from the function declaration
			var codeStr = funcDef.value.toString();
			var expr = /^Code\{code=\'function\s*\(\s*([a-zA-Z0-9_]+)?(\s*,\s*[a-zA-Z0-9_]+)*\s*\)/;
			var paramsMatch = codeStr.match(expr);
			if (!paramsMatch) {
				continue;
			}
			var paramsDef = [];
			for (var i = 1; i < paramsMatch.length; i++) {
				var paramName = paramsMatch[i].trim();
				if (paramName.startsWith(",")) {
					paramName = paramName.substring(1);
				}
				paramName = paramName.trim();
				paramsDef.push({
					column_name: paramName,
					column_type: "IN"
				});
			}
			result.procedures.push({
				name: funcDef._id,
				columns: paramsDef
			});
			if (isFinestLoggingEnabled) {
				log.finest("Added user-defined function: " + funcDef._id);
			}
		}
	}
}
if (log.isDebugEnabled()) {
	log.debug("End MongoDB get_metadata_code: " + JSON.stringify(result));
}

log.info("End MongoDB getStructure");
return JSON.stringify(result);
