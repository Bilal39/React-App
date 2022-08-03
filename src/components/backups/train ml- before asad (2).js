import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import post_training from "./post_training";
import {Route, Routes} from "react-router-dom";


export default class Test extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      splines:'17',
      lambdaval:'5',
      splitpercent:'90',
      bin:'15'
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
  handleSplitChange = (event) => {
    this.setState({
      splitpercent:event.target.value
    })
  }
  handleBinsChange = (event) => {
    this.setState({
      bin:event.target.value
    })
  }
  
  handleUploadImage(ev) {

    ev.preventDefault();
    const paradata = {'splines':this.state.splines, 'lambdaval':this.state.lambdaval, 'splitpercent':this.state.splitpercent, 'bin':this.state.bin }
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
      <>
      <div className="background-Image">
      <h1 className="page-header">Model Training</h1>
      
      <div className="left">
          <h6>Instructions:</h6>
          <p>1. Upload a 'CSV' fromat file.</p>
          <p>2. There can be any number of input columns but should have only 'one' output column.</p>
          <p>3. Make sure the output column is the right-most (last) column of the CSV file.</p>
          <p>4. File should have only 'one' header row.</p>
          <p>5. There should be 'no' serial number column in the file.</p>
      </div>

      <form className="uploader" onSubmit={this.handleUploadImage}>
        <div className="training_content">
          <div className="file_upload">
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
          </div>

          <div className="range_sliders">
            <div>
              <label>Number of Splines </label>
              <input type="range" min="4" max="50" value={this.state.splines} defaultValue={this.state.splines} onChange = {this.handleSplineChange}/>
              {this.state.splines}
            </div>

            <div>
              <lable>Lambda Value  </lable>
              <input type="range" min="3" max="10" value = {this.state.lambdaval} defaultValue={this.state.lambdaval}  onChange = {this.handleLamdaChange}/>
              {this.state.lambdaval}
            </div>

            <div>
              <lable>(Training-Testing Data Split) Training % </lable>
              <input type="range" min="50" max="100" value = {this.state.splitpercent} defaultValue={this.state.splitpercent} onChange = {this.handleSplitChange}/>
              {this.state.splitpercent}
            </div>

            <div>
              <lable>Bins number for histogram </lable>
              <input type="range" min="2" max="100" value = {this.state.bin} defaultValue={this.state.bin} onChange = {this.handleBinsChange}/>
              {this.state.bin}
            </div>

          </div>

          <br />
            <div className="upload button">
              <button>Upload</button>
            </div>

        </div>
        
          
      </form>
      </div>
      </>
    );
   }
  }