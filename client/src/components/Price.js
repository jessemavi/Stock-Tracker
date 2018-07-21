import React from 'react';

const Price = (props) => {
  return (
    <div>
      <h2>{props.iexQuoteData.companyName}({props.iexQuoteData.symbol})</h2>
      <p>{props.iexQuoteData.primaryExchange}</p>
      <h1>
        {props.iexQuoteData.latestPrice} &nbsp;
        {props.iexQuoteData.change} &nbsp;
        ({props.iexQuoteData.changePercent} %) &nbsp;
      </h1>
    </div>
  );
};

export default Price;
