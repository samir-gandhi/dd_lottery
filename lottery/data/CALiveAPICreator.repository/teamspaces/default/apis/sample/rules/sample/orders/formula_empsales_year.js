log.debug("Sales Tracking - Compute Year - row: " + row);
return moment(row.placed_date).year();
