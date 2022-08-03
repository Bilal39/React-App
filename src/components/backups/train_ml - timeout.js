import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import post_training from "./post_training";
import { Route, Routes } from "react-router-dom";
import infoicon from '../assests/images/info_icon.png'


export default class Test extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      splines: '17',
      lambdaval: '5',
      splitpercent: '90',
      bin: '15',
      status: "----",
      timer: "timer"
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }


  handleSplineChange = (event) => {
    this.setState({
      splines: event.target.value
    })
  }
  handleLamdaChange = (event) => {
    this.setState({
      lambdaval: event.target.value
    })
  }
  handleSplitChange = (event) => {
    this.setState({
      splitpercent: event.target.value
    })
  }
  handleBinsChange = (event) => {
    this.setState({
      bin: event.target.value
    })
  }

  handleUploadImage(ev) {

    ev.preventDefault();
    const paradata = { 'splines': this.state.splines, 'lambdaval': this.state.lambdaval, 'splitpercent': this.state.splitpercent, 'bin': this.state.bin }
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

    //fetch("/training_status").then((res) =>
    //  res.json().then((statusdata) => {
    //    console.log("bringing data from backend = ", statusdata)
    //    // Setting a data from api
    //    this.setState({ status: statusdata.mstatus });
    //  })
    //);
    setTimeout(() => {
      console.log("Zero Timeout");
      fetch("/training_status").then((res) =>
        res.json().then((statusdata) => {
          console.log("bringing data from backend = ", statusdata)
          // Setting a data from api
          this.setState({ status: statusdata.mstatus });
        })
      );
    }, 300);

    setTimeout(() => {
      console.log("First Timeout");
      fetch("/training_status").then((res) =>
        res.json().then((statusdata) => {
          console.log("bringing data from backend = ", statusdata)
          // Setting a data from api
          this.setState({ status: statusdata.mstatus });
        })
      );
    }, 16000);

    setTimeout(() => {
      console.log("Second Timeout");
      fetch("/training_status").then((res) =>
        res.json().then((statusdata) => {
          console.log("bringing data from backend = ", statusdata)
          // Setting a data from api
          this.setState({ status: statusdata.mstatus });
        })
      );
    }, 30000);

    setTimeout(() => {
      console.log("Third Timeout");
      fetch("/training_status").then((res) =>
        res.json().then((statusdata) => {
          console.log("bringing data from backend = ", statusdata)
          // Setting a data from api
          this.setState({ status: statusdata.mstatus });
        })
      );
    }, 60000);

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
            <p>6. After selecting your file and setting parameters, click on the "upload" button.</p>
            <p>7. Training status "in progress.." means the model is being trained.</p>
            <p>8. On completion of model training, the status will change to "Done!" after which you can see the results at "Result" tab.</p>
          </div>

          <form className="uploader" onSubmit={this.handleUploadImage}>
            <div className="training_content">
              <div className="file_upload">
                <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
              </div>

              <div className="range_sliders">
                <div>
                  <label>Number of Splines </label>
                  <input type="range" min="4" max="50" value={this.state.splines} defaultValue={this.state.splines} onChange={this.handleSplineChange} />
                  {this.state.splines}
                  <img className="infoicon" src={infoicon} title="Greater number of splines will have more bendings/curves in the smooth functions and vice versa."/>
                </div>

                <div>
                  <lable>Lambda Value  </lable>
                  <input type="range" min="3" max="10" value={this.state.lambdaval} defaultValue={this.state.lambdaval} onChange={this.handleLamdaChange} />
                  {this.state.lambdaval}
                  <img className="infoicon" src={infoicon} title="Balance the lambda value. The greater the value, the better will be the training but may lead to overfitting."/>
                </div>

                <div>
                  <lable>(Training-Testing Data Split) Training % </lable>
                  <input type="range" min="50" max="95" value={this.state.splitpercent} defaultValue={this.state.splitpercent} onChange={this.handleSplitChange} />
                  {this.state.splitpercent}
                  <img className="infoicon" src={infoicon} title="Please set training data % . Testing data % will be (100% - training%) "/>
                </div>

                <div>
                  <lable>Bins size for histogram </lable>
                  <input type="range" min="2" max="100" value={this.state.bin} defaultValue={this.state.bin} onChange={this.handleBinsChange} />
                  {this.state.bin}
                  <img className="infoicon" src={infoicon} title="The towers or bars of a histogram are called bins. The greater the size of the bin, the more data division will be."/>
                   
                </div>

              </div>

              <br />
              <div className="upload button">
                <button>Upload</button>
              </div>

              <div className="training_status">
                <p>Training Status : {this.state.status}</p>
              </div>

            </div>


          </form>
        </div>
      </>
    );
  }
}