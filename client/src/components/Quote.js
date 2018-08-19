import React, { Component } from 'react';
import axios from 'axios';
import Price from './Price';
import Summary from './Summary';
import Chart from './Chart';
import Messages from './Messages';
import { Menu } from 'semantic-ui-react';

class Quote extends Component {
  constructor(props) {
    super();
    this.state = {
      iexQuoteData: {},
      robinhoodQuoteData: {},
      followingStock: false,
      activeItem: 'summary'
    };
  }

  componentDidMount = async () => {
    try {
      const followedStocks = await axios.post('/stocks');
      console.log('followedStocks', followedStocks.data);

      followedStocks.data.forEach((stock) => {
        if(stock.symbol === this.props.match.params.symbol) {
          this.setState({
            followingStock: true
          });
        }
      });

      const iexDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.match.params.symbol}/quote`);
      const robinhoodDataResponse = await axios.get(`https://api.robinhood.com/quotes/${this.props.match.params.symbol}/`);

      this.setState({
        iexQuoteData: iexDataResponse.data,
        robinhoodQuoteData: robinhoodDataResponse.data
      });

      console.log('state in Quote component', this.state);
    } catch(err) {
      console.log(err);
      return;
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  followStock = async () => {
    try {
      const followedStock = await axios.post('/stocks/add', {"symbol": this.props.match.params.symbol});
      console.log('followedStock', followedStock);
      if(followedStock.status === 201) {
        this.setState({
          followingStock: true
        });
      }
    } catch(err) {
      console.log(err);
      return;
    }
  }

  unfollowStock = async () => {
    try {
      const deletedStock = await axios.delete('/stocks/remove', {params: {symbol: this.props.match.params.symbol}});
      console.log('deletedStock', deletedStock);
      if(deletedStock.status === 204) {
        this.setState({
          followingStock: false
        });
      }
    } catch(err) {
      console.log(err);
      return;
    }
  }

  render() {
    return (
      <div>
        <Price 
          symbol={this.props.match.params.symbol}
          followingStock={this.state.followingStock}
          iexQuoteData={this.state.iexQuoteData}
          robinhoodQuoteData={this.state.robinhoodQuoteData}
          followStock={this.followStock}
          unfollowStock={this.unfollowStock}
        />

        <Menu secondary color={'blue'}>
          <Menu.Item 
            name='summary' 
            active={this.state.activeItem === 'summary'} 
            onClick={this.handleItemClick}
          ></Menu.Item>

          <Menu.Item 
            name='chart' 
            active={this.state.activeItem === 'chart'} 
            onClick={this.handleItemClick}
          ></Menu.Item>

          <Menu.Item 
            name='messages' 
            active={this.state.activeItem === 'messages'} 
            onClick={this.handleItemClick}
          ></Menu.Item>
        </Menu>

        {this.state.activeItem === 'summary' ? 
          <Summary 
            symbol={this.props.match.params.symbol} 
            iexQuoteData={this.state.iexQuoteData}
            robinhoodQuoteData={this.state.robinhoodQuoteData}
          /> 
        : 
          null
        }
        
        {this.state.activeItem === 'chart' ? 
          <Chart symbol={this.props.match.params.symbol} /> 
        : 
          null
        }

        {this.state.activeItem === 'messages' ? 
          <Messages symbol={this.props.match.params.symbol} /> 
        : 
          null
        }
      </div>
    );
  }
}

export default Quote;
