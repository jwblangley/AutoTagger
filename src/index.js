import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const config = require('./config');
const colorTools = require('./colorTools');

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
    return(imageURL.match(/\.(jpeg|jpg|png)$/) != null);
}

function processImage(src, tagFunc) {
  clarifaiPredict(src,
    (APIres) => {
      tagFunc(conceptsToArray(APIres), false);
    }
  );
}


// ==================================

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc:null,
      tags: [],
      tagCols: [[0,0,0]]
    };
    this.updateImage = this.updateImage.bind(this);
    this.updateTags = this.updateTags.bind(this);
  }

  updateImage(src) {
    //TODO generate the right number of colors
    colorTools.generateColors(src, 5, (cs) => this.setState({tagCols:cs}));
    this.setState({imageSrc:src});
  }

  updateTags(newTags, append) {
    if (!append) {
      this.setState({tags:newTags})
    }else {
      var oldTags = this.state.tags.slice();
      this.setState({tags: oldTags.concat(newTags)})
    }
  }

  render() {
    return (
      <div className="app">
        <div className="appHeader">
          <h1 id="title">Auto-tagger</h1>
          <ImageSelector
            imageUpdater={this.updateImage}
            tagUpdater={this.updateTags}/>
        </div>
        <div className="imagePreview">
          <img src={this.state.imageSrc}></img>
        </div>
        <TagPanel tags={this.state.tags} cols={this.state.tagCols}/>
      </div>
    );
  }
}

class ImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputChild = React.createRef();
    this.resetFileInputVal = this.resetFileInputVal.bind(this);
  }

  resetFileInputVal() {
    this.fileInputChild.current.resetFileInputVal();
  }

  render() {
    return (
      <div className="ImageSelector">
        <ImageFile header = "Choose an Image"
          imageUpdater={this.props.imageUpdater}
          tagUpdater={this.props.tagUpdater}
          ref={this.fileInputChild}/>
        <ImageURL header = "Enter an Image URL"
          imageUpdater={this.props.imageUpdater}
          tagUpdater={this.props.tagUpdater}
          fileInputResetter={this.resetFileInputVal}/>
      </div>
    );
  }
}

class ImageFile extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.resetFileInputVal = this.resetFileInputVal.bind(this);
    this.fileInput = React.createRef();
  }

  resetFileInputVal() {
    this.fileInput.current.value = null;
  }

  handleSelect(e) {
    if (this.fileInput.current.files && this.fileInput.current.files[0]){
      var fr = new FileReader();
      fr.addEventListener("load", function(e) {
        this.props.imageUpdater(e.target.result);
        var b64 = e.target.result.split(',')[1];
        processImage({base64:b64}, this.props.tagUpdater);
      }.bind(this));

      fr.readAsDataURL(this.fileInput.current.files[0]);
    } else {
      console.log("No Image Selected");
    }
    e.preventDefault();
  }

  render() {
    return (
      <span>
        <h2 className="menuHeading">{this.props.header}</h2>
        <input
          type='file'
          onChange={this.handleSelect}
          ref={this.fileInput}></input>
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
      this.props.fileInputResetter();
      this.props.imageUpdater(this.state.value + '?' + new Date().getTime());
      processImage(imageURL, this.props.tagUpdater);
    }
    e.preventDefault();
  }

  render() {
    return (
      <span>
      <h2 className="menuHeading">{this.props.header}</h2>
        <form onSubmit={this.handleSubmit} style={{display:"inline-block"}}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}>
          </input>
          <input
            type="submit"
            style={{display:"none"}}>
          </input>
        </form>
      </span>
    );
  }
}

class TagPanel extends React.Component {

  render() {
    return (
      <div className="tagPanel">
        <h2 style={{textAlign:'center'}}>Tags</h2>
        {this.props.tags.map(
          (tag, i) => <Tag
            name={tag}
            key={i}
            col={this.props.cols[i % this.props.cols.length]}
          />
        )}
      </div>
    );
  }
}

class Tag extends React.Component {
  render() {
    var tagName = this.props.name.replace(" ", "");
    return (
      <a href={"https://www.instagram.com/explore/tags/" + tagName}
        target="_blank"
        style={{color:
          'rgb(' + this.props.col[0] + ','
          + this.props.col[1] + ','
          + this.props.col[2] + ')'
        }}>
        <h3>#{tagName}</h3>
      </a>
    );
  }
}

// ==================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
