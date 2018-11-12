// nestLevel check avoids seeing propagation from changed order
if (logicContext.getLogicNestLevel() === 1) {
    return Math.min(row.allocationOrder.amount_un_paid, row.amount);
}
else {
    return row.amount;
}
