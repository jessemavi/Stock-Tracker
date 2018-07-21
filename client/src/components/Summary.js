import React from 'react';
import axios from 'axios';

const Summary = (props) => {
  return (
    <div>
      <div>
        <p>Previous Close <strong>{props.iexQuoteData.previousClose}</strong></p>
        <p>Open <strong>{props.iexQuoteData.open}</strong></p>
        <p>Bid <strong>{props.robinhoodQuoteData.bid_price}</strong></p>
        <p>Ask <strong>{props.robinhoodQuoteData.ask_price}</strong></p>
        <p>Day's Range <strong>{props.iexQuoteData.low} - {props.iexQuoteData.high}</strong></p>
        <p>Volume <strong>{props.iexQuoteData.latestVolume}</strong></p>
      </div>
    </div>
  );
};

export default Summary;
