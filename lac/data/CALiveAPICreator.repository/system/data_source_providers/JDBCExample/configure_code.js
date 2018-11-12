log.info("Begin JDBCExample configure code");
//the get_config_idnfo_code.js defined the variable names below:
var databaseName = settings && settings.databaseName || "NORTHWIND";
var hostname = settings && settings.hostname || "NORTHWIND";
var username = settings && settings.username || "NORTHWIND";
var password = settings && settings.password || "password";
var port = settings && settings.port || "";
var url = env.jdbcInfo + databaseName;
//var url = uri + hostname + ":" + port +"/" + databaseName; // use this for most JDBC database connections
if (log.isFinestEnabled())
	log.finest("JDBCExample -  URL " + url);
var connection = env.DriverManager.getConnection(url, username, password);
connection.setAutoCommit(false); //required by LAC

log.info("End JDBCExample configure code");
return connection;
