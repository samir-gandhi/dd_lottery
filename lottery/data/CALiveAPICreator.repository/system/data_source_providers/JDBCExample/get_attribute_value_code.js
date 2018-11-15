log.info("Begin JDBCExample getAttributeValue code");

if (log.isFinestEnabled()) {
	log.finest("entityName " + datasourceUtil.decodeURISegment(entityName));
	log.finest("attributeName " + attributeName);
	log.finest("key " + key);
}

var keyColumnList = datasourceUtil.getKeyColumnList(entityName);
var columnTypeList = datasourceUtil.getColumnJDBCTypeList(entityName);

var pkeyColumnNames = "";
var sep = "";
for (var i in keyColumnList) {
	pkeyColumnNames += sep + env.leftQuote + keyColumnList[i] + env.rightQuote + " = ?";
	sep = " AND ";
}

var sql = "SELECT " + env.leftQuote + attributeName + env.rightQuote + "\n"
	+ " FROM " + env.leftQuote + datasourceUtil.decodeURISegment(entityName) + env.rightQuote + "\n";
sql += " WHERE " + pkeyColumnNames;

if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	log.debug("Get One SQL statement: " + sql);
	applog.debug("Get One SQL statement: " + sql);
}
var pstmt = connection.prepareStatement(sql);

var colIdx = 0;
for (var i in keyColumnList) {
	var pkName = keyColumnList[i];
	var value = datasourceUtil.decodeURISegment(key[colIdx]);
	if (log.isFinestEnabled()) {
		log.finest("PKey colName " + pkName + " value = " + value);
	}
	datasourceUtil.objectSetValue(pstmt, colIdx + 1, pkName, value);
	colIdx++;
}
var result = null;
var rs = pstmt.executeQuery();
var colType;
if (rs.next()) {
	colType = columnTypeList[attributeName];
	if (colType === 2004) {
		var blob = rs.getBlob(attributeName);
		if (null !== blob) {
			result = blob.getBytes(1, blob.length());
		}
	}
}
rs.close();
pstmt.close();
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "JDBCExample - getAttributeValue - Return: " + result;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End JDBCExample getAttributeValue code");
return result;
