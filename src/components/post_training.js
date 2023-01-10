import { findByPlaceholderText } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import Button from 'react-bootstrap/Button';

export default function () {
  // usestate for setting a javascript
  // object for storing and using data

  const [formFields, setFormFields] = useState([]);
  const [formFields2, setFormFields2] = useState([]);
  const [formFields4, setFormFields4] = useState([]);
  const [disp, setDisp] = useState(false);

  useEffect(() => {
    (async () => {
      await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/results_update`).then((res) =>
        res.json().then((graph_data) => {
          //console.log('data getting from backend = ', graph_data);

          for (var key in graph_data) {
            var arr = graph_data[key];
            //console.log("training testing data arr = ", arr);
            setFormFields(
              Array.from(arr)
            );
          }
        })
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/smooth_func_data`).then((res) =>
        res.json().then((graph_data) => {
          //console.log('data getting from backend = ', graph_data);

          for (var key in graph_data) {
            var arr = graph_data[key];
            //console.log("smooth function data getting arr = ", arr);
            setFormFields2(
              Array.from(arr)
            );
          }

        })
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/max_min_data`).then((res) =>
        res.json().then((data) => {
          //console.log("Data = ", data.data[0])
          for (var key in data) {
            var arr = data[key];
            //console.log("Max Min Data arr = ", arr);
            setFormFields4(
              Array.from(arr)
            );
          }

        })
      );
    })();
  }, []);

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
                      x: form.xaxis,
                      y: form.yaxis,
                      type: 'scatter',
                      mode: 'markers',
                      marker: { color: 'red' },
                    },
                    { type: 'line', x: form.xaxis2, y: form.yaxis2, text: "R-Squared Value = " + form.rsqaured, name: "Best fit" },
                  ]}
                  layout={{
                    width: 720, height: 480, title: form.name + " with R-Squared Value", xaxis: {
                      title: "Actual Values", showgrid: true, gridcolor: '#bdbdbd',
                      gridwidth: 1,
                    },
                    yaxis: {
                      title: "Predicted Values", showgrid: true, gridcolor: '#bdbdbd',
                      gridwidth: 1,
                    }
                  }}
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
                      name: "Fitted Smooth Function",
                      x: form.xaxis,
                      y: form.yaxis1,
                      type: 'line',
                      mode: 'lines',
                      marker: { color: 'blue' },
                    }, {
                      name: "Confidence Interval",
                      x: form.xaxis,
                      y: form.lower_confidence,
                      type: 'line',
                      mode: 'lines',
                      line: {
                        dash: 'dash'
                      },
                      marker: { color: 'red' },
                    }, {
                      name: "Confidence Interval",
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
                  layout={{
                    width: 720, height: 480,
                    title: "Smooth function for '" + form.feature_name + "'",
                    xaxis: {
                      title: form.feature_name,
                    }, yaxis: {
                      title: "s(" + form.feature_name + ")",
                    }
                  }}
                />
              </div>
            )
          })}
        </div>


        <div className="disp_results">
          <h1 className="page-header">Maxima Minima Values</h1>
          <br />
          {formFields4.map((form, index) => {
            //console.log(" Form =  ", form)
            return (
              <div key={index}>
                <Button variant="primary" size="md" type="button" onClick={() => setDisp(!disp)}>
                  {disp === true ? 'Hide Maxima-Minima' : 'Show Maxima-Minima'}
                </Button>
                <br />
                {disp && <> <br /> {form.str1} <br /> {form.str2} <br /> {form.str3}
                  <br /> {form.str4} <br /> {form.str5} <br /> {form.str6}
                  <br /> {form.str7}<br /> <br /> {form.str8} <br /> {form.str9}
                  <br /> {form.str10} <br /> {form.str11}<br /> {form.str12}<br /> {form.str13}</>}
              </div>
            )
          })}
        </div>

      </body>

    </>
  )
}