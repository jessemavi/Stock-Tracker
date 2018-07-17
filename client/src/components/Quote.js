import React, { Component } from 'react';
import axios from 'axios';

class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: {}
    };

    console.log(this.props);
  }

  componentDidMount = async () => {
    // request to get stock price info
    const quoteDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.match.params.symbol}/quote`);
    const chartDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.match.params.symbol}/chart/5y`);

    this.setState({
      quote: quoteDataResponse.data,
      chart: chartDataResponse.data
    });

    console.log(this.state);
  };

  render() {
    return (
      <h2>Quote Component</h2>
    );
  }
}

export default Quote;
