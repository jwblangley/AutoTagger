import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const config = require('./config')


// Clarifai header
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





// ==================================

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc:null
    };
  }

  updateImage(src) {
    this.setState({imageSrc:src});
  }

  render() {
    return (
      <div className="app">
        <h1 id="title">Auto-tagger</h1>
        <ImageSelector imageUpdater={this.updateImage}/>
        <img id="img" src={this.state.imageSrc}></img>
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
  render() {
    return (
      <span>
        <h2 className="menuHead">{this.props.header}</h2>
        <input type='file' onChange={()=>this.props.imageUpdater()}></input>
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
    // TODO
    e.preventDefault();
  }

  render() {
    return (
      <span>
      <h2 className="menuHead">{this.props.header}</h2>
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



function readFile() {

  if (this.files && this.files[0]) {

    var FR= new FileReader();

    FR.addEventListener("load", function(e) {
      document.getElementById("img").src       = e.target.result;
      var b64 = e.target.result.split(',')[1];
      var res = clarifaiPredict(
        {base64:b64},
        (res) => {console.log(conceptsToArray(res))}
      );
      console.log(res);
    });

    FR.readAsDataURL( this.files[0] );
  }

}

// document.getElementById("inp").addEventListener("change", readFile);
