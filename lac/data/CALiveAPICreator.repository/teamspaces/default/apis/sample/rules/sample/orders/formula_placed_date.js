if (row.placed_date === null) {
 return new Date(); // moment();
}
else {
 return row.placed_date;
}
