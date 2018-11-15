log.info("Begin MongoDB configure_code");
var isDebugEnabled = log.isDebugEnabled();

var conn = {};
// get params.
var hostname = settings.hostname;
var dbName = settings.dbname;
var port = settings.port;

// Milliseconds to keep retrying if a mongodb host is not available.
var serverHitTimeOutInMillis = 10000;

// Client options -- some of these could be externalized in the config parameters
var mongoClientOptions = env.MongoClientOptions.builder()
	.serverSelectionTimeout(serverHitTimeOutInMillis)
	.maxWaitTime(10000)
	.socketKeepAlive(true)
	.connectTimeout(10000)
	.connectionsPerHost(300)
	.build();

// Server Address
var serverAddress = new env.ServerAddress(hostname, port);

// Connecting
try {
	conn.client = new env.MongoClient(serverAddress, mongoClientOptions);
	var dbName = settings.dbname;
	conn.db = conn.client.getDatabase(dbName);
	if (isDebugEnabled)
		log.debug("Connecting to the database: " + hostname + ":" + port + " " + dbName);
}
catch (e) {
	var errorMessage = "Error thrown during openConnection to MongoDB:" + e.message;
	log.error(errorMessage);
	throw e;
}

if (isDebugEnabled)
	log.debug("MongoDB configuration completed successfully. Connection " + conn);

log.info("End MongoDB configure code");
return conn;
