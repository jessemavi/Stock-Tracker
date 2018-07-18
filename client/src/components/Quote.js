import React from 'react';
import Summary from './Summary';
import Chart from './Chart';

const Quote = (props) => {
  return (
    <div>
      <h2>Quote Component</h2>
      <Summary symbol={props.match.params.symbol} />
      <Chart symbol={props.match.params.symbol} />
    </div>
  );
}

export default Quote;
