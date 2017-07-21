import React, { Component } from 'react';
import './App.css';

import EmojifyImage from './EmojifyImage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { scale: 15 };
  }

  render() {
    return (
      <div className="App">
        <div className="input-container">
          <input type="file" accept="image/*" onChange={(e) => {
            const [ file ] = e.currentTarget.files;
            if (!file) return;

            createImageBitmap(file).then(ibm => {
              this.setState({ image: ibm });
            });
          }} />
          <div className="scale-container">
            { 'Scale (px): ' }
            <input type="range" min="3" max="25" step="1" value={this.state.scale} onChange={(e) => { this.setState({ scale: Number(e.currentTarget.value) }) }}/>
            { this.state.scale }
          </div>
        </div>
        { this.state.image && <EmojifyImage scale={this.state.scale} image={this.state.image}/> }
      </div>
    );
  }
}

export default App;
