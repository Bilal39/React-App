import infoicon from '../assests/images/info_icon.png'
import Plot from 'react-plotly.js';
import Button from 'react-bootstrap/Button';
import React, { useState, Fragment, useEffect, useRef } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./multiRangeSlider.css";



const initialState = {
  splines: 10,
  lambdaval: 5,
  splitpercent: 90,
  bin: 15,
  shuffledata: false,
  psoparticles: 50,
  psoiterations: 50
};

export const Test = () => {
  const [state, setState] = useState(initialState)
  const [file, setFile] = useState();
  const [status, setStatus] = useState('---');
  const [formFields, setFormFields] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [corrNames, setcorrNames] = useState([]);
  const [correlation_names, setcorrelation_names] = useState([]);
  const [correlation_val, setcorrelation_val] = useState([]);
  const [correlation_matrix, setcorrelation_matrix] = useState([]);
  const [counter, setcounter] = useState(0);
  const [counter2, setcounter2] = useState(10);
  const [inputFields1, setinputFields1] = useState([]);
  const [inputFields2, setinputFields2] = useState([]);
  const [count3, setCount3] = useState(0);
  const [counter4, setcounter4] = useState(0);
  const [counter5, setcounter5] = useState(0);
  const range = useRef(null);
  const [limitBoundries, setlimitBoundries] = useState(false);
  console.log("Limit boundries flag = ", limitBoundries)


  const handleUpload = (event) => {
    setCheckedState([]);
    setFormFields([]);
    const data = new FormData()
    data.append('file', event.target.files[0])
    setFile(data)
  }


  //const handleFormChange = (event, index) => {
  //  //console.log("first console = ", event.target.className)
  //  console.log("first console = ", event.target.value)
  //
  //  if (event.target.className === "thumb thumb--left"){
  //    console.log("left thumb")
  //    let data1 = [...inputFields1];
  //    console.log("Data1 = ", data1)
  //    //data1[index]['value'] = event.target.value;
  //    //setinputFields1(data1);
  //  }
  //  else {
  //    console.log("right thumb")
  //    let data2 = inputFields2;
  //    data2[index]['value'] = event.target.value;
  //    console.log("Data2 = ", data2)
  //    //setinputFields2(data2);
  //
  //  }
  //  //console.log("Second console =", data[index][event.target.name])
  //  console.log("inputFields1 = ", inputFields1 )
  //  console.log("inputFields2 = ", inputFields2 )
  //}

  const handleReset = (event) => {
    setState(initialState)
  }

  const handleOnChange = (position) => {
    setcounter5(0)
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  const handleFormChange1 = (event, index) => {
    setlimitBoundries(true);
    //console.log("first console = ", event.target.className)
    console.log("left dot Value = ", event.target.value)
    //console.log("before manInput1 = ", manInput1)
    if (event.target.value < inputFields2[index].value) {
      let data1 = [...inputFields1];
      console.log(" before Data1 = ", data1)
      data1[index]['value'] = event.target.value;
      console.log("after Data1 = ", data1)
      setinputFields1(data1);
      //manInput1[index]['value'] = event.target.value
      //console.log("maninput1 = ", manInput1 )
      //console.log("maninput2 = ", manInput2 )
      console.log("inputFields1 = ", inputFields1)
      console.log("inputFields2 = ", inputFields2)
      console.log("Limit boundries flag = ", limitBoundries)
    }

  }

  const handleFormChange2 = (event, index) => {
    setlimitBoundries(true);
    //console.log("first console = ", event.target.className)
    //console.log("fisrt checking inputfields2 = ", inputFields2)
    console.log("right dot value = ", event.target.value)
    //console.log("before manInput2 = ", manInput2)
    //console.log("before manInput1 = ", manInput1)
    if (event.target.value > inputFields1[index].value) {
    let data2 = [...inputFields2];
    data2[index]['value'] = event.target.value;
    //console.log(" Data2 = ", data2)
    setinputFields2(data2);
    //manInput2[index]['value'] = event.target.value
    //console.log("maninput1 = ", manInput1 )
    //console.log("maninput2 = ", manInput2 )
    //console.log("inputFields1 = ", inputFields1 )
    console.log("inputFields2 = ", inputFields2)
    console.log("Limit boundries flag = ", limitBoundries)
    }
  }

  const handleResetCounter = (event) => {
    setcounter4(0)
    setcounter5(0)
  }

  const handleOnClick = () => {
    let count = 1
    let temp_object = {}

    temp_object["limit_flag"] = limitBoundries
    temp_object["lower_bounds"] = inputFields1
    temp_object["upper_bounds"] = inputFields2
    console.log("This is the latest object to go in python backend", temp_object)

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/boundries_data`, {
      method: 'POST',
      body: JSON.stringify(temp_object),
    })

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/upload`, {
      method: 'POST',
      body: JSON.stringify(checkedState),
    })
      .then((response) => {
        response.json()
          .then((body) => {
          });
      });

    const timerId = setInterval(() => {
      //console.log('setInterval', count);
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
    //console.log('getStatus Counting: ', timerId);
  }

  const handleUploadImage = (event) => {
    //console.log('Upload Handler')
    event.preventDefault();


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

    setcounter2(0)
    setcounter5(0)

  }



  useEffect(() => {
    //console.log("Entering if condition, counter value = ", counter2)
    if (counter2 < 2) {
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
  });

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
      setcorrNames([temp_list]);
      //console.log("Corr Names = ", corrNames)
      const corr_names = []
      const corr_val = []
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
          setcorrelation_names([])
          setcorrelation_val([])
          for (var key in corrdata) {
            var arr = corrdata[key];
            corr_matrix.push(arr[arr.length - 1]['matrix'])
            setcorrelation_matrix((corr_matrix))
          }
        })
      );
    };

    if (counter4 < 2) {
      setcounter4(counter4 + 1)
      //console.log("Bringing Input Config!!!!")

      fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/update_data_file`, {
        method: 'POST',
        body: JSON.stringify(checkedState),
      })
        .then((response) => {
          response.json()
            .then((body) => {
            });
        });

      if (counter5 < 1) {
      setcounter5(counter5 + 1)
      fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/input_config`).then((res) =>
        res.json().then((data) => {
          //console.log('data', data);

          for (var key in data) {
            var arr = data[key];
            console.log("setting input fields = ", arr);
            setinputFields1(
              JSON.parse(JSON.stringify(Array.from(arr)))
            );
            setinputFields2(
              JSON.parse(JSON.stringify(Array.from(arr)))
            );
            //manInput1 = (Array.from(arr));
            //manInput1 = JSON.parse(JSON.stringify(Array.from(arr)));
            //console.log("manInput1 assigning = ", manInput1);
            //manInput2 = JSON.parse(JSON.stringify(Array.from(arr)));
            //console.log("manInput2 assigning = ", manInput2)
          }
        })
      );
      }
    }
  });



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

        <form className="uploader" id='formEle' onSubmit={handleUploadImage}>
          <div className="training_content">
            <div className="file_upload">
              <input type='file' name='file' onChange={handleUpload} required />
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

              <h2 className="pso-header">Parameters for PSO</h2>

              <div>
                <lable id='psoparticles-value'>Number of particles (PSO)  </lable>
                <input
                  htmlFor='psoparticles-value'
                  type="range"
                  min="10"
                  max="200"
                  step={10}
                  value={state.psoparticles}
                  onChange={(e) => setState({ ...state, 'psoparticles': e.target.value })}
                />
                {state.psoparticles}
                {<img className="infoicon" src={infoicon} title="Select the number of particles for particle swarm optimization (PSO)." />}
              </div>

              <div>
                <lable id='psoiterations-value'>Iterations for PSO  </lable>
                <input
                  htmlFor='psoiterations-value'
                  type="range"
                  min="10"
                  max="100"
                  step={5}
                  value={state.psoiterations}
                  onChange={(e) => setState({ ...state, 'psoiterations': e.target.value })}
                />
                {state.psoiterations}
                {<img className="infoicon" src={infoicon} title="Select the maximum iterations for particle swarm optimization (PSO)." />}
              </div>
            </div>

            <br />
            <div className="upload button">
              <Button variant="primary" size="md" type='submit'>Upload</Button>
              <button type='reset' onClick={handleReset}>Reset values</button>
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

                <br />
                <br />

              </div>
            </div>
          </div>
        </form>
        <div className='corrbtn'>
          <br />
          <Popup trigger={<button> Correlation Heatmap</button>} position="right top" onOpen={() => setcounter(0)}>
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
          {<img className="infoicon" width="25" height="18" src={infoicon} title="The correlation chart is available after uploading the data file." />}

          <br />
          <div className='boundriesbtn'>
          <Popup trigger={<button> Limit Input Boundries</button>} position="right top" onOpen={() => setcounter4(0)} className='popup-height'>
            <div>
              {inputFields1.map((form, index) => {
                //console.log("inputFields1 with html = ", inputFields1)

                return (
                  <div className='random-class'>
                    <div key={index}>
                      {form.name}
                      <br />
                      <div className="slidercontainer">
                        <input
                          type="range"
                          min={form.min}
                          max={form.max}
                          value = {form.value}
                          step={(form.max - form.min) / 50}
                          onChange={event => handleFormChange1(event, index)}
                          className="thumb thumb--left"
                        />
                        <input
                          type="range"
                          min={form.min}
                          max={form.max}
                          value = {inputFields2[index].value}
                          step={(form.max - form.min) / 50}
                          onChange={event => handleFormChange2(event, index)}
                          className="thumb thumb--right"
                        />
                        <div className="slider">
                          <div className="slider__track" />
                          <div ref={range} className="slider__range" />
                          <div className="slider__left-value">{parseFloat(form.value).toFixed(2)}</div>
                          <div className="slider__right-value">{parseFloat(inputFields2[index].value).toFixed(2)}</div>
                        </div>
                        <br />
                        <br />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button type='button' onClick={handleResetCounter}>Reset values</button>
          </Popup>
          {<img className="infoicon" width="25" height="18" src={infoicon} title="Select the range for inputs." />}

          <br />
          </div>
        </div>
        <div className='corrbtn'>
          <Button variant="primary" size="md" type='button' onClick={handleOnClick}>Train Model</Button>
          <div className="training_status">
            <p>Training Status : {status}</p>
          </div>
        </div>
      </div>

    </Fragment>
  )
}
export default Test;