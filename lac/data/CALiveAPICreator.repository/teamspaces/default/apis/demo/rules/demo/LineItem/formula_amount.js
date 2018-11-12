if (row.qty_ordered <= 6)  // discount (using conditional JavaScript logic)
   return row.product_price * row.qty_ordered;
else
   return row.product_price * row.qty_ordered * 0.8;
