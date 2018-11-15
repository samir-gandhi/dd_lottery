select * from "@{SCHEMA}"."orders" where "ident" not in
 (select o."ident" from "@{SCHEMA}"."orders" o
 join "@{SCHEMA}"."lineitems" l on l."order_ident" = o."ident"
 left join "@{SCHEMA}"."products" p on p."name" = l."product_name"
 where p."is_secret" = true)
