log.info("Begin JDBCExample update code");
//this example assumes 1 object
if (log.isFinestEnabled()) {
	log.finest("payload for update " + payload);
}
var jsonPayload = JSON.parse(payload);

var columnList = datasourceUtil.getColumnList(entityName);
var keyColumnList = datasourceUtil.getKeyColumnList(entityName);

if (log.isFinestEnabled()) {
	log.finest("Column List" + JSON.stringify(columnList));
	log.finest("Key Column List " + JSON.stringify(keyColumnList));
}

var rows = [];
if (Array.isArray(jsonPayload) && jsonPayload.length > 0) {
	rows = jsonPayload;
}
else {
	rows.push(jsonPayload);
}

var result = [];
var rowCount = 0;
var pkeyColumnNames = "";
var row;
for (var i = 0; i < rows.length; i++) {
	var sep = "";
	var quotedColumnNames = "\n set ";
	row = rows[i];
	delete row[parameters.metadataName];
	for (var colName in row) {
		if (log.isFinestEnabled()) {
			log.finest("colname = " + colName);
		}
		quotedColumnNames += sep + env.leftQuote + colName + env.rightQuote + "= ?";
		sep = ",";
	}

	var colsep = "";
	for (var i in keyColumnList) {
		var pkName = keyColumnList[i];
		pkeyColumnNames += colsep + env.leftQuote + pkName + env.rightQuote + " = ? \n";
		colsep = " ,\n";
	}

	var sql = "update " + env.leftQuote + entityName + env.rightQuote
		+ quotedColumnNames + "\n"
		+ " where " + pkeyColumnNames + " \n";
	if (log.isDebugEnabled() || applog.isDebugEnabled()) {
		var logMessage = "Update SQL statement: " + sql;
		log.debug(logMessage);
		applog.debug(logMessage);
	}
	var pstmt = connection.prepareStatement(sql);

	var colIdx = 0;
	for (var colName in row) {
		var value = row[colName];
		if (log.isFinestEnabled()) {
			log.finest(colIdx + ") update " + colName + " value = " + value);
		}
		datasourceUtil.objectSetValue(pstmt, colIdx + 1, colName, value);
		colIdx++;
	}

	var key = "";
	var keysep = "";
	for (var i in keyColumnList) {
		var pkName = keyColumnList[i];
		var value = row[pkName];
		if (log.isFinestEnabled()) {
			log.finest(colIdx + ") PKey colName " + pkName + " value = " + value);
		}
		datasourceUtil.objectSetValue(pstmt, colIdx + 1, pkName, value);
		key += keysep + encodeURI(value);
		kesep = "~";
		colIdx++;
	}

	var numRows = pstmt.executeUpdate();
	rowCount += numRows;
	if (!skipMetadata) {
		result[parameters.metadataName] = {};
		result[parameters.metadataName].href = parameters.baseUrl + parameters.qualifiedEntityName + "/" + key;
	}
	pstmt.close();
}

result.push({numOfRows:rowCount});
result.push(jsonPayload);
var json = JSON.stringify(result, null, 2);
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "JDBCExample - update - result " + json;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End JDBCExample update code");
return json;
