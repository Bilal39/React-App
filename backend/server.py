# Importing Libraries
from flask import Flask
from flask_cors import CORS
from flask import request
from werkzeug.utils import secure_filename
import os
from train_model import model_training
from correlation_data import correlation_among_data
from predictor import predictor_func
from input_config import input_manger
import json
import pandas as pd



# Initializing flask app
app = Flask(__name__)
CORS(app)

# To store results
columns_names = {}
corr_data = {}
results_dict = {}
output_result = {}
graph_data_dict = {}
smooth_func_dict = {}
histogram_data = {}
max_min_dict = {}
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
    #print(payload)

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
        f.write('\n')
        f.write(str(payload['psoparticles']))
        f.write('\n')
        f.write(str(payload['psoiterations']))

    return 'ok'

@app.route('/file_transfer',  methods=["POST"])
def getting_file_from_frontend():
    file1 = request.files.get("file")
    file_path = "object_file.txt"
    file1.save(secure_filename(file_path))

    # Reading the data
    data_df = pd.read_csv(file_path, header=1)
    # Splitting Data into Inputs
    x = data_df.iloc[:, :-1]
    # Getting Column names
    columns_names['data'] = data_df.columns.tolist()
    #print(columns_names)

    # Truncating file to reset default values
    with open(predictor_default_value_path, 'r+') as f:
        f.truncate(0)

    return "ok"

@app.route('/col_names')
def col_names_trans():

    # Returning an api for showing in reactjs
    return columns_names

@app.route('/data_for_corr',  methods=["POST"])
def inputs_for_corr():
    #print("Inside inputs_for_corr!!!!")
    checked_array = json.loads(request.data)
    #print("checked_array = ", checked_array)
    file_path = "object_file.txt"

    # Calling funtion for column names and correlation data
    column_names, corr_data_list = correlation_among_data(file_path,checked_array)
    #print("These are the column names = ", column_names)
    #print("\nThis is the corr_data_list = ", corr_data_list)

    # Storing column names in a dict to fetch easily
    columns_names['data'] = column_names    
    corr_data['data'] = corr_data_list

    #print(payload)

    # Returning an api for showing in reactjs
    return "OK"

@app.route('/cor_data')
def correlation_data():

    # Returning an api for showing in reactjs
    return corr_data

@app.route('/upload',  methods=["POST"])
def upload_file():
    payload = json.loads(request.data)

    file_name = "object_file.txt"
    # Reading the data
    data_df = pd.read_csv(file_name, header=1)
    col_names = data_df.columns.tolist()

    for index, element in enumerate(payload):
        if element == False:
            data_df = data_df.drop(columns=[col_names[index]])
        else:
            pass

    updated_file = "updated_object_file.txt"
    data_df.to_csv(updated_file, sep = ",", index = False)
    
    # Running modules
    train_r_squared, test_r_squared, graph_data_list, smooth_funct_list, output_data_list, max_min_list = model_training(updated_file)
    #max_min_list = maxima_minima(updated_file)
    #print("Max_Min_list = ", max_min_list)

    # Updating data to fetch
    max_min_dict['data'] = max_min_list
    graph_data_dict["graph_data"] = graph_data_list
    smooth_func_dict['data'] = smooth_funct_list
    histogram_data['data'] = output_data_list
    results_dict['train_r_squared'] = float(train_r_squared)
    results_dict['test_r_squared'] = float(test_r_squared)
    #print("chaing status to done now !!!!!!!!!!!")
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
    return graph_data_dict

@app.route('/smooth_func_data')
def smooth_func_data_points():

    # Returning an api for showing in reactjs
    return smooth_func_dict

@app.route('/histogram_data')
def histogram_data_to_fetch():

    # Returning an api for showing in reactjs
    return histogram_data

@app.route('/max_min_data')
def maxima_minima_data():

    # Returning an api for showing in reactjs
    return max_min_dict

@app.route("/update_data_file", methods={"POST"})
def update_user_data_file():
    payload = json.loads(request.data)

    file_name = "object_file.txt"
    # Reading the data
    data_df = pd.read_csv(file_name, header=1)
    col_names = data_df.columns.tolist()

    for index, element in enumerate(payload):
        if element == False:
            data_df = data_df.drop(columns=[col_names[index]])
        else:
            pass

    updated_file = "updated_object_file.txt"
    data_df.to_csv(updated_file, sep = ",", index = False)

    return "ok"

@app.route("/input_config", methods={"GET"})
def input_config():
    # Reading User Input Parameters
    #with open(input_nbr_path) as f:
    #    lines = f.readlines()
    #    for line in lines:
    #        inputnumber = str(line)
    input_dict = input_manger()
    #print("This is Input dict ..... = ", input_dict)

    return input_dict


@app.route('/predict',  methods={"POST"})
def get_prediction():
    input_values = []
    payload = json.loads(request.data)

    # print(payload)
    for item in payload:
        input_values.append(item['value'])
    
    # Writing prediction input values
    with open(predictor_default_value_path, 'w+') as f:
        for element in input_values:
            f.write(str(element))
            f.write('\n')

    output_prediction = predictor_func(input_values)
    output_result['output_value'] = output_prediction

    # Reading User Input Parameters
    with open("object_file.txt", encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break

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
    app.run(host='0.0.0.0', debug=True)
