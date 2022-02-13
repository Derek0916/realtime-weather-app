import React, { Component } from 'react';

class Message extends Component {
  state = {
    text: 'Hello1',
  };
  sayHi = () => {
    this.setState({
      text: 'Hi',
    });
  };
  render() {
    return (
      <div>
        <h3>{this.state.text}</h3>
        <button onClick={this.sayHi}>Say HI</button>
      </div>
    );
  }
}

export default Message;
