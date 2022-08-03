import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import post_training from "./post_training";
import {Route, Routes} from "react-router-dom"

export default class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }
  handleUploadImage(ev) {
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