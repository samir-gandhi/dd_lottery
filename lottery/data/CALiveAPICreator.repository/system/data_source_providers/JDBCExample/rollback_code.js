log.info("Begin JDBCExample rollback code");
if (connection) {
	try {
		if (log.isFinestEnabled()) {
			log.finest("JDBCExample - Connection: " + connection);
		}

		connection.rollback();
	}
	catch (e) {
		log.error("Rollback Error " + e.message);
		throw e;
	}
}
log.info("End JDBCExample rollback code");
