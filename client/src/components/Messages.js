import React, { Component } from 'react';
import axios from 'axios';
import Message from './Message';

class Messages extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount = async () => {
    try {
      const stockTwitsResponse = await axios.get(`https://api.stocktwits.com/api/2/streams/symbol/${this.props.symbol}.json`);

      this.setState({
        messages: stockTwitsResponse.data.messages
      });

      console.log(this.state.messages);
    } catch(err) {
      console.log(err);
      return;
    }
  }

  render() {
    return (
      <div>
        <h3>Messages</h3>
        {this.state.messages.map((message, index) => {
          return (
            <Message
              key={index}
              avatar={message.user.avatar_url}
              username={message.user.username}
              created_at={message.created_at}
              body={message.body}
            />
          );
        })}
      </div>
    );
  }
}

export default Messages