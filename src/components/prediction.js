
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function Prediction() {
  const [formFields, setFormFields] = useState([]);
  const [count1, setCount1] = useState(0);
  console.log('formFields', formFields)
  useEffect(() => {
    (async () => {
      await fetch('/input_config').then((res) =>
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
    })();
  }, [count1]);

  const handleReset = (event) => {
    let data = [...formFields];
    for (var i = 0, l = data.length; i < l; i++) {
      data[i]['value'] = ((data[i]['max'] + data[i]['min']) / 2).toFixed(2);
      setFormFields(data);
    }

  }
  const handleFormChange = (event, index) => {
    // console.log(event.target.value)
    let data = [...formFields];
    // console.log(data[index][event.target.name])
    data[index]['value'] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log(formFields)

    e.preventDefault();

    fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: JSON.stringify(formFields),
    }).then((response) => {
      response.json().then((body) => {
      });
    });
  }

  const addFields = () => {
    let object = {
      name: ''
    }

    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  const [outputdata, setdata] = useState({
  });

  const [unit, setunit] = useState({

  });
  const [show, setShow] = useState(true);

  // Using useEffect for single rendering
  useEffect(() => {
    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    console.log("count1 changed! =", count1);
    fetch("/outputval").then((res) =>
      res.json().then((outputdata) => {
        // Setting a data from api
        setdata({
          output_value: outputdata.output_prediction
        });
        setunit({
          unit_value: outputdata.unit_prediction
        });
      })
    );
  }, [count1], []);

  return (
    <>
      <div className="background-Image">
        <div className='page-header'>
          <h2>Output Predictions</h2>
        </div>

        <div className="left">
          <h6>Instructions:</h6>
          <p>1. Please enter the exact number of input values which were provided in the CSV file during the training.</p>
          <p>2. After entering the input values, click on the 'Submit Input Values' button.</p>
          <p>3. At last, click on the 'Check Result' button to get predicted value.</p>
          <p>Note: In order to download the trained model file which is used for predictions, click on 'Download Trained Model".</p>
        </div>

        <div className="prediction-fields">

          <form onSubmit={submit}>
            {formFields.map((form, index) => {
              // console.log('formFields', formFields)
              // console.log(`formformform${index}`, form);
              // console.log('form', form.name, typeof(form.name));
              return (
                <div className='prediction_sliders'>
                  <div key={index}>
                    {form.name}
                    <input
                      // type="number"
                      //className='prediction_sliders'
                      name={form.name}
                      type='range'
                      min={form.min}
                      max={form.max}
                      placeholder='Input Value'
                      onChange={event => handleFormChange(event, index)}
                      value={form.value}
                    />
                    {form.value}
                  </div>
                </div>
              )
            })}

          </form>

          <br />
          <button type='reset' onClick={handleReset}>Reset values</button>
          <Button variant='secondary' size="md" onClick={submit}>Submit Input Values</Button>

          <div className='prediction-update-button'>
            <Button variant="primary" size="lg" onClick={() => setCount1(count1 + 1)}>Check Result</Button>
            <p>Predicted Value = {outputdata.output_value} {unit.unit_value}</p>

          </div>

          <div>
            <a href={require("../assests/gam_model.pkl")} download="trained_model.pkl">Download Trained Model</a>
          </div>
        </div>
      </div>
    </>

  );
}

export default Prediction;