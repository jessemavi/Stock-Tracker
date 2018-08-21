import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'semantic-ui-react'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allStocks: [],
      searchInput: '',
      searchResults: [],
      searchSelection: ''
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

    console.log('state in header', this.state);
  };

  handleSearchChange = async (event, data) => {
    console.log('data in handleSearchChange');
    await this.setState({
      searchInput: event.target.value.toLowerCase()
    });

    const filteredStocks = [];

    if(this.state.searchInput.length >= 3) {
      this.state.allStocks.forEach((stock) => {

        if(stock.symbol.toLowerCase().includes(this.state.searchInput) === true || stock.name.toLowerCase().includes(this.state.searchInput) === true) {
            stock.title = `${stock.name} ${stock.symbol}`;
            filteredStocks.push(stock);
        }
      });

      await this.setState({
        searchResults: filteredStocks
      });

      console.log('searchResults in state', this.state.searchResults);
    }
  }

  handleResultSelect = async (event, data) => {
    // take selection stock's symbol from data and pass up to App to pass down into quote component
    console.log(data);
    this.props.handleStockSelection(data.result.symbol);
  }

  render() {
    return (
      <div>
        <Search 
          size='large'
          onSearchChange={this.handleSearchChange}
          onResultSelect={this.handleResultSelect}
          value={this.state.searchInput}
          results={this.state.searchResults}
        />
        <Link to='/'>Home</Link>
      </div>
    );
  }
}

export default Header;
