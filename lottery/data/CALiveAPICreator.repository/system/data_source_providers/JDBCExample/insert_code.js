log.info("JDBCExample insert code");
//this example assumes 1 object
if (log.isFinestEnabled()) {
	log.finest("payload for insert " + payload);
}
var valueMap = JSON.parse(payload);
var rows = [];
if (Array.isArray(valueMap) && valueMap.length > 0) {
	rows = valueMap;
}
else {
	rows.push(valueMap);
}

var rowCount = 0;
for (var i = 0; i < rows.length; i++) {
	var sep = "";
	var quotedColumnNames = "";
	var valueOrParams = "";
	var row = rows[i];
	delete row[parameters.metadataName];
	for (var colName in row) {
		//log.finest("colname = "+colName);
		quotedColumnNames += sep + env.leftQuote + colName + env.rightQuote;
		valueOrParams += sep + "?";
		sep = ",";
	}

	var sql = "insert into " + env.leftQuote + entityName + env.rightQuote
		+ "(" + quotedColumnNames + ") \n"
		+ "values (" + valueOrParams + ")\n";
	if (log.isDebugEnabled() || applog.isDebugEnabled()) {
		var logMessage = "Insert SQL statement: " + sql;
		log.debug(logMessage);
		applog.debug(logMessage);

	}
	var pstmt = connection.prepareStatement(sql);

	var colIdx = 0;
	for (var colName in row) {
		colIdx++;
		var value = row[colName];
		log.finest(colName + " value = " + value);
		datasourceUtil.objectSetValue(pstmt, colIdx, colName, value);
	}

	var numRows = pstmt.executeUpdate();
	rowCount++;
	pstmt.close();
}

var result = [];
result.push({"numOfRows": rowCount});
result.push(valueMap);
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "JDBC - insert - result " + result;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End JDBCExample insert code");
return JSON.stringify(result);
