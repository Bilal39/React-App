import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function Prediction() {
  const [formFields, setFormFields] = useState([]);
  const [count1, setCount1] = useState(0);
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
    })();
  }, [count1]);


  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
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
              return (
                <div key={index}>
                  <input
                    type="number"
                    name='name'
                    placeholder='Input Value'
                    onChange={event => handleFormChange(event, index)}
                    value={form.name}
                  />
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