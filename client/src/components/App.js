import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Quote from './Quote';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/quote/:symbol' component={Quote} />
        </div>
      </Router>
    );
  }
}

export default App;
