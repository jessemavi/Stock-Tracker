import React from 'react';
import Summary from './Summary';
import Chart from './Chart';
import { Divider } from 'semantic-ui-react';

const Quote = (props) => {
  return (
    <div>
      <Summary symbol={props.match.params.symbol} />
      <Divider />
      <Chart symbol={props.match.params.symbol} />
    </div>
  );
}

export default Quote;
