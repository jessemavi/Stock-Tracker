import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Price extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <h2>{this.props.iexQuoteData.companyName}({this.props.iexQuoteData.symbol})</h2>
        {this.props.followingStock === true ?
          <Button onClick={this.props.unfollowStock}>Remove from Watchlist</Button>
        :
          <Button onClick={this.props.followStock}>Add to Watchlist</Button>
        }
        <p>{this.props.iexQuoteData.primaryExchange}</p>
        <h1>
          {this.props.iexQuoteData.latestPrice} &nbsp;
          {this.props.iexQuoteData.change} &nbsp;
          ({this.props.iexQuoteData.changePercent} %) &nbsp;
        </h1>
      </div>
    );
  }
};

export default Price;
