import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

export default function (props) {
  // usestate for setting a javascript
  // object for storing and using data
  //console.log(props)
  const { data, setData } = props.value
  console.log("yehin se print ho rha hai", data)

  //const [data, setData] = useState({
  //});
  const [show, setShow] = useState(true);

  const [disp, setDisp] = useState(false);

  //setTimeout(() => {
  //  console.log("Timeout testing")
  //}, 5000);


  // Using useEffect for single rendering
  //useEffect(() => {
  //  console.log("flag data",data.flag)
  //  // Using fetch to fetch the api from 
  //  // flask server it will be redirected to proxy
  //  if (data.flag === false) {
  //    setInterval(() => {
  //      console.log("Timeout testing")
  //      fetch("/results_update").then((res) =>
  //        res.json().then((data) => {
  //          // Setting a data from api
  //          setData({
  //            trained_r: data.training_r_squared_value,
  //            tested_r: data.testing_r_squared_value,
  //            mstatus: data.mstatus,
  //            flag: true
  //          });
  //        })
  //      );
  //    }, 10000);
  //  }
//
  //  console.log("After useeffect")
  //}, []);

  return (
    <>
      <div className="disp_results">
        <h1 className="page-header">Training Result</h1>

        <div className="training_results">
          <p>Training R-Squared Value = {data.trained_r}</p>
          <p>Testing R-Squared Value = {data.tested_r}</p>

        </div>

        <div className="trainingresults">
          <div>
            <Button variant="primary" size="md" type="button" onClick={() => setShow(!show)}>
              {show === true ? 'Hide Training-Testing Plots' : 'Show Training-Testing Plots'}
            </Button>
          </div>


          {show && <img src={require('../assests/images/training_plot.png')} />}
          {show && <img src={require('../assests/images/testing_plot.png')} />}
          {show && <img src={require('../assests/images/histogram.png')} alt="*Please upload a data file and train the model." />}

          <div className="smoothfunctions">
            <Button variant="primary" size="md" type="button" onClick={() => setDisp(!disp)}>
              {disp === true ? 'Hide Smooth Functions' : 'Show Smooth Functions'}
            </Button>
            {disp && <img src={require('../assests/images/smooth_func.png')} />}

          </div>
        </div>


      </div>

    </>
  )
}