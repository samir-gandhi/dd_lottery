var isAKit = row.product.count_components;  // should always resolve to product
 log.error("!my product: " + row.product);
 log.error("!components: "  + isAKit + ", logicContext.verb: " + logicContext.verb);
 log.error("!kit_Item_ident: "  + row.kit_item_ident);
 log.error("!kitItem: "  + row.kitItem);
 if (logicContext.verb == "INSERT" && row.product.count_components > 0) {
 SysLogic.insertChildrenFrom("lineitems", row.product.components, logicContext);
 }
