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
      activeItem: 'summary'
    };
  }

  componentDidMount = async () => {
    try {
      const iexDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.match.params.symbol}/quote`);
      const robinhoodDataResponse = await axios.get(`https://api.robinhood.com/quotes/${this.props.match.params.symbol}/`);

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

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    return (
      <div>
        <Price 
          symbol={this.props.match.params.symbol} 
          iexQuoteData={this.state.iexQuoteData}
          robinhoodQuoteData={this.state.robinhoodQuoteData}
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
