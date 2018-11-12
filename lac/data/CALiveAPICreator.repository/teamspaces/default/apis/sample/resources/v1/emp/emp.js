// we can inject new attributes into the row...

var isApresident = false;
if (row.Name == "A. Lincoln") {
    isApresident = true;
    // also typical: row.full_name = row.first_name + ' ' + row.last_name;
}
row.isPresidentByRowEvent = isApresident;  // creates attr
