### Importing Libraries
# Standard Library Imports
import os
import json

# Third-party Library Imports
from flask import Flask, send_file, request
from flask_cors import CORS
import pandas as pd
import joblib

# Local Module Imports
from train_model import model_training
from extrema import pso_execution
from correlation_data import correlation_among_data
from predictor import predictor_func
from input_config import input_manger


# Initializing flask app
app = Flask(__name__)
CORS(app)

# Backend replicas
backend_replicas = 8

# To store results
user_data_file = {}
user_tracking = []

# Create a directory in a known location to save files to.
uploads_dir = os.path.join(app.instance_path, 'uploads')

trained_models_path = os.path.join(
            os.getcwd(), "assests", "trained_models")

data_files_path = os.path.join(
            os.getcwd(), "assests", "data_files")

data_files_cust_path = os.path.join(
            os.getcwd(), "assests", "data_files_customized")

    
def delete_extra_files(folder_path, max_file_count):
    files = os.listdir(folder_path)

    # Sort files by creation time (oldest to newest)
    sorted_files = sorted(files, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))

    num_files_to_delete = len(sorted_files) - max_file_count
    print("num_files_to_delete = ", num_files_to_delete)

    if num_files_to_delete > 0:
        for i in range(num_files_to_delete):
            file_to_delete = os.path.join(folder_path, sorted_files[i])
            os.remove(file_to_delete)
            print(f"Deleted: {file_to_delete}")

# Function to get latest created file from a folder with specific suffix
def get_latest_file_with_suffix(folder_path, suffix):
    latest_file = None
    latest_creation_time = 0

    for file in os.listdir(folder_path):
        if file.endswith(suffix):
            file_path = os.path.join(folder_path, file)
            creation_time = os.path.getctime(file_path)

            if creation_time > latest_creation_time:
                latest_file = file_path
                latest_creation_time = creation_time

    return latest_file


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
        user_tracking.pop(0)

    user_data_file[user_id] = os.path.splitext(file1.filename)[0]
    
    # Reading the data
    data_df = pd.read_csv(file_path, header=1)

    # Defining output values
    y = data_df.iloc[:, -1]

    # Getting Histogram Data
    histogram_data = {}
    histogram_data['data']= y.tolist()
    histogram_data['bin_size']= int(15)

    # Getting Column names
    columns_names = data_df.columns.tolist()

    return {'data_histogram':[histogram_data], 'data_col_names':columns_names}


@app.route('/cor_data',  methods=["POST"])
def correlation_data():
    checked_array = json.loads(request.data)['checkedstate']
    user_id = json.loads(request.data)['userId']
    
    file_path = os.path.join(data_files_path, "{}.txt".format(user_id))
    
    # Calling funtion for column names and correlation data
    corr_data_list = correlation_among_data(
        file_path, checked_array)

    # Returning an api for showing in reactjs
    return {'data':corr_data_list}

@app.route('/upload',  methods=["POST"])
def upload_file():
    payload = json.loads(request.data)['checkedState']
    payload_parameter = json.loads(request.data)['parameters']
    user_id = json.loads(request.data)['userId']
    fileName, file_extension = os.path.splitext(json.loads(request.data)['fileName'])

    file_path = os.path.join(data_files_path, "{}.txt".format(user_id))
    
    # Reading the data
    data_df = pd.read_csv(file_path, header=1)
    col_names = data_df.columns.tolist()

    for index, element in enumerate(payload):
        if element == False:
            data_df = data_df.drop(columns=[col_names[index]])
        else:
            pass

    customized_file_path = os.path.join(data_files_cust_path, "{}.txt".format(user_id))
    data_df.to_csv(customized_file_path, sep=",", index=False)
    
    delete_extra_files(trained_models_path, backend_replicas)

    graph_data_list, smooth_funct_list = model_training(
        customized_file_path, fileName, payload_parameter)

    return {"mstatus" : "Done!",
            "graph_data":graph_data_list,
            "smooth_func_data":smooth_funct_list
            }

@app.route('/saved_model',  methods=["POST"])
def transfer_trained_model():
    user_id = json.loads(request.data)
    saved_model = get_latest_file_with_suffix(trained_models_path, "_{}.pkl".format(user_id))

    return send_file(saved_model, as_attachment=True)


@app.route('/boundries_data',  methods=["POST"])
def low_up_boundries():
    payload = json.loads(request.data)['temp_object']
    user_id = json.loads(request.data)['userId']
    
    max_min_list = pso_execution(payload,user_id)

    return {'mstatus':"Done!", 'data':max_min_list}


@app.route("/input_config", methods={"POST"})
def input_config():
    user_id = json.loads(request.data)

    customized_file_path = os.path.join(data_files_cust_path, "{}.txt".format(user_id))
    input_dict = input_manger(customized_file_path)

    return input_dict

@app.route('/pre_trained_model', methods=['POST'])
def receiving_pre_trained_model():
    file1 = request.files.get("file")
    user_id = request.form.get('userId')

    file1.save(os.path.join(trained_models_path, "{}_{}.pkl".format(os.path.splitext(file1.filename)[0],user_id)))
    # load the model
    model = joblib.load(file1)

    input_data_list = []
    for index, col_name in enumerate(model.input_info['names']):
        temp_dict = {}
        temp_dict['name'] = col_name
        temp_dict['max'] = model.input_info['max'][index]
        temp_dict['min'] = model.input_info['min'][index]
        temp_dict['value'] = round(
            (model.input_info['max'][index]+model.input_info['min'][index])/2, 2)
        input_data_list.append(temp_dict)

    return {'data':input_data_list}


@app.route('/predict',  methods={"POST"})
def get_prediction():
    input_values = []
    payload = json.loads(request.data)['formFields']
    user_id = json.loads(request.data)['userId']

    for item in payload:
        input_values.append(item['value'])

    saved_model_path = get_latest_file_with_suffix(trained_models_path, "_{}.pkl".format(user_id))
    model = joblib.load(saved_model_path)
    output_prediction = predictor_func(input_values, saved_model_path)

    return {
        "output_prediction": output_prediction,
        "unit_prediction": model.input_info['unit']
    }
    

# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)