import React, { Component } from 'react';
import axios from 'axios';
import { } from 'semantic-ui-react';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iexQuoteData: {},
      robinhoodQuoteData: {}
    };
  }

  componentDidMount = async () => {
    try {
      const iexDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.symbol}/quote`);
      const robinhoodDataResponse = await axios.get(`https://api.robinhood.com/quotes/${this.props.symbol}/`);

      this.setState({
        iexQuoteData: iexDataResponse.data,
        robinhoodQuoteData: robinhoodDataResponse.data
      });

      console.log(this.state);
    } catch(err) {
      console.log(err);
      return;
    }

  }

  render() {
    return (
      <div>
        <div>
          <h2>{this.state.iexQuoteData.companyName}({this.state.iexQuoteData.symbol})</h2>
          <p>{this.state.iexQuoteData.primaryExchange}</p>
          <h1>
            {this.state.iexQuoteData.latestPrice} &nbsp;
            {this.state.iexQuoteData.change} &nbsp;
            ({this.state.iexQuoteData.changePercent} %) &nbsp;
          </h1>
        </div>
        <div>
          <p>Previous Close <strong>{this.state.iexQuoteData.previousClose}</strong></p>
          <p>Open <strong>{this.state.iexQuoteData.open}</strong></p>
          <p>Bid <strong>{this.state.robinhoodQuoteData.bid_price}</strong></p>
          <p>Ask <strong>{this.state.robinhoodQuoteData.ask_price}</strong></p>
          <p>Day's Range <strong>{this.state.iexQuoteData.low} - {this.state.iexQuoteData.high}</strong></p>
          <p>Volume <strong>{this.state.iexQuoteData.latestVolume}</strong></p>
        </div>
      </div>
    );
  }
};

export default Summary;
