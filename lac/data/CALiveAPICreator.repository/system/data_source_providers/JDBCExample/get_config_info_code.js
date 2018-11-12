log.info("Begin JDBCExample getConfigInfo code");
var configInfo = {
	ui_config: [{
		display: "Hostname",
		type: "string",
		length: 90,
		required: true,
		parameterName: "hostname",
		placeholder: "Enter the hostname",
		description: "Enter Hostname  (e.g., localhost)"
	}, {
		display: "Port",
		type: "number",
		length: 10,
		required: false,
		parameterName: "port",
		placeholder: "Enter the port number",
		description: "The port number for your host (optional)"
	}, {
		display: "Database Name",
		type: "string",
		length: 90,
		required: true,
		parameterName: "databaseName",
		placeholder: "Enter the database name",
		description: "Name of your Database"
	}, {
		display: "User name",
		type: "string",
		length: 90,
		required: false,
		parameterName: "username",
		placeholder: "Enter the authentication username",
		description: "Authorized Username for your Database"
	}, {
		display: "Password",
		type: "secret",
		length: 90,
		required: false,
		parameterName: "password",
		placeholder: "Enter the password for the database user",
		description: "The password for the database user. Once saved, it is encrypted and can therefore appear longer than expected."
	}],
	// Environment variables used in all JS code (e.g., env.jdbcInfo)
	env: {
		System: Java.type("java.lang.System"),
		DriverManager: Java.type("java.sql.DriverManager"),
		jdbcInfo: "jdbc:derby:",
		sqlSelectTest: "select * from \"SYS\".\"SYSTABLES\" FETCH FIRST 1 ROWS ONLY",
		leftQuote: "\"",
		rightQuote: "\""

	},
	// Capabilities
	options: {
		canCommit: true
	}
};
if (log.isDebugEnabled()) {
	log.debug("JDBCExample - getConfigInfo return" + configInfo);
}
log.info("End JDBCExample getConfigInfo code");
return configInfo;
