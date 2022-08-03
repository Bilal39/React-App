import React, { useState, useEffect } from "react";
//import training_plot from '../../backend/results/training_plot.png';
//import training_plot from '../assests/images/training_plot.png';
//import testing_plot from '../assests/images/testing_plot.png';
//import histogram from '../assests/images/histogram.png';

export default function () {
  // usestate for setting a javascript
    // object for storing and using data
    const [data, setdata] = useState({
  });
    const [show,setShow] = useState(true);



  // Using useEffect for single rendering
  useEffect(() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      fetch("/results_update").then((res) =>
          res.json().then((data) => {
              // Setting a data from api
              setdata({
                trained_r:data.training_r_squared_value,
                tested_r:data.testing_r_squared_value
              });
          })
      );
  }, []);
  
  return (
    <>
        <div className="disp_results">
                <h1 className="result heading">Results</h1>
                <p>Training R-Squared Value = {data.trained_r}</p>
                <p>Testing R-Squared Value = {data.tested_r}</p>
                
                {show && <img src={require('../assests/images/training_plot.png')}   />}
                {show && <img src={require('../assests/images/testing_plot.png')}   />}
                {show && <img src={require('../assests/images/histogram.png')} alt="*Please upload a data file and train the model."  />}
            
                <button type ="button" onClick={() => setShow(!show)}>
                  {show=== true ? 'Hide Plots':'Show Plots'}
                </button>
                
        </div>
        
    </>
  )
}







const [outputdata, setdata] = useState({
});
  const [show,setShow] = useState(true);



// Using useEffect for single rendering
useEffect(() => {
    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    fetch("/outputval").then((res) =>
        res.json().then((outputdata) => {
            // Setting a data from api
            setdata({
              output_value:outputdata.output_prediction
            });
        })
    );
}, []);