import React, { Component } from 'react';
import axios from 'axios';
import { Search } from 'semantic-ui-react'

class Header extends Component {
  constructor() {
    super();
    this.state = {
      allStocks: []
    };
  }

  componentDidMount = async () => {
    try {
      const allStocksResponse = await axios.get('/allStocks');
      this.setState({
        allStocks: allStocksResponse.data
      });
    } catch(err) {
      console.log(err);
      return;
    }

    console.log(this.state);
  };

  render() {
    return (
      <div>
        <Search />
      </div>
    );
  }
}

export default Header;
