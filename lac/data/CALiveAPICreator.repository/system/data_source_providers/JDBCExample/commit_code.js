log.info("Begin JDBCExample commit code");
if (connection) {
	try {
		if (log.isFinestEnabled()) {
			log.finest("JDBCExample - Connection: " + connection);
		}
		connection.commit();
	}
	catch (e) {
		log.error("Commit Connection Error " + e.message);
		throw e;
	}
}
log.info("End JDBCExample commit code");
