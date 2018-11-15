log.finest("Begin JDBCExample getByKey");
var pkeyColumnNames = "";
var result = "";
var row;

var columnList = datasourceUtil.getColumnList(entityName);
var keyColumnList = datasourceUtil.getKeyColumnList(entityName);
var columnTypeList = datasourceUtil.getColumnJDBCTypeList(entityName);
var aliasColumnList = columnList;

var sep = "";
for (var i in keyColumnList) {
	pkeyColumnNames += sep + env.leftQuote + keyColumnList[i] + env.rightQuote + " = ?";
	sep = " AND ";
}

sep = "";
var selectColumnList = "";
if (parameters.columnList) {
	columnList = [];
	aliasColumnList = [];
	for (var column in parameters.columnList) {
		alias = null != parameters.columnList[column]? parameters.columnList[column] : column;
		columnList.push(column);
		aliasColumnList.push(alias);
		selectColumnList += sep + env.leftQuote + column + env.rightQuote + " as " + env.leftQuote + alias + env.rightQuote;
		sep = "\n  ,";
	}
}
else {
	selectColumnList = "*";
}

var sql = "SELECT " + selectColumnList + " FROM " + env.leftQuote + datasourceUtil.decodeURISegment(entityName) + env.rightQuote + "\n";
sql += " WHERE " + pkeyColumnNames;


if (log.isFinestEnabled()) {
	log.finest("Column List " + columnList);
	log.finest("Alias Column List" + aliasColumnList);
	log.finest("Column jdbc sql type List" + columnTypeList);
	log.finest("Key Column List " + keyColumnList);
}
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	var logMessage = "JDBCExample - Get One SQL statement: " + sql;
	log.debug(logMessage);
	applog.debug(logMessage);
}
var pstmt = connection.prepareStatement(sql);

var colIdx = 0;
for (var i in keyColumnList) {
	var pkName = keyColumnList[i];
	var value = decodeURI(key[colIdx]);
	if (log.isFinestEnabled()) {
		log.finest("JDBCExample - PKey colName = " + pkName + ", value = " + value);
	}
	datasourceUtil.objectSetValue(pstmt, colIdx + 1, pkName, value);
	colIdx++;
}

var rs = pstmt.executeQuery();

var value;
var row;
var pkey;
var colName, colType, aliasColName;
var data = [];
var colType;
while (rs.next()) {
	row = {};
	for (var i = 0; i < columnList.length; i++) {
		colName = columnList[i];
		colType = columnTypeList[colName];
		aliasColName = aliasColumnList[i];
		if (colType === 2004) {
			value = null;
			var blob = rs.getBlob(aliasColName);
			if (null !== blob) {
			    var dataURL = parameters.baseUrl.replace('rest','data');
				value  = { "type": "binary", "length": blob.length(), "url":  dataURL + datasourceUtil.encodePathSegment(parameters.qualifiedEntityName) + "/" + key[0] + "/" + aliasColName};
				// blob.getBytes(1, blob.length());
			}
			row[colName] = value;
		}
		else {
			value = rs.getObject(aliasColName);
			row[colName] = datasourceUtil.formatObject(value, colName);
		}
	}

	pkey = "";
	sep = "";
	for (var i in keyColumnList) {
		var pkName = keyColumnList[i];
		pkey += sep + encodeURI(row[pkName]); //need to URL Encode this
		sep = "~";
	}


	if (!skipMetadata) {
		var linkStr = datasourceUtil.getLinks(parameters.fullEntityName, row);
		row[parameters.metadataName] = {};
		row[parameters.metadataName].links = JSON.parse(linkStr);
		row[parameters.metadataName].href = parameters.baseUrl + datasourceUtil.encodePathSegment(parameters.qualifiedEntityName) + "/" + pkey;
	}
	data.push(row);
}
rs.close();
pstmt.close();

var result = JSON.stringify(data, null, 2);
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "JDBC - getOne - Result " + result;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End JDBCExample getByKey");
return result;
