if (row.RequiredDate === null) {
    // specify use of moment() library;
    return new Date(moment().add('months', 1));
}
else {
    return row.RequiredDate;
}
