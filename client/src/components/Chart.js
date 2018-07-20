import React, { Component } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

class Chart extends Component {
  
  componentDidMount = async () => {
    const chartDataResponse = await axios.get(`https://api.iextrading.com/1.0/stock/${this.props.symbol}/chart/5y`);

    const stockData = [];
    chartDataResponse.data.forEach((stock) => {
      stockData.push([Date.parse(stock.date), stock.close]);
    });

    this.options = {
      title: {
        text: 'Ending day price'
      },
      series: [{
        data: stockData
      }],
      rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
              type: 'month',
              count: 1,
              text: '1m'
            }, {
              type: 'month',
              count: 3,
              text: '3m'
            }, {
              type: 'month',
              count: 6,
              text: '6m'
            }, {
              type: 'ytd',
              text: 'YTD'
            }, {
              type: 'year',
              count: 1,
              text: '1y'
            }, {
              type: 'year',
              count: 5,
              text: '5y'
            }]
      },
    }

    this.forceUpdate();
  }

  getOneDayData = () => {
    console.log('1m button clicked');
  };

  render() {
    return (
      <div>
        {this.options && this.options.series[0].data !== null ?
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={this.options}
          />
        :
          null
        }
      </div>
    );
  }
};

export default Chart;
