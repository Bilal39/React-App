# Import flask and datetime module for showing date and time
#from crypt import methods
from flask import Flask
from flask_cors import CORS
import datetime
from flask import request
from werkzeug.utils import secure_filename
import os
from train_model import model_training
from predictor import predictor_func
from input_config import input_manger
from empty_plots import empty_plots
import json
from pprint import pprint
import numpy as np

# Adding default plots
empty_plots()

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app)

# To store results
results_dict = {}
output_result = {}
output_result["output_value"] = "---"
output_result['unit_value'] = "----"
training_status = {'mstatus': "in progress .."}

# Create a directory in a known location to save files to.
uploads_dir = os.path.join(app.instance_path, 'uploads')
input_nbr_path = os.path.join(os.getcwd(), 'assests', "nbr_of_inputs.ini") 
predictor_default_value_path = os.path.join(os.getcwd(), 'assests', "predictor_default_value.ini")

# Truncating file to reset default values
with open(predictor_default_value_path, 'r+') as f:
    f.truncate(0)


@app.route('/parameter',  methods={"POST"})
def getting_form():
    training_status['mstatus'] = 'in progress ..'
    input_parameters_path = os.path.join(
        os.getcwd(), 'assests', "input_parameters.ini")
    payload = json.loads(request.data)
    #print("Payload = ")
    # pprint(payload)

    with open(input_parameters_path, 'w+') as f:
        f.write(str(payload['lambdaval']))
        f.write('\n')
        f.write(str(payload['splines']))
        f.write('\n')
        f.write(str(payload['splitpercent']))
        f.write('\n')
        f.write(str(payload['bin']))
        f.write('\n')
        f.write(str(payload['shuffledata']))

    return 'ok'


@app.route('/upload',  methods=["POST"])
def upload_file():
    file1 = request.files.get("file")
    file_path = "object_file.txt"
    file1.save(secure_filename(file_path))
    # Truncating file to reset default values
    with open(predictor_default_value_path, 'r+') as f:
        f.truncate(0)
    train_r_squared, test_r_squared = model_training(file_path)
    results_dict['train_r_squared'] = float(train_r_squared)
    results_dict['test_r_squared'] = float(test_r_squared)
    training_status['mstatus'] = "Done!"

    return {
        "training_r_squared_value": train_r_squared,
        "testing_r_squared_value": test_r_squared,
        "mstatus": "Done!"
    }


@app.route('/training_status',  methods=["GET"])
def train_status():

    # Returning an api for showing in reactjs
    return {
        "mstatus": training_status['mstatus']
    }


@app.route('/results_update')
def results():

    # Returning an api for showing in reactjs
    return {
        "training_r_squared_value": results_dict['train_r_squared'],
        "testing_r_squared_value": results_dict['test_r_squared'],
        "mstatus": training_status['mstatus']
    }


@app.route("/input_config", methods={"GET"})
def input_config():
    # Reading User Input Parameters
    with open(input_nbr_path) as f:
        lines = f.readlines()
        for line in lines:
            inputnumber = str(line)
    input_dict = input_manger()

    return input_dict


@app.route('/predict',  methods={"POST"})
def get_prediction():
    input_values = []
    payload = json.loads(request.data)
    #print("\n input data for predictions = ")
    # print(payload)
    for item in payload:
        #print("data values got at backend = ", item)
        input_values.append(item['value'])
        #input_values.append(np.array(list(item.values())).astype(float)[0])
    print("input values = ", input_values)
    
    # Writing prediction input values
    with open(predictor_default_value_path, 'w+') as f:
        for element in input_values:
            f.write(str(element))
            f.write('\n')

    output_prediction = predictor_func(input_values)
    #print("output_prediction = ", output_prediction[0], "\n")
    output_result['output_value'] = output_prediction

    # Reading User Input Parameters
    with open("object_file.txt", encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break

    #print('Output unit is = ', unit)
    output_result['unit_value'] = unit

    return {"output_prediction": output_prediction}


@app.route('/outputval')
def output_value():
    
    return {
        "output_prediction": output_result['output_value'],
        "unit_prediction": output_result['unit_value']
    }


# Running app
if __name__ == '__main__':
    app.run(debug=True)
