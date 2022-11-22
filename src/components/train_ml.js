import infoicon from '../assests/images/info_icon.png'
import Plot from 'react-plotly.js';
import Button from 'react-bootstrap/Button';
import React, { useState, Fragment, useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const initialState = {
  splines: 10,
  lambdaval: 5,
  splitpercent: 90,
  bin: 15,
  shuffledata: false
};

//var counter = 0


export const Test = () => {
  const [state, setState] = useState(initialState)

  const [file, setFile] = useState();
  const [status, setStatus] = useState('---')
  const [formFields, setFormFields] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [corrNames, setcorrNames] = useState([]);
  const [correlation_names, setcorrelation_names] = useState([]);
  const [correlation_val, setcorrelation_val] = useState([]);
  const [correlation_matrix, setcorrelation_matrix] = useState([]);
  const [effectStateCheck, seteffectStateCheck] = useState(0);
  const [counter, setcounter] = useState(0);
  
  //console.log('state: ', { ...state, status })

  const handleUpload = (event) => {
    setCheckedState([]);
    setFormFields([]);
    //console.log("handleupload  checking states= ", checkedState)
    const data = new FormData()
    data.append('file', event.target.files[0])
    setFile(data)
  }


  const handleReset = (event) => {
    setState(initialState)
  }

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    console.log("Inside handleonchange = ", updatedCheckedState)

    setCheckedState(updatedCheckedState);
  };

  const handleOnClick = () => {
    let count = 1

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

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/col_names`).then((res) =>
      res.json().then((data) => {
        //console.log("checking formfields before = ", formFields)
        //setCheckedState(new Array(data['data'].length).fill(true))
        for (var key in data) {
          var arr = data[key];
          //console.log("getting column names  arr = ", arr)
          setFormFields(
            Array.from(arr)
          );
          setcorrNames(
            Array.from(arr)
          );
        }
      })
    );

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
  }
  const handleCorrUpdate = (event) => {
    //console.log("Inside handleCorrUpdate")
    //console.log("Checking states = ", checkedState)
    //console.log("FormFields = ", formFields)
    //console.log("setcorrNames = ", setcorrNames)

    setcorrNames([]);
    setcorrelation_matrix([]);
    const temp_list = []
    for (let i = 0; i < checkedState.length; i++) {
      if (checkedState[i] == true) {
        temp_list.push(formFields[i])
      }
    }
    setcorrNames([temp_list]);
    console.log("Corr Names = ", corrNames)
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

          //useEffect(() => { setcorrelation_matrix((corr_matrix)) }, [])
          setcorrelation_matrix((corr_matrix))
          //console.log("correlation_matrix = ", correlation_matrix)
        }
      })
    );


  }
  
  useEffect(() => {
      //const temp_value = counter
      if (counter <2) {
      setcounter(counter+1)
      seteffectStateCheck(effectStateCheck+1)
      //counter = counter + 1
      console.log("counter value = ", counter)
      //console.log("counter value = ", counter)
      console.log("Congrats!!!! Inside useeffect")
      setcorrNames([]);
      setcorrelation_matrix([]);
      const temp_list = []
      for (let i = 0; i < checkedState.length; i++) {
        if (checkedState[i] == true) {
          temp_list.push(formFields[i])
        }
      }
      setcorrNames([temp_list]);
      console.log("Corr Names = ", corrNames)
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

            //useEffect(() => { setcorrelation_matrix((corr_matrix)) }, [])
            setcorrelation_matrix((corr_matrix))
            //console.log("correlation_matrix = ", correlation_matrix)
          }
        })
      );

      seteffectStateCheck(false)

      };

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
          <Popup trigger={<button> Show Correlation</button>} position="right top" onOpen={() => setcounter(0)}>
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