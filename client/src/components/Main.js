import React, { Component } from 'react'

import MainImage from '../assets/piron-guillaume-367208.jpg';

class Main extends Component {

  renderBackground() {
    return (
      <div>
        <img src={MainImage} alt='No image for you' style={{width: '100%', height: '100%', top: 0, left: 0, opacity: 0.3}} />
      </div>
    );
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        {this.renderBackground()}
        <div style={{ position: 'absolute', top: '300px', left: '150px', fontSize: '50px', fontFamily: 'Amaranth'}}>
          <div className="row">
            Healing your life. Healing your time.
          </div>
        </div>
        <div style={{position: 'absolute', top: '450px', left: '150px'}} >
          <button
            className="btn left red"
          >
            Learn More
            <i className="material-icons right">
              info_outline
            </i>
          </button>
        </div>
      </div>
    )
  }
}

export default Main;
