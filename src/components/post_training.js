import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';

export default function () {
  // usestate for setting a javascript
  // object for storing and using data

  const [formFields, setFormFields] = useState([]);
  const [formFields2, setFormFields2] = useState([]);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(() => {
    (async () => {
      await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/results_update`).then((res) =>
        res.json().then((graph_data) => {
          //console.log('data getting from backend = ', graph_data);

          for (var key in graph_data) {
            var arr = graph_data[key];
            //console.log("arr = ", arr);
            setFormFields(
              Array.from(arr)
            );
          }

        })
      );
    })();
  },[]);

  useEffect(() => {
    (async () => {
      await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/smooth_func_data`).then((res) =>
        res.json().then((graph_data) => {
          //console.log('data getting from backend = ', graph_data);

          for (var key in graph_data) {
            var arr = graph_data[key];
            console.log("smooth function data getting arr = ", arr);
            setFormFields2(
              Array.from(arr)
            );
          }

        })
      );
    })();
  },[]);



  return (
    <>
      <body>
        <div className="disp_results">
          <h1 className="page-header">Training Result</h1>
          {formFields.map((form, index) => {
            return (
              <div key={index}>
                <Plot
                  data={[
                    {
                      name: form.name.slice(0, 8) + " Data Points",
                      text: "R-Squared Value = ",
                      textposition: "top left",
                      x: form.xaxis,
                      y: form.yaxis,
                      type: 'scatter',
                      mode: 'markers',
                      marker: { color: 'red' },
                    },
                    { type: 'line', x: form.xaxis2, y: form.yaxis2, name: "Best fit" },
                  ]}
                  layout={{ width: 720, height: 480, title: form.name }}
                />
              </div>

            )
          })}
        </div>

        <div className="disp_results">
          <h1 className="page-header">Smooth Functions</h1>
          {formFields2.map((form, index) => {
            return (
              <div key={index}>
                <Plot
                  data={[
                    {
                      name: "Smooth Function",
                      x: form.xaxis,
                      y: form.yaxis1,
                      type: 'line',
                      mode: 'lines',
                      marker: { color: 'blue' },
                    },{
                      x: form.xaxis,
                      y: form.lower_confidence,
                      type: 'line',
                      mode: 'lines',
                      line: {
                        dash: 'dash'
                      },
                      marker: { color: 'red' },
                    },{
                      x: form.xaxis,
                      y: form.upper_confidence,
                      type: "line",
                      mode: "lines",
                      line: {
                        dash: 'dash'
                      },
                      marker: { color: 'red' },
                    },
                    
                  ]}
                  layout={{ width: 720, height: 480 }}
                />
              </div>

            )
          })}
        </div>
        
      </body>

    </>
  )
}