import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import PolynomialRegression from 'ml-regression-polynomial';
import Plot from 'react-plotly.js';

export default function () {
  // usestate for setting a javascript
  // object for storing and using data
  const [data, setdata] = useState({
  });
  const [show, setShow] = useState(true);

  const [disp, setDisp] = useState(false);

  const x = [50, 50, 50, 70, 70, 70, 80, 80, 80, 90, 90, 90, 100, 100, 100];
  const y = [3.3, 2.8, 2.9, 2.3, 2.6, 2.1, 2.5, 2.9, 2.4, 3.0, 3.1, 2.8, 3.3, 3.5, 3.0];
  const degree = 5; // setup the maximum degree of the polynomial

  const regression = new PolynomialRegression(x, y, degree);
  console.log("typeif regression is = ", typeof regression)
  console.log(regression)


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
          <Plot
            data={[
              {
                x: x,
                y: y,
                type: "scatter",
                mode: "number",
                marker: { color: 'red' },
              },
              {type: "line", x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={{ width: 640, height: 480, title: 'A Fancy Plot' }} />

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
      </body>

    </>
  )
}