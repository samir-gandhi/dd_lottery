SELECT sum("amount_total") as SUM_AMOUNT
      ,"salesrep_id"
  FROM "@{SCHEMA}"."PurchaseOrder" o
 inner join "@{SCHEMA}"."LineItem" i
    on o."order_number" = i."order_number"
 where "paid" = true
   and i."product_number" in
  (SELECT l."product_number"
     FROM "@{SCHEMA}"."LineItem" l
     group by l."product_number"
   having count(*) > 20)
 group by "salesrep_id"
