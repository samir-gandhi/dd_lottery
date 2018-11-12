return row.amount_total *
       ( (row.customer.customer_level == "P") ? 0.95 : 1.00);
