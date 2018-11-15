if (row.Alerts_datetime === null) {
    return new Date();
}
else {
    return row.Alerts_datetime;
}
