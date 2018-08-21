import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Quote from './Quote';

class App extends Component {
  constructor() {
    super();
    this.state = {
      quote: ''
    };
  }

  handleStockSelection = (symbol) => {
    this.setState({quote: symbol});
  }

  render() {
    const path = "/quote/".concat(this.state.quote)
    return (
      <Router>
        <div>
          {this.state.quote !== '' ?
            <Redirect to={path} />
          :
            null
          }
          <Header handleStockSelection={this.handleStockSelection} />
          <Route exact path='/' component={Home} />
          <Route path={path} component={() => <Quote symbol={this.state.quote} />} />
        </div>
      </Router>
    );
  }
}

export default App;
