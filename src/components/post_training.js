import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

export default function () {
  // usestate for setting a javascript
  // object for storing and using data
  const [data, setdata] = useState({
  });
  const [show, setShow] = useState(true);

  const [disp, setDisp] = useState(false);




  // Using useEffect for single rendering
  useEffect(() => {
    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/results_update`).then((res) =>
      res.json().then((data) => {
        // Setting a data from api
        setdata({
          trained_r: data.training_r_squared_value,
          tested_r: data.testing_r_squared_value
        });
      })
    );
  }, []);

  return (
    <>
      <body>
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


            {show && <img src={require('../assests/plots/training_plot.png')} />}
            {show && <img src={require('../assests/plots/testing_plot.png')} />}
            {show && <img src={require('../assests/plots/histogram.png')} alt="*Please upload a data file and train the model." />}

            <div className="smoothfunctions">
              <Button variant="primary" size="md" type="button" onClick={() => setDisp(!disp)}>
                {disp === true ? 'Hide Smooth Functions' : 'Show Smooth Functions'}
              </Button>
              {disp && <img src={require('../assests/plots/smooth_func.png')} />}

            </div>
          </div>


        </div>
      </body>

    </>
  )
}