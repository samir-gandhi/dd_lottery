if (row.due_date === null) {
 return new Date(moment(row.placed_date).add('months', 1)); // moment();
}
else {
 return row.due_date;
}
