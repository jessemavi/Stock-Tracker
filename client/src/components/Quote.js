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

    // console.log('props in Quote', this.props);
  }

  componentDidMount = async () => {
    try {
      const followedStockResponse = await axios.post('/bookmarkedStock', {"symbol": this.props.symbol});
      console.log('followedStock', followedStockResponse.data);

      if(followedStockResponse.data.symbol === this.props.symbol) {
        this.setState({
          followingStock: true
        });
      }

      const iexDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.symbol}/quote`);
      const robinhoodDataResponse = await axios.get(`https://api.robinhood.com/quotes/${this.props.symbol}/`);

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
      const followedStock = await axios.post('/bookmarkedStocks/add', {"symbol": this.props.symbol});
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
      const deletedStock = await axios.delete('/bookmarkedStocks/remove', {params: {symbol: this.props.symbol}});
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

    console.log('props before render', this.props);
    return (
      <div>
        <Price 
          symbol={this.props.symbol}
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
            symbol={this.props.symbol} 
            iexQuoteData={this.state.iexQuoteData}
            robinhoodQuoteData={this.state.robinhoodQuoteData}
          /> 
        : 
          null
        }
        
        {this.state.activeItem === 'chart' ? 
          <Chart symbol={this.props.symbol} /> 
        : 
          null
        }

        {this.state.activeItem === 'messages' ? 
          <Messages symbol={this.props.symbol} /> 
        : 
          null
        }
      </div>
    );
  }
}

export default Quote;
