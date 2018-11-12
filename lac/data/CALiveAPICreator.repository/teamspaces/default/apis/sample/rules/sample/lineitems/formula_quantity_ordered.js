return row.kitItem !== null ?
    row.kit_number_required * row.kitItem.quantity_ordered :
    row.quantity_ordered
