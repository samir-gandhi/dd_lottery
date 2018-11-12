log.info("Begin JDBCExample close code");
if (connection) {
	try {
		if (log.isFinestEnabled()) {
			log.finest("JDBCExample - Connection: " + connection);
		}
		connection.close();
	}
	catch (e) {
		log.error("JDBCExample - Close Connection Error " + e.message);
		throw e;
	}
}
log.info("End JDBCExample close code");
