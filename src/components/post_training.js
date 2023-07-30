import infoicon from '../assests/images/info_icon.png'
import React, { useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Popup from 'reactjs-popup';

const initialState = {
  psoparticles: 20,
  psoiterations: 50
};

export default function () {
  // usestate for setting a javascript
  // object for storing and using data

  const [status, setStatus] = useState('----');
  const [formFields, setFormFields] = useState([]);
  const [disp, setDisp] = useState(false);
  const [state, setState] = useState(initialState)
  //const [counter3, setcounter3] = useState(10);
  const [counter5, setcounter5] = useState(10);
  const range = useRef(null);
  const [inputFields1, setinputFields1] = useState([]);
  const [inputFields2, setinputFields2] = useState([]);
  const [limitBoundries, setlimitBoundries] = useState(false);
  const [userId, setUserId] = useState('');
  const [pretrainedFlag, setpretrainedFlag] = useState(0);


  useEffect(() => {
    // Check if user ID exists in local storage
    const storedUserId = localStorage.getItem('user_id');
    const storedTabId = sessionStorage.getItem('tab_id');

    if (storedUserId) {
      // If user ID exists in local storage, set it in state
      setUserId(storedUserId);
      console.log("Already stored UserId = ", storedUserId);
      console.log("Already stored TabId= ", storedTabId);
    } else {
      console.log("No ID Found ");
    }
    const combinedId = `${String(storedUserId).padStart(4, '0')}_${String(storedTabId).padStart(4, '0')}`;
    setUserId(combinedId);
    console.log("already stored Combined ID = ", combinedId);
    setcounter5(0)
  }, []);

  const handleResetCounter = (event) => {
    setcounter5(0)
    setlimitBoundries(false)
  }

  const handleFormChange1 = (event, index) => {
    setlimitBoundries(true);
    //console.log("left dot Value = ", event.target.value)
    if (event.target.value < inputFields2[index].value) {
      let data1 = [...inputFields1];
      //console.log(" before Data1 = ", data1)
      data1[index]['value'] = event.target.value;
      //console.log("after Data1 = ", data1)
      setinputFields1(data1);
    }
  }

  const handleFormChange2 = (event, index) => {
    setlimitBoundries(true);
    //console.log("right dot value = ", event.target.value)

    if (event.target.value > inputFields1[index].value) {
      let data2 = [...inputFields2];
      data2[index]['value'] = event.target.value;
      //console.log(" Data2 = ", data2)
      setinputFields2(data2);
    }
  }
  const handleUpload = (event) => {
    setpretrainedFlag(1)
    setStatus('----')
    setlimitBoundries(false);
    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('userId', userId)
    
    //setFile(data)
    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/pre_trained_model`, {
      method: 'POST',
      body: data,
    })
      .then((res) =>
        res.json().then((data) => {
          //console.log('data', data);

          for (var key in data) {
            var arr = data[key];
            //console.log("setting input fields = ", arr);
            //console.log("JSON.parse(JSON.stringify(Array.from(arr))) = ", JSON.parse(JSON.stringify(Array.from(arr))));
            setinputFields1(
              JSON.parse(JSON.stringify(Array.from(arr)))
            );
            setinputFields2(
              JSON.parse(JSON.stringify(Array.from(arr)))
            );
          }
        })
      );
  }

  // ON SUBMITTING VALUES
  const handleSubmission = (event) => {
    let temp_object = {}
    setFormFields([])

    temp_object["limit_flag"] = limitBoundries
    temp_object["lower_bounds"] = inputFields1
    temp_object["upper_bounds"] = inputFields2
    temp_object["psoparticles"] = state.psoparticles
    temp_object["psoiterations"] = state.psoiterations
    console.log("temp_object = ", temp_object)
    const data_to_send = {
      'temp_object': temp_object,
      "userId": userId,
      "pretrainedFlag":pretrainedFlag
    }
    setStatus('in progress ...')


    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/boundries_data`, {
      method: 'POST',
      body: JSON.stringify(data_to_send),
    }).then((res) => {
      res.json().then((response) => {
          setStatus(response.mstatus);
          //setcounter3(0)
          setFormFields(
            Array.from(response['data'])
          );
          //console.log("bringing data from backend = ", statusData)
        })
    })

    //const timerId = setInterval(() => {
    //  //console.log('setInterval', count);
    //  fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/training_status`)
    //    .then((res) => {
    //      res.json()
    //        .then((statusData) => {
    //          setStatus(statusData.mstatus);
    //          //console.log("bringing data from backend = ", statusData)
    //          if (statusData.mstatus === "Done!") {
    //            setStatus(statusData.mstatus);
    //            clearInterval(timerId)
    //            setcounter3(0)
    //          }
    //        })
    //    })
    //}, 1200);
  }

  if (counter5 < 3) {
    setcounter5(counter5 + 1)
    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/input_config`, {
      method: 'POST',
      body: JSON.stringify(userId),
    }).then((res) =>
      res.json().then((data) => {
        //console.log('data', data);

        for (var key in data) {
          var arr = data[key];
          //console.log("setting input fields = ", arr);
          //console.log("JSON.parse(JSON.stringify(Array.from(arr))) = ", JSON.parse(JSON.stringify(Array.from(arr))));
          setinputFields1(
            JSON.parse(JSON.stringify(Array.from(arr)))
          );
          setinputFields2(
            JSON.parse(JSON.stringify(Array.from(arr)))
          );
        }
      })
    );
  }

  //if (counter3 < 3) {
  //  setcounter3(counter3 + 1)
  //  fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/max_min_data`).then((res) =>
  //    res.json().then((data) => {
  //      //console.log("Data = ", data.data[0])
  //      for (var key in data) {
  //        var arr = data[key];
  //        console.log("Max Min Data arr = ", arr);
  //        setFormFields(
  //          Array.from(arr)
  //        );
  //      }
  //    })
  //  );
  //}

  return (
    <>
      <body>
        <div className="background-Image">
          <div className="pso-left">
            <h6><u>Instructions:</u></h6>
            <p><b>1.</b> Set PSO parameters.</p>
            <p><b>2.</b> Upper and lower bounds can also be selected(Optional).</p>
            <p><b>3.</b> If Upper and lower bounds are not provided, it will automatically consider the ranges from the input file.</p>
            <p><b>4.</b> Click on the "Submit Values" button to start pso processing.</p>
            <p><b>5.</b> When the status turn to "Done!", click "Show Maxima-Minima" to see the results.</p>
            <br /><br /><br />
            <p><b>• Upload .pkl file for predictions.</b> </p>
            <input type='file' name='file' accept='.pkl' onChange={handleUpload} required />
          </div>

          <div className="Extreme-contents">
            <h2 className="pso-header">Parameters for PSO</h2>
            <br /><br />
            <div className='pso-parameters'>
              <div>
                <lable id='psoparticles-value'>Nbr of particles (PSO)</lable>
                <input
                  htmlFor='psoparticles-value'
                  type="range"
                  min="20"
                  max="500"
                  step={15}
                  value={state.psoparticles}
                  onChange={(e) => setState({ ...state, 'psoparticles': e.target.value })}
                />
                {state.psoparticles}
                {<img className="pso-infoicon" src={infoicon} title="Select the number of particles for particle swarm optimization (PSO)." />}
              </div>
              <br />

              <div>
                <lable id='psoiterations-value'>Nbr of Iterations (PSO)  </lable>
                <input
                  htmlFor='psoiterations-value'
                  type="range"
                  min="10"
                  max="200"
                  step={10}
                  value={state.psoiterations}
                  onChange={(e) => setState({ ...state, 'psoiterations': e.target.value })}
                />
                {state.psoiterations}
                {<img className="pso-infoicon" src={infoicon} title="Select the maximum iterations for particle swarm optimization (PSO)." />}
              </div>
              <br />

              <div className='boundriesbtn'>
                <Popup trigger={<button> Limit Input Boundries for PSO</button>} position="right top" className='popup-height'>
                  <div>
                    {inputFields1.map((form, index) => {
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
                                value={form.value}
                                step={(form.max - form.min) / 50}
                                onChange={event => handleFormChange1(event, index)}
                                className="thumb thumb--left"
                              />

                              <input
                                type="range"
                                min={form.min}
                                max={form.max}
                                value={inputFields2[index].value}
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

                {<img className="pso-infoicon" width="50" height="20" src={infoicon} title="Select the range for inputs." />}

                <br /><br /><br />

                <Button variant="primary" size="md" type='submit' onClick={handleSubmission} >Submit Values</Button>
              </div>

              <div className="training_status">
                <p>Status : {status}</p>
              </div>
            </div>
          </div>

          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <div className='disp_extrema'>
            <h1 className="pso-header">Maxima Minima Values</h1>
            <br />
            <Button variant="primary" size="md" type="button" onClick={() => setDisp(!disp)}>
              {disp === true ? 'Hide Maxima-Minima' : 'Show Maxima-Minima'}
            </Button>
            {formFields.map((form, index) => {
              //console.log(" Form =  ", form)
              return (
                <div className="disp_results">
                  <div key={index}>
                    <br />
                    {disp && <> <br /> {form.str1} <br /> {form.str2} <br /> {form.str3}
                      <br /> {form.str4} <br /> {form.str5} <br /> {form.str6}
                      <br /> {form.str7}<br /> <br /> {form.str8} <br /> {form.str9}
                      <br /> {form.str10} <br /> {form.str11}<br /> {form.str12}<br /> {form.str13}</>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </body>
    </>
  )
}