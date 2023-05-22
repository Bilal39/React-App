import infoicon from '../assests/images/info_icon.png'
import qeeriLogo from '../assests/images/qeeri-logo.png'
import func_legend from '../assests/images/functions_legends.png'
import res_legend from '../assests/images/result_legend.png'
import qnrfLogo from '../assests/images/qnrf.png'
import Plot from 'react-plotly.js';
import Button from 'react-bootstrap/Button';
import React, { useState, Fragment, useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./multiRangeSlider.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Nav, Tab, Container } from 'react-bootstrap';


// Gam parameters
const initialState = {
  splines: 10,
  lambdaval: 5,
  splitpercent: 90,
  bin: 15,
  shuffledata: false,
  model: 0
};

// RFR parameters
const initialState2 = {
  n_estimators: 100,
  max_depth: 0,
  splitpercent: 90,
  bin: 15,
  shuffledata: false,
  model: 1
};

export const Test = () => {
  const [state, setState] = useState(initialState)
  const [state2, setState2] = useState(initialState2)
  const [file, setFile] = useState();
  const [fileName, setfileName] = useState();
  const [status, setStatus] = useState('----');
  const [formFields, setFormFields] = useState([]);
  const [formFields2, setFormFields2] = useState([]);
  const [formFields3, setformFields3] = useState([]);
  const [formFields4, setformFields4] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [corrNames, setcorrNames] = useState([]);
  const [correlation_matrix, setcorrelation_matrix] = useState([]);
  const [counter, setcounter] = useState(5);
  const [counter2, setcounter2] = useState(10);
  const [counter3, setcounter3] = useState(0);
  const [counter4, setcounter4] = useState(0);
  const [counter7, setcounter7] = useState(5);
  const [corrFlag, setcorrFlag] = useState(0);
  const [modelFlag, setmodelFlag] = useState(1); // if 1, it is GAM model otherwise no GAM.


  const handleUpload = (event) => {
    setcorrFlag(0)
    setcounter4(0)
    setcounter3(0)
    setCheckedState([]);
    setFormFields([]);
    setformFields3([]);
    setformFields4([]);
    setFormFields2([]);
    setStatus('----')

    const data = new FormData()
    data.append('file', event.target.files[0])
    console.log("event.target.files[0] = ", event.target.files[0].name)
    setfileName(event.target.files[0].name)
    setFile(data)
  }

  const handleReset = (event) => {
    setState(initialState)
  }

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  const handleOnClick = () => {

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/upload`, {
      method: 'POST',
      body: JSON.stringify(checkedState),
    })
      .then((response) => {
        response.json()
          .then((body) => {
          });
      });

    //setcounter3(counter3 + 1)

    const timerId = setInterval(() => {
      //console.log('setInterval', count);
      fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/training_status`)
        .then((res) => {
          res.json()
            .then((statusData) => {
              setStatus(statusData.mstatus);
              //console.log("bringing data from backend = ", statusData)
              if (statusData.mstatus === "Done!") {
                setStatus(statusData.mstatus);
                clearInterval(timerId)
                setcounter7(0)
                setcounter3(counter3 + 1)
              }
            })
        })
    }, 1200);
    //console.log('getStatus Counting: ', timerId);
  }

  // For GAM Model
  const handleUploadImage = (event) => {
    //console.log('Upload Handler')
    setmodelFlag(1)
    setcounter4(counter4 + 1)
    setformFields3([]);
    setformFields4([]);
    setcorrFlag(1)
    event.preventDefault();
    setCheckedState([])
    setStatus('----')

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/parameter`, {
      method: 'POST',
      body: JSON.stringify(state),
    })
      .then((response) => {
        response.json()
          .then((body) => {
          });
      });

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/file_transfer`, {
      method: 'POST',
      body: file,
    })
      .then((response) => {
        response.json()
          .then((body) => {
          });
      });

    setcounter(0)
    setcounter2(0)

    let count1 = 0;
    let intervalId = setInterval(() => {
      fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/histogram_data`).then((res) =>
        res.json().then((graph_data) => {
          for (var key in graph_data) {
            var arr = graph_data[key];
            //console.log("Histogram Data arr = ", arr);
            setFormFields2(
              Array.from(arr)
            );
          }
        })
      );
      count1 += 1;
      if (count1 === 2) {
        clearInterval(intervalId);
      }
    }, 250);
  }

  // For RFR Model
  const handleUploadImage2 = (event) => {
    //console.log('Upload Handler')
    setmodelFlag(0)
    setcounter4(counter4 + 1)
    setformFields3([]);
    setformFields4([]);
    setcorrFlag(1)
    event.preventDefault();
    setCheckedState([])
    setStatus('----')

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/parameter`, {
      method: 'POST',
      body: JSON.stringify(state2),
    })
      .then((response) => {
        response.json()
          .then((body) => {
          });
      });

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/file_transfer`, {
      method: 'POST',
      body: file,
    })
      .then((response) => {
        response.json()
          .then((body) => {
          });
      });

    setcounter(0)
    setcounter2(0)

    let count1 = 0;
    let intervalId = setInterval(() => {
      fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/histogram_data`).then((res) =>
        res.json().then((graph_data) => {
          for (var key in graph_data) {
            var arr = graph_data[key];
            //console.log("Histogram Data arr = ", arr);
            setFormFields2(
              Array.from(arr)
            );
          }
        })
      );
      count1 += 1;
      if (count1 === 2) {
        clearInterval(intervalId);
      }
    }, 250);
  }

  if (counter2 < 1) {
    setcounter2(counter2 + 1)
    //console.log("Inside useeffect!!!!!")

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/col_names`).then((res) =>
      res.json().then((data) => {

        setCheckedState(new Array(data['data'].length).fill(true))
        for (var key in data) {
          var arr = data[key];
          setFormFields(
            Array.from(arr)
          );
          setcorrNames(
            Array.from(arr)
          );
        }
      })
    );
  };

  useEffect(() => {
    if (counter < 2) {
      setcounter(counter + 1)
      setcorrNames([]);
      setcorrelation_matrix([]);
      const temp_list = []
      for (let i = 0; i < checkedState.length; i++) {
        if (checkedState[i] == true) {
          temp_list.push(formFields[i])
        }
      }
      if (corrFlag === 1) {
        console.log("CorrFlag ===1 ")
        setcorrNames([temp_list]);
        //console.log("Corr Names = ", corrNames)

        var corr_matrix = []

        fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/data_for_corr`, {
          method: 'POST',
          body: JSON.stringify(checkedState),
        })
          .then((response) => {
            response.json()
              .then((body) => {
              });
          });

        fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/cor_data`).then((res) =>
          res.json().then((corrdata) => {
            for (var key in corrdata) {
              var arr = corrdata[key];
              corr_matrix.push(arr[arr.length - 1]['matrix'])
              setcorrelation_matrix((corr_matrix))
            }
          })
        );
      }
    };
  });

  if (counter7 < 3) {
    setcounter7(counter7 + 1)
    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/results_update`).then((res) =>
      res.json().then((graph_data) => {
        console.log('training result = ', graph_data);
        for (var key in graph_data) {
          var arr = graph_data[key];
          //console.log("training testing data arr = ", arr);
          setformFields3(
            Array.from(arr)
          );
        }
      })
    );

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/smooth_func_data`).then((res) =>
      res.json().then((graph_data) => {
        //console.log('data getting from backend = ', graph_data);
        for (var key in graph_data) {
          var arr = graph_data[key];
          //console.log("smooth function data getting arr = ", arr);
          setformFields4(
            Array.from(arr)
          );
        }
      })
    );
  }
  //{
  //  name: "Data Points",
  //  x: form.data_points_xaxis,
  //  y: form.selected_smooth_points,
  //  type: 'scatter',
  //  mode: 'markers',
  //  marker: { color: 'red' },
  ////},
  //function downloadPkl() {
  //  fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/saved_model`).then((res) =>
  //    res.blob().then((blob) => {
  //      const filename = res.headers.get('Content-Disposition').split('filename=')[1];
  //      const url = window.URL.createObjectURL(blob);
  //      const link = document.createElement('a');
  //      link.href = url;
  //      link.download = filename;
  //      document.body.appendChild(link);
  //      link.click();
  //      document.body.removeChild(link);
  //    })
  //  );
  //}
  function downloadPkl() {
    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/model_file_name`).then((res) =>
      res.json().then((model_name) => {
        for (var key in model_name) {
          var arr = model_name[key];
          //console.log("model_name arr = ", arr);
          fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/saved_model`).then((res) =>
            res.blob().then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = arr;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            })
          );
        }
      })
    );
  }

  const getStateAsTable = () => {
    const data = [];
    const stateKeys = Object.keys(state2);
    stateKeys.forEach(key => {
      data.push({ name: key, value: state2[key] });
    });
    return data;
  };

  let task_flag = 0
  const saveAsPDF = () => {
    // Generate data array from state
    const data = getStateAsTable();

    // Create new PDF document
    const doc = new jsPDF()
    // Set font size and style
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 180, 250);

    //Adding Logos
    const img = new Image();
    img.src = qeeriLogo;
    img.onload = function () {
      // Add image to PDF document
      doc.addImage(this, 'PNG', 0, 0, 50, 30); // adjust x, y, width, and height as needed
    }


    // Add text at top center of the document
    let topMargin = 30; // increased from 20 to 30 for more space
    let xaxismargin = 15; // increased from 20 to 30 for more space
    const text = 'Model Report';
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(text, x, topMargin);

    doc.setLineWidth(0.1);

    // Reset font size and style
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');

    // Add space between text and table
    //const tableTopMargin = topMargin + 10; // increased from 10 to 20 for more space
    topMargin += 10; // increased from 10 to 20 for more space

    // Add table to PDF document
    doc.autoTable({
      head: [['Parameters', 'Value']],
      body: data.map(({ name, value }) => [name, value]),
      headStyles: {
        fillColor: [0, 150, 250] // set background color of header row to white
      },
      startY: topMargin // set the Y position of the table to the desired top margin
    });

    doc.setFontSize(8);
    doc.setTextColor(250, 50, 50);
    doc.setFont('helvetica', 'bold');
    topMargin += 60
    doc.text(`User uploaded file : ${fileName} `, xaxismargin, topMargin);
    topMargin += 10
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    //doc.setFont('helvetica', 'bold');
    doc.text('Selected Inputs:', xaxismargin, topMargin);
    topMargin += 5

    // Adding selected input names
    doc.setFont('helvetica', 'normal');
    let feature_names = []
    formFields4.forEach((field) => {
      feature_names.push(field.feature_name)
    })
    doc.setFontSize(8);
    for (let i = 0; i < feature_names.length; i++) {
      topMargin += 4
      if (doc.internal.pageSize.getHeight() <= (topMargin + 10)) {
        topMargin = 15;
        doc.addPage();
      };
      doc.text('\u2022 ' + feature_names[i], 17, topMargin);
    };

    topMargin += 10
    let formfield_plots_x_axis = xaxismargin

    // Create an array of promises that resolve when each image has loaded
    const imagePromises = formFields3.map((form, index) => {
      return new Promise((resolve, reject) => {
        if (doc.internal.pageSize.getHeight() <= (topMargin + 50)) {
          doc.addPage()
          topMargin = 30; // increased from 20 to 30 for more space
        }

        const divElement = document.getElementById(`traintestPlot-${index}`);
        const canvasElement = document.createElement('canvas');
        canvasElement.width = divElement.offsetWidth;
        canvasElement.height = divElement.offsetHeight;
        const ctx = canvasElement.getContext('2d');
        const parser = new DOMParser();
        const svgElement = parser.parseFromString(divElement.innerHTML, 'image/svg+xml').querySelector('svg');
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const img4 = new Image();
        img4.src = res_legend;
        const imgElement = new Image();
        imgElement.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
        imgElement.onload = () => {
          ctx.drawImage(imgElement, 0, 0);
          const imgData = canvasElement.toDataURL('image/png');
          //console.log("svgString = ", svgString);
          doc.addImage(imgData, 'PNG', formfield_plots_x_axis, topMargin, 100, 65);
          doc.addImage(img4, 'PNG', formfield_plots_x_axis + 60, topMargin + 6, 15, 5);

          // Add labels, text, and titles
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');

          doc.text(form.name, formfield_plots_x_axis + 45, topMargin + 5, { align: 'center' });
          doc.setFont('helvetica', 'normal');
          doc.text('Actual Values', formfield_plots_x_axis + 45, topMargin + 60, { align: 'center' });
          doc.text('Predicted Values', formfield_plots_x_axis + 9, topMargin + 25, { angle: -90, align: 'center' });
          doc.setFontSize(6);

          doc.text(`R - Squared Value = ${form.rsqaured}`, formfield_plots_x_axis + 25, topMargin + 10, { align: 'center' });
          doc.text(`RMSE Percentage = ${form.rmse} %`, formfield_plots_x_axis + 25, topMargin + 13, { align: 'center' });
          formfield_plots_x_axis += 100
          resolve();
        };
      });
    });

    // Wait for all image promises to resolve before saving the PDF document
    Promise.all(imagePromises).then(() => {
      task_flag += 1

      formfield_plots_x_axis = xaxismargin
      topMargin += 70
      let plot_counter = 0

      // Map formFields4 to imagePromises2
      const imagePromises2 = formFields4.map((form, index) => {
        return new Promise((resolve, reject) => {
          console.log("Value for modelFlag = ", modelFlag)
          if (modelFlag == 1) {
            const img3 = new Image();
            img3.src = func_legend;
            const img3Promise = new Promise((resolve, reject) => {
              img3.onload = function () {
                const divElement2 = document.getElementById(`smoothfunc-${index}`);
                const canvasElement2 = document.createElement('canvas');
                canvasElement2.width = divElement2.offsetWidth;
                canvasElement2.height = divElement2.offsetHeight;
                const ctx2 = canvasElement2.getContext('2d');
                const parser2 = new DOMParser();
                const svgElement2 = parser2.parseFromString(divElement2.innerHTML, 'image/svg+xml').querySelector('svg');
                const svgString2 = new XMLSerializer().serializeToString(svgElement2);
                const imgElement2 = new Image();
                imgElement2.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString2)}`;
                imgElement2.onload = () => {
                  ctx2.drawImage(imgElement2, 0, 0);
                  const imgData2 = canvasElement2.toDataURL('image/png');
                  if (doc.internal.pageSize.getHeight() <= (topMargin + 50)) {
                    doc.addPage();
                    topMargin = 30;
                  }
                  doc.addImage(imgData2, 'PNG', formfield_plots_x_axis, topMargin, 100, 65);
                  doc.addImage(this, 'PNG', formfield_plots_x_axis + 55, topMargin + 6, 20, 9);
                  resolve();

                  // Add labels, text, and titles
                  doc.setFontSize(8);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`Smooth function for ${form.feature_name}`, formfield_plots_x_axis + 45, topMargin + 5, { align: 'center' });
                  doc.setFont('helvetica', 'normal');
                  doc.text(form.feature_name, formfield_plots_x_axis + 45, topMargin + 60, { align: 'center' });
                  doc.text(`S(${form.feature_name})`, formfield_plots_x_axis, topMargin + 45, { angle: 90, align: 'left' });
                  plot_counter += 1;
                  

                  Promise.all([img3Promise]).then(() => {
                    resolve();
                  });



                  if (plot_counter % 2 == 0) {
                    topMargin += 70;
                    formfield_plots_x_axis = xaxismargin;
                  } else {
                    formfield_plots_x_axis += 100;
                  }
                };
              };
            });
            resolve(img3Promise);
          }
        });
      });

      // Wait for all image promises to resolve before saving the PDF document
      Promise.all(imagePromises2).then(() => {
        doc.save('report.pdf');
      });
    });
  };

  function shouldDisableButton() {
    return counter3 < 1;
  }

  function DisableTrainButton() {
    return counter4 < 1;
  }

  const renderHistogram = () => {
    return (<Popup trigger={<button disabled={DisableTrainButton()}> Histogram</button>} position="right top" >
      {formFields2.map((form, index) => {
        return (
          <div key={index}>
            <Plot
              data={[
                {
                  name: "Histogram",
                  x: form.data,
                  nbinsx: form.bin_size,
                  type: "histogram",
                  marker: { color: 'blue' },
                },
              ]}
              layout={{
                width: 640, height: 640, title: "Histogram", xaxis: {
                  title: "Output Values", showgrid: true, gridcolor: '#bdbdbd',
                  gridwidth: 1,
                },
                yaxis: {
                  title: "Frequency", showgrid: true, gridcolor: '#bdbdbd',
                  gridwidth: 1,
                }
              }}
            />
          </div>
        )
      })}
    </Popup>

    );
  };

  const renderCorrHeatmap = () => {
    return (<Popup trigger={<button disabled={DisableTrainButton()}> Correlation Heatmap</button>} position="right top" onOpen={() => setcounter(0)}>
      <div><Plot
        data={[
          {
            z: correlation_matrix[0],
            x: corrNames[0],
            y: corrNames[0],
            type: 'heatmap',
            hoverongaps: false
          },
        ]}
        layout={{
          title: "Correlation heatmap", xaxis: {
            automargin: true
          },
          yaxis: {
            automargin: true
          }
        }}
      /></div>
      <br />
      <br />
    </Popup>

    );
  }

  const renderTrainingPlot = () => {
    return (
      formFields3.map((form, index) => {
        return (
          <div key={index} id={`traintestPlot-${index}`}>
            <Plot
              data={[
                {
                  name: form.name.slice(0, 8) + " Data Points ",
                  x: form.xaxis,
                  y: form.yaxis,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'red' },
                },
                { type: "line", x: form.xaxis2, y: form.yaxis2, name: "Best fit " },
              ]}
              layout={{
                width: 720, height: 480, title: form.name, xaxis: {
                  title: "Actual Values", showgrid: true, gridcolor: '#bdbdbd',
                  gridwidth: 1,
                },
                yaxis: {
                  title: "Predicted Values", showgrid: true, gridcolor: '#bdbdbd',
                  gridwidth: 1,
                }, annotations: [
                  {
                    text: "R-Squared Value = " + form.rsqaured,
                    x: 0.05,
                    y: 0.99,
                    xref: "paper",
                    yref: "paper",
                    font: {
                      size: 12
                    },
                    showarrow: false
                  },
                  {
                    text: "RMSE Percentage = " + form.rmse + " %",
                    x: 0.05,
                    y: 0.93,
                    xref: "paper",
                    yref: "paper",
                    font: {
                      size: 12
                    },
                    showarrow: false
                  }
                ]
              }}
            />
          </div>
        )
      })
    )
  }

  const renderSmoothFunc = () => {
    return (
      formFields4.map((form, index) => {
        return (
          <div key={index} id={`smoothfunc-${index}`}>
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
                {
                  name: "Data Points",
                  x: form.data_points_xaxis,
                  y: form.selected_smooth_points,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'red' },
                },
              ]}
              layout={{
                width: 840, height: 480,
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
      })
    )
  }

  return (
    <Fragment>

      <div className="background-Image">
        <h1 className="page-header">Model Training</h1>
        <div className="left">
          <h6><u>Instructions:</u></h6>
          <p><b>1.</b> Upload a CSV format file.</p>
          <p><b>2.</b>	Set parameters for model training.</p>
          <p><b>3.</b>	Click on “upload” button.</p>
          <p><b>4.</b>	After clicking upload button, select input features you want to train the model on.</p>
          <p><br /><b>Note:</b> CSV file:</p>
          <p><b>i.</b> Should be formatted in the provided sample template format which can be downloaded by clicking “Download Sample Template” link.</p>
          <p><b>ii.</b>	Can have ‘any’ number of input columns while should have only ‘one’ output column (ordered as a last column).</p>
          <p><b>iii.</b> Should have ‘one’ header row.</p>
          <p><b>iv.</b>	Should have no ‘serial number’ column.</p>

        </div>
        <br />
        <h5 className="about-headings">Select Machine Learning Model</h5>

        <Tab.Container id="my-tabs" defaultActiveKey="/home">
          <Nav variant="pills">
            <Nav.Item>
              <Nav.Link eventKey="link-1">GAM</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-2">Random Forest</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-3">XGBoost</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="link-1">
              <Container>
                <form className="uploader" id='formEle' onSubmit={handleUploadImage}>
                  <div className="training_content">
                    <div className="file_upload">
                      <input type='file' name='file' accept='.csv' onChange={handleUpload} required />
                      <a href={require("../assests/template.csv")} download="template.csv">Download Sample Template</a>
                    </div>
                    <br />
                    <h2 className="ml-header">Parameters for ML model</h2>

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
                          max="100"
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
                      <button type='button' onClick={handleReset}>Reset values</button>
                      <div >
                        <div className='features_checkbox'>
                          <br />
                          {formFields.slice(0, -1).map((form, index) => {

                            return (
                              <div key={index}>
                                <input
                                  type="checkbox"
                                  id={`custom-checkbox-${index}`}
                                  name={form}
                                  checked={checkedState[index]}
                                  onChange={() => handleOnChange(index)}
                                />
                                <span> - </span>
                                {form}
                              </div>
                            )
                          })}
                        </div>
                        <br /><br />
                      </div>
                    </div>
                  </div>
                </form>
                <div className='corrbtn'>
                  {renderHistogram()}
                  {<img className="infoicon" width="25" height="18" src={infoicon} title="Plot histogram for the output." />}
                </div>


                <div className='corrbtn'>
                  {renderCorrHeatmap()}
                  {<img className="infoicon" width="25" height="18" src={infoicon} title="The correlation chart is available after uploading the data file." />}
                  <br />
                </div>

                <div className='corrbtn'>
                  <br />
                  <Button variant="primary" size="md" type='button' onClick={handleOnClick} disabled={DisableTrainButton()}>Train Model</Button>
                  <div className="training_status">
                    <p>Training Status : {status}</p>
                  </div>
                </div>
                <br />
                <h1 className="page-header">Training Result</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  {renderTrainingPlot()}
                </div>
                <div className="disp_results">
                  <br />
                  <Button onClick={downloadPkl} disabled={shouldDisableButton()}>Download Trained Model</Button>
                  <br /><br />
                  <Button onClick={saveAsPDF} disabled={shouldDisableButton()} >Download Report</Button>
                  <h1 className="page-header">Smooth Functions</h1>
                  <br /><br /><br />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', justifyContent: 'center' }}>
                    {renderSmoothFunc()}
                  </div>

                </div>

              </Container>
            </Tab.Pane>
            <Tab.Pane eventKey="link-2">
              <Container>
                <form className="uploader" id='formEle' onSubmit={handleUploadImage2}>
                  <div className="training_content">
                    <div className="file_upload">
                      <input type='file' name='file' accept='.csv' onChange={handleUpload} required />
                      <a href={require("../assests/template.csv")} download="template.csv">Download Sample Template</a>
                    </div>
                    <br />
                    <h2 className="ml-header">Parameters for ML model</h2>

                    <div className="range_sliders">
                      <div>
                        <label id='estimator-value'>Number of Estimators (trees) </label>
                        <input
                          htmlFor='estimator-value'
                          type="range"
                          min="10"
                          max="500"
                          step={15}
                          value={state2.n_estimators}
                          onChange={(e) => setState2({ ...state2, 'n_estimators': e.target.value })}
                        />
                        {state2.n_estimators}
                        {<img className="infoicon" src={infoicon} title="The number of decision trees in the random forest." />}
                      </div>

                      <div>
                        <lable id='max_depth-value'>Max Depth  </lable>
                        <input
                          htmlFor='max_depth-value'
                          type="range"
                          min="0"
                          max="32"
                          value={state2.max_depth}
                          onChange={(e) => setState2({ ...state2, 'max_depth': e.target.value })}
                        />
                        {state2.max_depth}
                        {<img className="infoicon" src={infoicon} title="The maximum depth of the tree. If set to none allows the decision trees in a Random Forest Regressor to grow until a minimum number of samples per leaf is reached." />}
                      </div>

                      <div>
                        <lable id='split-value'>(Training-Testing Data Split) Training % </lable>
                        <input
                          htmlFor='split-value'
                          type="range"
                          min="50"
                          max="100"
                          value={state2.splitpercent}
                          onChange={(e) => setState2({ ...state2, 'splitpercent': e.target.value })}
                        />
                        {state2.splitpercent}
                        {<img className="infoicon" src={infoicon} title="Please set training data % . Testing data % will be (100% - training%) " />}
                      </div>

                      <div>
                        <lable id='bin-value'>Bins size for histogram </lable>
                        <input
                          htmlFor='bin-value'
                          type="range"
                          min="2"
                          max="100"
                          value={state2.bin}
                          onChange={(e) => setState2({ ...state2, 'bin': e.target.value })}
                        />
                        {state2.bin}
                        {<img className="infoicon" src={infoicon} title="The towers or bars of a histogram are called bins. The greater the size of the bin, the more data division will be." />}
                      </div>

                      <div>
                        <lable className="shufflecheckbox" >Shuffle Data </lable>
                        <input
                          type="checkbox"
                          name="isChecked"
                          onChange={(e) => setState2({ ...state2, 'shuffledata': e.target.checked })}
                        />
                        {<img className="infoicon" src={infoicon} title="If checked, it will shuffle all the data before training." />}
                      </div>
                    </div>

                    <br />
                    <div className="upload button">
                      <Button variant="primary" size="md" type='submit'>Upload</Button>
                      <button type='button' onClick={handleReset}>Reset values</button>
                      <div >
                        <div className='features_checkbox'>
                          <br />
                          {formFields.slice(0, -1).map((form, index) => {

                            return (
                              <div key={index}>
                                <input
                                  type="checkbox"
                                  id={`custom-checkbox-${index}`}
                                  name={form}
                                  checked={checkedState[index]}
                                  onChange={() => handleOnChange(index)}
                                />
                                <span> - </span>
                                {form}
                              </div>
                            )
                          })}
                        </div>
                        <br /><br />
                      </div>
                    </div>
                  </div>
                </form>
                <div className='corrbtn'>
                  {renderHistogram()}
                  {<img className="infoicon" width="25" height="18" src={infoicon} title="Plot histogram for the output." />}
                </div>

                <div className='corrbtn'>
                  {renderCorrHeatmap()}
                  {<img className="infoicon" width="25" height="18" src={infoicon} title="The correlation chart is available after uploading the data file." />}
                  <br />
                </div>

                <div className='corrbtn'>
                  <br />
                  <Button variant="primary" size="md" type='button' onClick={handleOnClick} disabled={DisableTrainButton()}>Train Model</Button>
                  <div className="training_status">
                    <p>Training Status : {status}</p>
                  </div>
                </div>
                <br />
                <h1 className="page-header">Training Result</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  {renderTrainingPlot()}
                </div>
                <div className="disp_results">
                  <br />
                  <Button onClick={downloadPkl} disabled={shouldDisableButton()}>Download Trained Model</Button>
                  <br /><br />
                  <Button onClick={saveAsPDF} disabled={shouldDisableButton()} >Download Report</Button>

                </div>
                <br /><br /><br /><br />


              </Container>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>





      </div>
    </Fragment>
  )
}
export default Test;