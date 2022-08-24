import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import anychart from 'anychart-react';
import chart from 'anychart-react';
import AnyChart from 'anychart-react';

export default function () {
  // usestate for setting a javascript
  // object for storing and using data
  const [data, setdata] = useState({
  });
  const [formFields, setFormFields] = useState([]);
  const [count1, setCount1] = useState(0);
  const [traindata, settraindata] = useState(0);
  const scatterData = [
    ['Age', 'Weight'],
    [8, 12],
    [4, 5.5],
    [11, 14],
    [4, 5],
    [3, 3.5],
    [6.5, 7],
  ]

  useEffect(() => {
    (async () => {
      await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/results_update`).then((res) =>
        res.json().then((graph_data) => {
          //console.log('data getting from backend = ', graph_data);

          for (var key in graph_data) {
            var arr = graph_data[key];
            settraindata()
            //console.log("arr = ", arr);
            setFormFields(
              Array.from(arr)
            );
          }

        })
      );
    })();
  }, [count1]);

  let data3 = [...formFields];
  console.log("data3 = ", data3)


  // Using useEffect for single rendering
  //useEffect(() => {
  //  // Using fetch to fetch the api from 
  //  // flask server it will be redirected to proxy
  //  fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/results_update`).then((res) =>
  //    res.json().then((data) => {
  //      // Setting a data from api
  //      setdata({
  //        trained_r: data.training_r_squared_value,
  //        tested_r: data.testing_r_squared_value
  //      });
  //    })
  //  );
  //}, []);

  return (
    <>
      <body>
        <div className="disp_results">
          <h1 className="page-header">Training Result</h1>
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script>
          <canvas id="scatter"></canvas>
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
      </body>

    </>
  )
}