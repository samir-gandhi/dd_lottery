log.info("Begin JDBCExample testConnection code.");
var startTime = env.System.nanoTime();
var databaseName = settings && settings.databaseName || "NORTHWIND";
var hostname = settings && settings.hostname || "NORTHWIND";
var username = settings && settings.username || "NORTHWIND";
var password = settings && settings.password || "password";
var port = settings && settings.port || "";
var uri = env.jdbcInfo;
var url = uri + databaseName;

if (log.isFinestEnabled()) {
	log.finest("JDBCExample - testConnection url " + url + " username:" + username);
}
try {
	if (env.sqlSelectTest) {
		var sql = env.sqlSelectTest;
		if (log.isFinestEnabled()) {
			log.finest("JDBCExample - Test sql " + sql);
		}
		var connection = env.DriverManager.getConnection(url, username, password);
		var stmt = connection.createStatement();
		var rs = stmt.executeQuery(sql);
		if (rs.next()) {
			log.debug("JDBCExample - Test Select " + rs.getObject(1));
		}
		rs.close();
		stmt.close()
		connection.close();
	}
}
catch (e) {
	var result = {};
	log.error("JDBCExample - Error thrown during testConnection:" + e.message);
	result.status = "NOT OK";
	result.message = e.message;
	return result;
}

var endTime = env.System.nanoTime();
var latencyInMillis = (endTime - startTime) / 100000000;
var resultObj = {
	status: "OK",
	latency: latencyInMillis
};

if (log.isDebugEnabled()) {
	log.debug("JDBCExample - Returned result: " + resultObj);
}
log.info("End JDBCExample testConnection code");
return resultObj;
