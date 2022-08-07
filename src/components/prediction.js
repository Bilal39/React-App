import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function Prediction() {
  const [formFields, setFormFields] = useState([]);
  const [count1, setCount1] = useState(0);
<<<<<<< HEAD
  const inputfields = {};

  useEffect(() => {
    (async () => {
      await fetch('/input_config').then((res) =>
        res.json().then((data) => {
          console.log(data);


          // console.log("Here we go = ", key, arr, obj)
          console.log("My exp about to start")
          for (var key in data) {
            var arr = data[key];
            console.log("Key = ", key)
            //console.log("arr = ", arr)
            for (var keyinside in arr) {
              var arrinside = arr[keyinside]
              console.log(keyinside, "=", arrinside)
              //console.log("all together = ", key,keyinside,arrinside)
              //const [keyinside] = arrinside;
              inputfields.keyinside = arrinside
            }
          }
          console.log("Here is the inputfield = ", inputfields)
          /*
            1. Console the real data from line 12.
            2. For example, sample data looks like:
              {
                columnsCount: 4,
                columns: {
                  col1: [min, max],
                  col2: [min, max],
                  col3: [min, max],
                }
              }
            3. At line 27 place the data accordingly.
          */
          setFormFields(
            Array.from({ length: data.columnsCount }, () => ({ name: "" }))
          );
        })
      );
=======
  console.log('formFields', formFields)
  useEffect(() => {
    (async () => {
      await fetch('/input_config').then((res) => 
        res.json().then((data)=>{
					console.log('data', data);
					console.log('data.columnsCount', data.columnsCount)
					console.log('data.columns', data.columns)
          // console.log(Object.entries(data.columns))
          // const formattedForm = []
          // Object.entries(data.columns).forEach((ele, key)=>{
          //   console.log('########', ele, key)
          //   formattedForm.append()
          // })

          /*
            - I want the following data in response in this format.
            - Donot require columnCounts, and other thing. Just send this array
          */
          const ass = [
            {'name': 'col1', 'max': 60, 'min': 10, value: 0},
            {'name': 'col2', 'max': 50, 'min': 20, value: 0},
            {'name': 'col3', 'max': 40, 'min': 30, value: 0},
            {'name': 'col4', 'max': 30, 'min': 10, value: 0},
            {'name': 'col5', 'max': 20, 'min': 10, value: 0},
            {'name': 'col6', 'max': 10, 'min': 5, value: 0}
          ]
          setFormFields(
						Array.from(ass)
					);
      })
    );
>>>>>>> 1b317f6719ec446f074575e02186c70dcb7be555
    })();
  }, [count1]);


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
    console.log("count1 changed!");
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
                <div key={index}>
                  <input
                    // type="number"
                    name={form.name}
                    type='range'
                    min={form.min}
                    max={form.max}
                    placeholder='Input Value'
                    onChange={event => handleFormChange(event, index)}
                    value={form.value}
                  />
                  {form.value}
                  <Button variant='secondary' size="sm" onClick={() => removeFields(index)}>Remove</Button>
                </div>
              )
            })}

          </form>


          <Button variant='secondary' size="md" onClick={addFields}>Add More...</Button>
          <br />
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
