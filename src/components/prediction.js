import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';



function Prediction() {
  const [formFields, setFormFields] = useState([]);
  const [count1, setCount1] = useState(10);

  const [userId, setUserId] = useState('');


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
    setCount1(0)
  }, []);

  //const [file, setFile] = useState();

  const handleUpload = (event) => {
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
            //console.log("arr = ", arr);
            setFormFields(
              Array.from(arr)
            );
          }
        })
      );
  }

  useEffect(() => {

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/input_config`,{
      method: 'POST',
      body: JSON.stringify(userId),
    }).then((res) =>
    res.json().then((data) => {
      //console.log('data', data);

      for (var key in data) {
        var arr = data[key];
        //console.log("arr = ", arr);
        setFormFields(
          Array.from(arr)
        );
      }
    })
  );
},[count1])



  //useEffect(() => {
  //  (async () => {
  //    await fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/input_config`).then((res) =>
  //      res.json().then((data) => {
  //        //console.log('data', data);
  //
  //        for (var key in data) {
  //          var arr = data[key];
  //          //console.log("arr = ", arr);
  //          setFormFields(
  //            Array.from(arr)
  //          );
  //        }
  //      })
  //    );
  //  })();
  //}, [count1]);

  const handleReset = (event) => {
    let data = [...formFields];
    for (var i = 0, l = data.length; i < l; i++) {
      data[i]['value'] = ((data[i]['max'] + data[i]['min']) / 2).toFixed(2);
      setFormFields(data);
    }

  }
  const handleFormChange = (event, index) => {
    //console.log("first console = ",event.target.value)
    let data = [...formFields];
    //console.log("Second console =", data[index][event.target.name])
    data[index]['value'] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    const data_to_send = {
      'formFields': formFields,
      "userId": userId
    }

    fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/predict`, {
      method: 'POST',
      body: JSON.stringify(data_to_send),
    }).then((response) => {
      response.json().then((outputdata) => {
        // Setting a data from api
        setoutputdata({
          output_value: outputdata.output_prediction
        });
        setunit({
          unit_value: outputdata.unit_prediction
        });
      });
    });
  }

  //function downloadPkl() {
  //  fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/model_file_name`).then((res) =>
  //    res.json().then((model_name) => {
  //      for (var key in model_name) {
  //        var arr = model_name[key];
  //        //console.log("model_name arr = ", arr);
  //        fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/saved_model`).then((res) =>
  //          res.blob().then((blob) => {
  //            const url = window.URL.createObjectURL(blob);
  //            const link = document.createElement('a');
  //            link.href = url;
  //            link.download = arr;
  //            document.body.appendChild(link);
  //            link.click();
  //            document.body.removeChild(link);
  //          })
  //        );
  //      }
  //    })
  //  );
  //}

  const [outputdata, setoutputdata] = useState({
  });

  const [unit, setunit] = useState({
  });
  const [show, setShow] = useState(true);

  //// Using useEffect for single rendering
  //useEffect(() => {
  //  // Using fetch to fetch the api from 
  //  // flask server it will be redirected to proxy
  //  //console.log("count1 changed! =", count1);
  //  fetch(`${process.env.REACT_APP_FLASK_BASE_URL}/outputval`).then((res) =>
  //    res.json().then((outputdata) => {
  //      // Setting a data from api
  //      setoutputdata({
  //        output_value: outputdata.output_prediction
  //      });
  //      setunit({
  //        unit_value: outputdata.unit_prediction
  //      });
  //    })
  //  );
  //}, [count1], []);

  return (
    <>
      <body>
        <div className="background-Image">
          <div className='page-header'>
            <h2>Output Predictions</h2>
          </div>

          <div className="left">
            <h6><u>Instructions:</u></h6>
            <p><b>1.</b> Set input values.</p>
            <p><b>2.</b> Click on “Predict Output".</p>
            <br /><br /><br />
            <p><b>• Upload .pkl file for predictions.</b> </p>
            <input type='file' name='file' accept='.pkl' onChange={handleUpload} required />

          </div>

          <div className="prediction-fields">

            <form onSubmit={submit}>
              {formFields.map((form, index) => {

                return (
                  <div className='prediction_sliders'>
                    <div key={index}>
                      {form.name}
                      <br />
                      <input
                        name={form.name}
                        type='range'
                        min={form.min}
                        max={form.max}
                        step={(form.max - form.min) / 50}
                        placeholder='Input Value'
                        onChange={event => handleFormChange(event, index)}
                        value={form.value}
                      />
                      {parseFloat(form.value).toFixed(2)}
                    </div>
                  </div>
                )
              })}

            </form>

            <br />
            <button type='reset' onClick={handleReset}>Reset values</button>
            <Button variant='primary' size="md" onClick={submit}>Predict Output</Button>


            <div className='prediction-update-button'>
              <p>Predicted Value = {outputdata.output_value} {unit.unit_value}</p>

            </div>
          </div>
        </div>
      </body>
    </>

  );
}

export default Prediction;