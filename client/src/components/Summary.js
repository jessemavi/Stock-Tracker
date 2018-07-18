import React, { Component } from 'react';
import axios from 'axios';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quoteData: {}
    };
  }

  componentDidMount = async () => {
    const quoteDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.symbol}/quote`);

    this.setState({
      quoteData: quoteDataResponse.data
    });

    console.log(this.state.quoteData);
  }

  render() {
    return (
      <div>
        <h3>Summary Component</h3>
      </div>
    );
  }
};

export default Summary;
