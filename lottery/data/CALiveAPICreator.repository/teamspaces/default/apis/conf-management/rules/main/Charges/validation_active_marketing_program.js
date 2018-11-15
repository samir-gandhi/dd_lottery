var marketingProgram = row.MarketingProgram;
return ( logicContext.getVerb() == "DELETE" || (marketingProgram !== null && marketingProgram.IsActive === true));
