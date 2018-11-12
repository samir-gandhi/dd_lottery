log.debug("Begin MongoDB testConnection code.");

var result = {};
// get params.
var hostname = settings.hostname;
var dbName = settings.dbname;
var port = settings.port;
// Milliseconds to keep retrying if a mongo host isn't available.
var serverHitTimeOutInMillis = 10000;
// Client options to set serverSelectionTimeout
var mongoClientOptions = env.MongoClientOptions.builder().serverSelectionTimeout(serverHitTimeOutInMillis).build();
// Server Address
var serverAddress = new env.ServerAddress(hostname, port);
// Connecting..
try {
	var mongoClient = new env.MongoClient(serverAddress, mongoClientOptions);
	// get database.
	var db = mongoClient.getDatabase(dbName);
	if (log.isFinestEnabled()) {
		log.finest("Testing connection to database: " + hostname + ":" + port + " " + dbName);
	}
	var pingDoc = new env.Document("ping", 1);
	var minLatency = 1000000000;
	// For truly unfathomable reasons, we need to do this several times, otherwise the first
	// execution takes several milliseconds against a local server. No idea why.
	for (var i = 0; i < 20; i++) {
		var startTime = env.System.nanoTime();
		db.runCommand(pingDoc);
		var endTime = env.System.nanoTime();
		if (endTime - startTime < minLatency) {
			minLatency = endTime - startTime;
		}
	}
} catch (e) {
	log.error("Error thrown during testConnection:" + e.message);
	return {
		status: "NOT OK",
		message: e.message
	}
}
if (null === db) {
	return {
		status: "NOT OK"
	}
}

//Latency
var latencyInMillis = minLatency / 1000000;
mongoClient.close();

var returnedObj = {
	status: "OK",
	latency: latencyInMillis
};

if (log.isDebugEnabled()) {
	log.debug("MongoDB - testConnection returning " + returnedObj);
}

return returnedObj;
