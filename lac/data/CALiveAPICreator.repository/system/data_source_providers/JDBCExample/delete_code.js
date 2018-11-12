log.info("Begin JDBCExample delete code");
var where = "";
var sep = "";
var result = {};

if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	var logMessage = "Delete entity " + entityName + "=" + parameters.entityKey;
	log.debug(logMessage);
	applog.debug(logMessage);
}

var columnList = datasourceUtil.getColumnList(entityName);
var keyColumnList = datasourceUtil.getKeyColumnList(entityName);

if (log.isFinestEnabled() || applog.isFinestEnabled()) {
	log.finest("Column List" + JSON.stringify(columnList));
	log.finest("Key Column List " + JSON.stringify(keyColumnList));
}

for (var i in keyColumnList) {
	var pkName = keyColumnList[i];
	where += sep + env.leftQuote + pkName + env.rightQuote + " = ?\n";
	sep = " , ";
}

var sql = "delete FROM " + env.leftQuote + datasourceUtil.decodeURISegment(entityName) + env.rightQuote + "\n";
sql += " WHERE  " + where + "\n";
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	var logMessage = "Delete SQL " + sql + " " + parameters.entityKey;
	applog.debug(logMessage);
	log.debug(logMessage);
}
var pstmt = connection.prepareStatement(sql);

var keypart;
var key = "";
var keysep = "";
var colIdx = 1;
for (var idx in parameters.entityKey) {
	keypart = parameters.entityKey[idx];
	if (log.isFinestEnabled()) {
		log.finest("keypart = " + decodeURI(keypart));
	}
	pstmt.setObject(colIdx, decodeURI(keypart));
	key += keysep + keypart;
	keysep = "~";
	colIdx++;
}

var numRows = pstmt.executeUpdate();
if (0 === numRows) {
	if (log.isDebugEnabled() || applog.isDebugEnabled()) {
		var logMessage = " No data deleted in table: " + parameters.qualifiedEntityName;
		applog.debug(logMessage);
		log.debug(logMessage);
	}
}
pstmt.close();

if (!skipMetadata) {
	result[parameters.metadataName] = {};
	result[parameters.metadataName].href = parameters.baseUrl + datasourceUtil.encodePathSegment(parameters.qualifiedEntityName) + "/" + key;
}
result.numRows = numRows;
var json = JSON.stringify(result);
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "JDBC - update - result " + json;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End JDBCExample delete code");
return json;
