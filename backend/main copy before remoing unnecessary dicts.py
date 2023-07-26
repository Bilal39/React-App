# Importing Libraries
from flask import Flask, send_file
from flask_cors import CORS
from flask import request
from werkzeug.utils import secure_filename
import os
from train_model import model_training
from extrema import pso_execution
from correlation_data import correlation_among_data
from predictor import predictor_func
from input_config import input_manger
import json
import pandas as pd
import joblib


# Initializing flask app
app = Flask(__name__)
CORS(app)

# Backend replicas
backend_replicas = 8

# To store results
columns_names = {}
input_parameters_dict = {"data":""}
results_dict = {}
output_result = {}
graph_data_dict = {}
smooth_func_dict = {}
histogram_data = {}
max_min_dict = {}
limit_boundries_data = []
nbr_of_bins = {}
output_result["output_value"] = "---"
output_result['unit_value'] = "----"
training_status = {'mstatus': "in progress .."}
save_model_flag = 0
pretrained_model = {"flag": 0, "unit": "units"}
csv_file = {'base_name':'', "custom_name":"", "model_counter":0}
user_data_file = {}
user_tracking = []

# Create a directory in a known location to save files to.
uploads_dir = os.path.join(app.instance_path, 'uploads')
input_nbr_path = os.path.join(os.getcwd(), 'assests', "nbr_of_inputs.ini")
predictor_default_value_path = os.path.join(
    os.getcwd(), 'assests', "predictor_default_value.ini")
input_parameters_path = os.path.join(
    os.getcwd(), 'assests', "input_parameters.ini")

pre_trained_model_path = os.path.join(
    os.getcwd(), 'assests', "pre_trained_model.pkl")

trained_models_path = os.path.join(
            os.getcwd(), "assests", "trained_models")

data_files_path = os.path.join(
            os.getcwd(), "assests", "data_files")

# Truncating file to reset default values
with open(predictor_default_value_path, 'r+') as f:
    f.truncate(0)

@app.route('/file_transfer',  methods=["POST"])
def getting_file_from_frontend():
    user_id = request.form['userId']
    file1 = request.files.get("file")
    print("user_id = ", user_id)
    
    file_path = os.path.join(data_files_path, "{}.txt".format(user_id))
    file1.save(file_path)
    
    if user_id not in user_tracking:
        user_tracking.append(user_id)
    print("user_tracking = ", user_tracking)
    
    # Exceeding Qouta Limit (backend replicas)
    if len(user_tracking) > backend_replicas:
        del user_data_file[user_tracking[0]]
        del histogram_data[user_tracking[0]]
        del columns_names[user_tracking[0]]
        user_tracking.pop(0)


    #Get a list of all files in the folder
    files = os.listdir(trained_models_path)

     #Check if the number of files exceeds 5
    if len(files) > backend_replicas:
        print("deleting files since surpassed 1 files@@@@@@@")
        # Iterate over all the files in the folder and delete them
        for filename in files:
            file_path = os.path.join(trained_models_path, filename)
            os.remove(file_path)

    # Extracting name from user uploaded file
    if csv_file['base_name'] != os.path.splitext(file1.filename)[0]:
        csv_file['base_name'] = os.path.splitext(file1.filename)[0]
        csv_file["model_counter"] = 0

    user_data_file[user_id] = os.path.splitext(file1.filename)[0]
    print("user_data_file = ", user_data_file)
    
    # Reading the data
    data_df = pd.read_csv(file_path, header=1)

    # Defining output values
    y = data_df.iloc[:, -1]

    # Getting Histogram Data
    histogram_data[user_id] = {}
    histogram_data[user_id]['data']= y.tolist()
    histogram_data[user_id]['bin_size']= int(15)

    # Getting Column names
    columns_names[user_id] = {}
    columns_names[user_id] = data_df.columns.tolist()

    # Truncating file to reset default values
    with open(predictor_default_value_path, 'r+') as f:
        f.truncate(0)
    return {'data_histogram':[histogram_data[user_id]], 'data_col_names':columns_names[user_id]}

#@app.route('/histogram_data',  methods=["POST"])
#def histogram_data_to_fetch():
#    data = json.loads(request.data)
#    user_id = data.get('userId')
#    print("Histogram data URL !!! ")
#    
#    # Returning an api for showing in reactjs
#    return {'data':[histogram_data[user_id]]}

@app.route('/cor_data',  methods=["POST"])
def correlation_data():
    checked_array = json.loads(request.data)['checkedstate']
    user_id = json.loads(request.data)['userId']
    print("checked_array = ", checked_array)
    print("user_id = ", user_id)
    
    file_path = os.path.join(data_files_path, "{}.txt".format(user_id))
    
    # Calling funtion for column names and correlation data
    corr_data_list = correlation_among_data(
        file_path, checked_array)

    # Returning an api for showing in reactjs
    return {'data':corr_data_list}

@app.route('/parameter',  methods={"POST"})
def getting_form():
    training_status['mstatus'] = 'in progress ..'
    payload = json.loads(request.data)
    #print("Payload = ")
    print(payload)
    nbr_of_bins['bin'] = payload['bin']

    input_parameters_dict["data"] = payload

    #with open(input_parameters_path, 'w+') as f:
    #    f.write(str(payload['lambdaval']))
    #    f.write('\n')
    #    f.write(str(payload['splines']))
    #    f.write('\n')
    #    f.write(str(payload['splitpercent']))
    #    f.write('\n')
    #    f.write(str(payload['bin']))
    #    f.write('\n')
    #    f.write(str(payload['shuffledata']))

    return 'ok'










@app.route('/boundries_data',  methods=["POST"])
def low_up_boundries():
    training_status['mstatus'] = "in progress .."
    payload = json.loads(request.data)
    limit_boundries_data.append(payload)


    max_min_list = pso_execution(limit_boundries_data[-1],csv_file['custom_name'],pretrained_model["flag"])
    #print("MAX_MIN_List we are getting =", max_min_list)
    max_min_dict['data'] = max_min_list
    training_status['mstatus'] = "Done!"

    return "ok"


@app.route('/upload',  methods=["POST"])
def upload_file():
    training_status['mstatus'] = "in progress .."
    payload = json.loads(request.data)
    file_name = "object_file.txt"

    csv_file['custom_name'] = "{}_model_{}.pkl".format(csv_file['base_name'], csv_file['model_counter'])
    csv_file['model_counter'] = (csv_file['model_counter']+1) 

    # Reading the data
    data_df = pd.read_csv(file_name, header=1)
    col_names = data_df.columns.tolist()

    for index, element in enumerate(payload):
        if element == False:
            data_df = data_df.drop(columns=[col_names[index]])
        else:
            pass

    updated_file = "updated_object_file.txt"
    data_df.to_csv(updated_file, sep=",", index=False)

    train_r_squared, test_r_squared, graph_data_list, smooth_funct_list, save_model_flag = model_training(
        updated_file, csv_file['custom_name'], input_parameters_dict["data"])

    # Updating data to fetch
    graph_data_dict["graph_data"] = graph_data_list
    smooth_func_dict['data'] = smooth_funct_list
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
    data_df.to_csv(updated_file, sep=",", index=False)

    return "ok"


@app.route("/input_config", methods={"GET"})
def input_config():
    pretrained_model['flag'] = 0
    pretrained_model['unit'] = "units"
    input_dict = input_manger()

    return input_dict


@app.route('/predict',  methods={"POST"})
def get_prediction():
    input_values = []
    payload = json.loads(request.data)

    #print("payload = ", payload)
    for item in payload:
        input_values.append(item['value'])

    if pretrained_model["flag"] == 0:
        # Writing prediction input values
        with open(predictor_default_value_path, 'w+') as f:
            for element in input_values:
                f.write(str(element))
                f.write('\n')

        output_prediction = predictor_func(input_values, csv_file['custom_name'])

        # Reading User Input Parameters
        with open("object_file.txt", encoding='utf-8-sig') as f:
            lines = f.readlines()
            for line in lines:
                unit = str(line.split(',')[0])
                if unit == "Enter output unit":
                    unit = "units"
                break

    else:
        # load the model
        print("Input Dict before  =  ")
        model = joblib.load(os.path.join(
            os.getcwd(), "assests", "user_trained_model.pkl"))
        output_prediction = round(model.predict([input_values])[0], 3)
        unit = pretrained_model["unit"]

    output_result['output_value'] = output_prediction
    output_result['unit_value'] = unit

    return {
        "output_prediction": output_result['output_value'],
        "unit_prediction": output_result['unit_value']
    }

@app.route('/model_file_name')
def trained_model_name():

    # Returning an api for showing in reactjs
    return {"model_name":csv_file['custom_name']}

@app.route('/saved_model')
def transfer_trained_model():
    #path for trained model
    #print("csv_file['custom_name'] = ", csv_file['custom_name'])
    saved_model = os.path.join(os.getcwd(), 'assests', "trained_models", csv_file['custom_name'])
    
    #returning trained model
    return send_file(saved_model, as_attachment=True)


@app.route('/pre_trained_model', methods=['POST'])
def receiving_pre_trained_model():
    pretrained_model["flag"] = 1
    file1 = request.files.get("file")
    file1.save(os.path.join(os.getcwd(), "assests", "user_trained_model.pkl"))

    # load the model
    model = joblib.load(file1)

    input_dict = {}
    input_data_list = []
    for index, col_name in enumerate(model.input_info['names']):
        temp_dict = {}
        temp_dict['name'] = col_name
        temp_dict['max'] = model.input_info['max'][index]
        temp_dict['min'] = model.input_info['min'][index]
        temp_dict['value'] = round(
            (model.input_info['max'][index]+model.input_info['min'][index])/2, 2)
        input_data_list.append(temp_dict)

    pretrained_model["unit"] = model.input_info["unit"]

    input_dict["data"] = input_data_list
    #console.log("")

    return input_dict


# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
