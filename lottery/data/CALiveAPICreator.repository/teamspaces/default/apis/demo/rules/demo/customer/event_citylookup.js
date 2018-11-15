var detail = {
        filter: "{_id: \"32751\"}" ,
        order: "",
        pagesize: 30,
        offset: 0,
        verbose: false
};

var response =  SysUtility.getResource('zipcodes', detail);
log.debug(JSON.stringify(response,null,2));
log.debug(response[0].state);
log.debug(response[0].city);
//log.debug(response[0].loc);
