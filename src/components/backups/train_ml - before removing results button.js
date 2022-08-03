import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import post_training from "./post_training";
import {Route, Routes} from "react-router-dom";


export default class Test extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      splines:'',
      lambdaval:''
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }
  

  handleSplineChange = (event) => {
    this.setState({
      splines:event.target.value
    })
  }
  handleLamdaChange = (event) => {
    this.setState({
      lambdaval:event.target.value
    })
  }
  
  
  handleUploadImage(ev) {

    ev.preventDefault();
    const paradata = {'splines':this.state.splines, 'lambdaval':this.state.lambdaval }
    console.log(paradata)
    fetch('http://localhost:5000/parameter', {
      method: 'POST',
      body: JSON.stringify(paradata),
    }).then((response) => {
      response.json().then((body) => {
      });
    });

    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
      });
    });
    
  }
  
  render() {
    return (
      <form className="uploader" onSubmit={this.handleUploadImage}>
        <div className="file_upload">
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <div className="range_sliders">
        <div>
          <label>Number of Splines </label>
          <input type="range" min="4" max="50" value={this.state.splines} onChange = {this.handleSplineChange}/>
          {this.state.splines}
        </div>
        <div>
          <lable>Lambda Value  </lable>
          <input type="range" min="3" max="10" value = {this.state.lambdaval} onChange = {this.handleLamdaChange}/>
          {this.state.lambdaval}
        </div>
      </div>
        
        <br />
          <div className="upload button">
          <button>Upload</button>
          </div>
          
          <div className="button-link">
          <Link to="/post_training" className="btn btn-primary">Results</Link>
          </div>
        
      </form>
    );
   }
  }