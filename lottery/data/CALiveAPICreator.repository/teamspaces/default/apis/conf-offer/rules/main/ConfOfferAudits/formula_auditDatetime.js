if (row.auditDatetime === null) {
    return new Date();
}
else {
    return row.Alerts_datetime;
}
