/*
A simple example to demonstrate how to access posted payload in functions or JavaScript Resource.
The function takes orderby as query param and an array as JSON: 
{
	"fruits": ["Banana", "Orange", "Apple", "Mango"]
}
*/

if(parameters.orderby == 'asc'){
    var temp = JSON.parse(req.json);
    return {"response":temp.fruits.sort()};    
}else if(parameters.orderby == 'desc'){
    var temp = JSON.parse(req.json);
    return {"response":temp.fruits.sort().reverse()};    
}else{
    return {"error":"invalid orderby type"};
}
