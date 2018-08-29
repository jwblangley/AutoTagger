import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const config = require('./config')

const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: config.CLARIFAI_KEY()
});


function clarifaiPredict(src, resFunc) {
  var conceptJSON;
  app.models.predict(Clarifai.GENERAL_MODEL, src).then(
    function(response) {
      resFunc(response.outputs[0].data.concepts);
    },
    function(err) {
      console.log(err);
    }
  );
  return conceptJSON;
}

function conceptsToArray(concepts) {
  var conArr = [];
  for (var i = 0; i < concepts.length; i++) {
    conArr[i] = concepts[i].name;
  }
  return conArr;
}

function checkURL(imageURL) {
    return(imageURL.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function processImage(src) {
  clarifaiPredict(src, (res) => console.log(conceptsToArray(res)));
}


// ==================================

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc:null
    };
    this.updateImage = this.updateImage.bind(this);
  }

  updateImage(src) {
    this.setState({imageSrc:src});
  }

  render() {
    return (
      <div className="app">
        <div className="appHeader">
          <h1 id="title">Auto-tagger</h1>
          <ImageSelector imageUpdater={this.updateImage}/>
        </div>
        <div className="imagePreview">
          <img src={this.state.imageSrc}></img>
        </div>
      </div>
    );
  }
}

class ImageSelector extends React.Component {
  render() {
    return (
      <div className="ImageSelector">
        <ImageFile header = "Choose an Image"
          imageUpdater={this.props.imageUpdater}/>
        <ImageURL header = "Enter an Image URL"
          imageUpdater={this.props.imageUpdater}/>
      </div>
    );
  }
}

class ImageFile extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.fileInput = React.createRef();
  }

  handleSelect(e) {
    console.log("here");
    var fr = new FileReader();
    fr.addEventListener("load", function(e) {
      this.props.imageUpdater(e.target.result);
      var b64 = e.target.result.split(',')[1];
      processImage({base64:b64});
    }.bind(this));

    fr.readAsDataURL(this.fileInput.current.files[0]);

    e.preventDefault();
  }

  render() {
    return (
      <span>
        <h2 className="menuHeading">{this.props.header}</h2>
        <input type='file' onChange={this.handleSelect} ref={this.fileInput}></input>
      </span>
    );
  }
}

class ImageURL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleSubmit(e) {
    var imageURL = this.state.value;
    if (checkURL(imageURL)){
      this.props.imageUpdater(this.state.value);
      processImage(imageURL);
    }
    e.preventDefault();
  }

  render() {
    return (
      <span>
      <h2 className="menuHeading">{this.props.header}</h2>
        <form onSubmit={this.handleSubmit} style={{display:"inline-block"}}>
          <input type="text" value={this.state.value} onChange={this.handleChange}></input>
          <input type="submit" style={{display:"none"}}></input>
        </form>
      </span>
    );
  }
}

// ==================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// document.getElementById("inp").addEventListener("change", readFile);
