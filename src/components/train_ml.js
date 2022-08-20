import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useState, Fragment } from 'react';
import infoicon from '../assests/images/info_icon.png'
import post_training from "./post_training";
import Button from 'react-bootstrap/Button';

const initialState = {
  splines: 17,
  lambdaval: 5,
  splitpercent: 90,
  bin: 15,
  shuffledata: false
};

export const Test = () => {
  const [state, setState] = useState(initialState)

  const [file, setFile] = useState();
  const [status, setStatus] = useState('---')
  //console.log('state: ', { ...state, status })

  const handleUpload = (event) => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    setFile(data)
  }

  const handleReset = (event) => {
    setState(initialState)
  }


  const handleUploadImage = (event) => {
    console.log('Upload Handler')
    event.preventDefault();

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/parameter`, {
      method: 'POST',
      body: JSON.stringify(state),
    })
      .then((response) => {
        response.json()
          .then((body) => {
            //console.log('Prameter Promise Response: ', body)
          });
      });

    //console.log("File = ",file,  typeof (file))
    //console.log("File = ", file)
    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/upload`, {
      method: 'POST',
      body: file,
    })
      .then((response) => {
        response.json()
          .then((body) => {
            //console.log('Upload Promise Response: ', body)
          });
      });

    let count = 1
    const timerId = setInterval(() => {
      console.log('setInterval', count);
      fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/training_status`)
        .then((res) => {
          res.json()
            .then((statusData) => {
              setStatus(statusData.mstatus);
              console.log("bringing data from backend = ", statusData)
              if (statusData.mstatus === "Done!") {
                setStatus(statusData.mstatus);
                clearInterval(timerId)
              }
            })
        })
    }, 1200);
    console.log('getStatus Counting: ', timerId);
  }

  return (
    <Fragment>
      <body>
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

        <form className="uploader" id='formEle' onSubmit={handleUploadImage}>
          <div className="training_content">
            <div className="file_upload">
              <input type='file' name='file' onChange={handleUpload} required />
              <a href={require("../assests/template.csv")} download="template.csv">Download Sample Template</a>
            </div>

            <div className="range_sliders">
              <div>
                <label id='spline-value'>Number of Splines </label>
                <input
                  htmlFor='spline-value'
                  type="range"
                  min="4"
                  max="90"
                  value={state.splines}
                  onChange={(e) => setState({ ...state, 'splines': e.target.value })}
                />
                {state.splines}
                {<img className="infoicon" src={infoicon} title="Greater number of splines will have more bendings/curves(complexity) in the smooth functions and vice versa." />}
              </div>

              <div>
                <lable id='lamda-value'>Lambda Value  </lable>
                <input
                  htmlFor='lamda-value'
                  type="range"
                  min="3"
                  max="20"
                  value={state.lambdaval}
                  onChange={(e) => setState({ ...state, 'lambdaval': e.target.value })}
                />
                {state.lambdaval}
                {<img className="infoicon" src={infoicon} title="Balance the lambda value. The greater the value, the better will be the training but may lead to overfitting." />}
              </div>

              <div>
                <lable id='split-value'>(Training-Testing Data Split) Training % </lable>
                <input
                  htmlFor='split-value'
                  type="range"
                  min="50"
                  max="95"
                  value={state.splitpercent}
                  onChange={(e) => setState({ ...state, 'splitpercent': e.target.value })}
                />
                {state.splitpercent}
                {<img className="infoicon" src={infoicon} title="Please set training data % . Testing data % will be (100% - training%) " />}
              </div>

              <div>
                <lable id='bin-value'>Bins size for histogram </lable>
                <input
                  htmlFor='bin-value'
                  type="range"
                  min="2"
                  max="100"
                  value={state.bin}
                  onChange={(e) => setState({ ...state, 'bin': e.target.value })}
                />
                {state.bin}
                {<img className="infoicon" src={infoicon} title="The towers or bars of a histogram are called bins. The greater the size of the bin, the more data division will be." />}
              </div>

              <div>
                <lable className="shufflecheckbox" >Shuffle Data </lable>
                <input
                  type="checkbox"
                  name="isChecked"
                  onChange={(e) => setState({ ...state, 'shuffledata': e.target.checked })}
                />
                {<img className="infoicon" src={infoicon} title="If checked, it will shuffle all the data before training." />}
              </div>
            </div>

            <br />
            <div className="upload button">
              <Button variant="primary" size="md" type='submit'>Upload</Button>
              <button type='reset' onClick={handleReset}>Reset values</button>
            </div>
            <div className="training_status">
              <p>Training Status : {status}</p>
            </div>
          </div>
        </form>

      </div>
      </body>
    </Fragment>
  )
}
export default Test;