import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div
        className="home-page"
      >
        <h1>
          Welcome to Colors 
          <br/>
          for Hue!
        </h1>
        <img src="/images/computer.jpg"/>
      </div>
    )
  }
}

export default Home;