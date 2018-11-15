log.info("Begin JDBCExample getStructure code");
var metadata = {};
metadata.entities = [];
metadata.procedures = [];
//connection is passed in from configure_code.js
var databaseMetaData = connection.getMetaData();
var catalogName = connection.getCatalog();
var schemaName = connection.getSchema();
var type = Java.to(["TABLE", "VIEW"], "java.lang.String[]"); // new java.lang.String[]; <<does not work?

var tbls = databaseMetaData.getTables(catalogName, schemaName, "%", type);
var entity, column, key;
while (tbls.next()) {
	entity = {};
	entity.schema = schemaName;
	entity.name = tbls.getString("TABLE_NAME");
	entity.type = tbls.getString("TABLE_TYPE"); //or view or proc?
	metadata.entities.push(entity);
	entity.columns = [];
	entity.keys = [];
	entity.parents = [];
	//Entity Column (Tables and Views)
	rs = databaseMetaData.getColumns(catalogName, schemaName, entity.name, "%");
	while (rs.next()) {
		column = {};
		column.name = rs.getString("COLUMN_NAME");
		column.generic_type = String(rs.getInt("DATA_TYPE")); // string, boolean, date, datetime, number
		column.subtype = rs.getString("TYPE_NAME"); // decimal
		column.nullable = "YES" == rs.getString("IS_NULLABLE");
		column.length = rs.getInt("CHAR_OCTET_LENGTH");
		column.size = rs.getInt("COLUMN_SIZE");
		column.fixed_size = false;
		column.precision = rs.getInt("DECIMAL_DIGITS");
		column.scale = rs.getInt("NUM_PREC_RADIX");
		column.autonum = "YES" == rs.getString("IS_AUTOINCREMENT");
		entity.columns.push(column);
	}
	rs.close();

	//Primary Keys
	var rs2 = databaseMetaData.getPrimaryKeys(catalogName, schemaName, entity.name);
	key = {};
	key.columns = [];
	while (rs2.next()) {
		key.seq = rs2.getInt("KEY_SEQ");
		if (key.seq == 1) {
			key.name = rs2.getString("PK_NAME") || "PRIMARY";
			key.type = "PRIMARY"; //CANDIDATE
		}

		key.columns.push(rs2.getString("COLUMN_NAME"));
	}
	rs2.close();

	entity.keys.push(key);
	//Foreign Keys
	var rs3 = databaseMetaData.getImportedKeys(catalogName, schemaName, entity.name);
	var parent = {};
	parent.parent_column_names = [];
	parent.child_column_names = [];
	var last_parent = "undefined";
	while (rs3.next()) {

		var seq = rs3.getInt("KEY_SEQ");
		if (seq == 1) {
			parent.parent_entity = rs3.getString("PKTABLE_NAME");
			parent.role_name = rs3.getString("FK_NAME");
			parent.constraint_name = rs3.getString("FK_NAME");
			parent.update_rule = rs3.getShort("UPDATE_RULE");
			parent.delete_rule = rs3.getShort("DELETE_RULE");
			parent.child_entity = rs3.getString("FKTABLE_NAME");
		}
		parent.parent_column_names.push(rs3.getString("PKCOLUMN_NAME"));
		parent.child_column_names.push(rs3.getString("FKCOLUMN_NAME"));
		if (parent.parent_entity !== last_parent) {
			entity.parents.push(parent);
			parent = {};
			parent.parent_column_names = [];
			parent.child_column_names = [];
		}
		last_parent = parent.parent_entity;
	}
	rs3.close();
}

//Stored Procedures
var proc = {};
proc.columns = [];
var procColumn = {};
var rs4 = databaseMetaData.getProcedures(catalogName, schemaName, null);
while (rs4.next()) {
	proc = {};
	proc.columns = [];
	proc.name = rs4.getString("PROCEDURE_NAME");
	proc.remarks = rs4.getString("REMARKS");

	var procColumnsRs = databaseMetaData.getProcedureColumns(catalogName, schemaName, proc.name, null);
	while (procColumnsRs.next()) {
		procColumn = {};
		procColumn.column_name = procColumnsRs.getString("COLUMN_NAME");
		procColumn.column_type = procColumnsRs.getShort("COLUMN_TYPE");
		procColumn.data_type = procColumnsRs.getInt("DATA_TYPE");
		proc.columns.push(procColumn);
	}
	procColumnsRs.close();
	metadata.procedures.push(proc);
}
rs4.close();

var jsn = JSON.stringify(metadata, null, 2);
if (log.isDebugEnabled())
	log.debug("JDBCExample -  metadata " + jsn);

log.info("End JDBCExample getStructure code")
return jsn;
