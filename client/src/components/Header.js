import React, { Component } from 'react';
import { Search } from 'semantic-ui-react'

class Header extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <Search />
      </div>
    );
  }
}

export default Header;
