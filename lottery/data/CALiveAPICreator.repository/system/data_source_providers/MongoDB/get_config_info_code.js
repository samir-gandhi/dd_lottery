log.info("Begin MongoDB getConfigInfoCode()");
var configInfo = {
	ui_config: [{
		display: "Hostname",
		type: "string",
		length: 80,
		required: true,
		parameterName: "hostname",
		placeholder: "Enter the hostname",
		description: "The hostname of your MongoDB database, for instance localhost or mongodbserver.acme.com"
	}, {
		display: "Port",
		type: "number",
		length: 10,
		required: true,
		parameterName: "port",
		placeholder: "Enter the port",
		description: "The port number of your MongoDB host -- usually 27017"
	}, {
		display: "Database Name",
		type: "string",
		length: 80,
		required: true,
		parameterName: "dbname",
		placeholder: "Enter the database name",
		description: "The name of your MongoDB database, for instance \"local\""
	}, {
		display: "Username",
		type: "string",
		length: 80,
		required: false,
		parameterName: "username",
		placeholder: "Enter the authentication username",
		description: "Authorized username for your MongoDB Database"
	}, {
		display: "Password",
		type: "secret",
		length: 80,
		required: false,
		parameterName: "password",
		placeholder: "The secret password for your MongoDB user",
		description: "Password for your authorized MongoDB Database user."
	}],
	// Environment
	env: {
		System: Java.type("java.lang.System"),
		BasicDBObject: Java.type("com.mongodb.BasicDBObject"),
		Document: Java.type("org.bson.Document"),
		Filters: Java.type("com.mongodb.client.model.Filters"),
		KahunaException: Java.type("com.kahuna.server.KahunaException"),
		MongoClient: Java.type("com.mongodb.MongoClient"),
		MongoClientOptions: Java.type("com.mongodb.MongoClientOptions"),
		ObjectId: Java.type("org.bson.types.ObjectId"),
		Sorts: Java.type("com.mongodb.client.model.Sorts"),
		ServerAddress: Java.type("com.mongodb.ServerAddress")
	},
	// Capabilities
	options: {
		canCommit: false,
		isTabular: true
	}
};
log.info("End MongoDB getConfigInfoCode()");

return configInfo;
