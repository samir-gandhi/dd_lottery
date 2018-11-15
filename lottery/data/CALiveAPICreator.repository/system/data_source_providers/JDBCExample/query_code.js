log.info("Begin JDBCExample query code");

if (log.isFinestEnabled()) {
	log.finest("parameters are: " + parameters);
	log.finest("   parameters.filters are: " + parameters.filters);
}
//print("  pagesize: " + parameters.pagesize);
//print("  offset: " + parameters.offset);
var metadataName = parameters.metadataName || "@metadata";
var skipMeta = parameters.isSkipMeta || true;
var pagesize = parameters.pagesize || 20;
var offset = parameters.offset || 0;
var filter = "";
var join;
var order = "";

var columnList = datasourceUtil.getColumnList(entityName);
var aliasColumnList = columnList;
var keyColumnList = datasourceUtil.getKeyColumnList(entityName);
var columnTypeList = datasourceUtil.getColumnJDBCTypeList(entityName);

parameters.filters.forEach(function (k, v) {
	print("   Found filter for " + k);
	for (var i = 0; i < v.size(); i++) {
		var filterName = v[i].filterName;
		join = ""
		if (log.isFinestEnabled()) {
			log.finest("FilterName is: " + filterName);
		}
		var filterType;
		switch (filterName) {
			default:
			case "equal":
				filterType = " =";
				break;
			case "notequal":
				filterType = " !=";
				break;
			case "less":
				filterType = " <";
				break;
			case "lessequal":
				filterType = " <=";
				break;
			case "greater":
				filterType = " >";
				break;
			case "greaterequal":
				filterType = ">=";
				break;
			case "like":
				filterType = " like";
				break;
		}
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			if (log.isFinestEnabled()) {
				log.finest("   Param: " + param.name);
			}
			filter += join + env.leftQuote + param.name + env.rightQuote + filterType + "  ?\n";
			join = filterName && filterName.endsWith("_or") ? " or " : " and ";
		}
	}
});

if (filter == "") {
	filter = "1=1";
}

join = "";
parameters.orders.forEach(function (k, v) {
	print("   Found sort for " + k);
	for (var i = 0; i < v.size(); i++) {
		print("      order is: " + v[i]);
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			if (log.isFinestEnabled()) {
				log.finest("   Order by : " + env.leftQuote + param.name + env.rightQuote + " " + param.action);
			}
			order += join + env.leftQuote + param.name + env.rightQuote + " " + param.action + "\n";
			join = " , ";
		}
	}
});

if (order == "") {
	order = "1 asc";
}

var sep = "";
var selectColumnList = "";

if (parameters.columnList) {
	columnList = [];
	aliasColumnList = [];
	for (var column in parameters.columnList) {
		alias = null != parameters.columnList[column] ? parameters.columnList[column] : column;
		columnList.push(column);
		aliasColumnList.push(alias);
		selectColumnList += sep + env.leftQuote + column + env.rightQuote + " as " + env.leftQuote + alias + env.rightQuote;
		sep = "\n  ,";
	}
}
else {
	selectColumnList = "*";
}

if (log.isFinestEnabled() || applog.isFinestEnabled()) {
	var columnListMessage = "Column List " + columnList;
	var aliasColumnListMessage = "Alais Column List " + aliasColumnList;
	var keyColumnListMessage = "Key Column List " + keyColumnList;

	log.finest("Entity " + datasourceUtil.decodeURISegment(entityName));
	log.finest(columnListMessage);
	applog.finest(columnListMessage);
	log.finest(aliasColumnListMessage);
	applog.finest(aliasColumnListMessage);
	log.finest(keyColumnListMessage);
	applog.finest(keyColumnListMessage);
}

var sql = "SELECT " + selectColumnList + " FROM " + env.leftQuote + datasourceUtil.decodeURISegment(entityName) + env.rightQuote + "\n";
sql += " WHERE  " + filter + "\n";
sql += " ORDER BY " + order + "\n";
//This is specific for Derby Only
if (offset <= 0) {
	sql = sql + " fetch first " + (pagesize + 1) + " rows only";
}
else {
	sql = sql + " offset " + offset + " rows fetch first " + (pagesize + 1) + " rows only";
}

if (log.isDebugEnabled()) {
	log.debug("SQL query: " + sql);
}
var pstmt = connection.prepareStatement(sql);
parameters.filters.forEach(function (k, v) {
	if (log.isFinestEnabled()) {
		log.finest("   Apply values for " + k);
	}
	for (var i = 0; i < v.size(); i++) {
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			if (log.isFinestEnabled()) {
				log.finest("name " + param.name + " value:" + param.value);
			}
			datasourceUtil.objectSetValue(pstmt, i + 1, param.name, param.value);
		}
	}
});

var rs = pstmt.executeQuery();
var colCount = columnList.length;
var value;
var row;
var colName;
var aliasColName;
var key, sep;
var data = [];
var numObjects = 0;
while (rs.next()) {
	row = {};
	numObjects++;
	if (numObjects > parameters.pagesize) {
		break;
	}

	key = "";
	sep = ""
	for (var i in keyColumnList) {
		var pkName = keyColumnList[i];
		row[pkName] = rs.getObject(pkName);
		key += sep + encodeURI(row[pkName]);
		sep = "~";
	}

	for (var i = 0; i < colCount; i++) {
		colName = columnList[i];
		aliasColName = aliasColumnList[i];
		colType = columnTypeList[colName];
		//this is how to handle speical datatype like Types.Blob 2004 - returns a /data/ link
		if(colType === 2004) {
			value = null;
			var blob = rs.getBlob(aliasColName);
			if (null !== blob) {
			    var dataURL = parameters.baseUrl.replace('rest','data');
				value  = { "type": "binary", "length": blob.length(), "url":  dataURL + parameters.qualifiedEntityName + "/" + key + "/" + aliasColName};
				// blob.getBytes(1, blob.length());
			}
			row[colName] = value;
		} else {
			value = rs.getObject(aliasColName);
			row[colName] = datasourceUtil.formatObject(value, colName);
		}
	}

	var pkey = "";
	sep = "";
	for (var i in keyColumnList) {
		var pkName = keyColumnList[i];
		pkey += sep + encodeURI(row[pkName]);
		sep = "~";
	}
	if (!skipMetadata) {
		var linkStr = datasourceUtil.getLinks(parameters.fullEntityName, row);
		if (log.isFinestEnabled()) {
			log.finest("links: " + linkStr);
		}
		row[parameters.metadataName] = {};
		row[parameters.metadataName].links = JSON.parse(linkStr);
		row[parameters.metadataName].href = parameters.baseUrl + datasourceUtil.encodePathSegment(parameters.qualifiedEntityName) + "/" + pkey;
	}
	data.push(row);
}
rs.close();
pstmt.close();

if (!skipMetadata) {
	if (numObjects > parameters.pagesize) {
		row = {};
		numObjects--;
		row[parameters.metadataName] = {};
		row[parameters.metadataName].next_batch = parameters.baseUrl + parameters.qualifiedEntityName + "?pagesize=" + parameters.pagesize + "&offset=" + (parameters.offset + numObjects);
		data.push(row);
	}
}

var result = JSON.stringify(data, null, 2);
if (log.isDebugEnabled() || applog.isDebugEnabled()) {
	logMessage = "JDBC - getByQuery - Result " + result;
	log.debug(logMessage);
	applog.debug(logMessage);
}

log.info("End JDBCExample query code");
return result;
