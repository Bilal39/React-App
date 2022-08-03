import React, { useState, useEffect } from "react";

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
export default function () {
  // usestate for setting a javascript
    // object for storing and using data
    const [data, setdata] = useState({
  });

  // Using useEffect for single rendering
  useEffect(() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      fetch("/data").then((res) =>
          res.json().then((data) => {
              // Setting a data from api
              setdata({
                "training_r_squared_value":data.training_r_squared_value,
                "testing_r_squared_value":data.testing_r_squared_value
              });
          })
      );
  }, []);
  render() {
    return (
      <>
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <br />
        <div>
          <button>Upload</button>
        </div>
      </form>
      <div className="App">
                <h1>Data From Flask</h1>
                {/* Calling a data from setdata for showing */}
                <p>{data.training_r_squared_value}</p>
                <p>{data.testing_r_squared_value}</p>


        </div>

      </>
    );
  }
}