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
from file_manager import delete_extra_files, get_latest_file_with_suffix


# Initializing flask app
app = Flask(__name__)
CORS(app)

# Backend replicas (to save nbr of data files & trained models)
backend_replicas = 16

# To store results (to remove stored datafiles & models)
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


@app.route('/file_transfer',  methods=["POST"])
def getting_file_from_frontend():
    ### this function is receivng user's datafile and responsible for histogram plot 
    # Receiving data from frontend
    user_id = request.form['userId']
    file1 = request.files.get("file")
    
    # Saving data file temporary
    file_path = os.path.join(data_files_path, "{}.txt".format(user_id))
    file1.save(file_path)
    
    # to track users files in the backend
    if user_id not in user_tracking:
        user_tracking.append(user_id)
    
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
    ### Data for correlation is generated in this function 
    # Receiving data from frontend
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
    ### Model is trained in this function
    # Receiving data from frontend
    payload = json.loads(request.data)['checkedState']
    payload_parameter = json.loads(request.data)['parameters']
    user_id = json.loads(request.data)['userId']
    fileName, file_extension = os.path.splitext(json.loads(request.data)['fileName'])

    # getting path of user's data file
    file_path = os.path.join(data_files_path, "{}.txt".format(user_id))
    
    # Reading the data
    data_df = pd.read_csv(file_path, header=1)
    col_names = data_df.columns.tolist()

    # Dropping columns if not select by user
    for index, element in enumerate(payload):
        if element == False:
            data_df = data_df.drop(columns=[col_names[index]])
        else:
            pass

    # Saving updated data file
    customized_file_path = os.path.join(data_files_cust_path, "{}.txt".format(user_id))
    data_df.to_csv(customized_file_path, sep=",", index=False)
    
    # Deleting files if qouta limit is exceeded
    delete_extra_files(trained_models_path, backend_replicas)

    # Training model
    graph_data_list, smooth_funct_list = model_training(
        user_id, fileName, payload_parameter)

    return {"mstatus" : "Done!",
            "graph_data":graph_data_list,
            "smooth_func_data":smooth_funct_list
            }

@app.route('/saved_model',  methods=["POST"])
def transfer_trained_model():
    ### This function is sharing the newly trained model to the user to download
    # Receiving data from frontend
    user_id = json.loads(request.data)
    saved_model = get_latest_file_with_suffix(trained_models_path, "_{}.pkl".format(user_id), pretrained_flag = 0)

    return send_file(saved_model, as_attachment=True)


@app.route('/boundries_data',  methods=["POST"])
def low_up_boundries():
    ### this function is responsible for finding minima and maxima
    # Receiving data from frontend
    payload = json.loads(request.data)['temp_object']
    user_id = json.loads(request.data)['userId']
    pretrained_flag = json.loads(request.data)['pretrainedFlag']
    
    model_saved_path = get_latest_file_with_suffix(trained_models_path, "_{}.pkl".format(user_id), pretrained_flag)
    # Running pso
    max_min_list = pso_execution(payload,user_id, model_saved_path)

    return {'mstatus':"Done!", 'data':max_min_list}


@app.route("/input_config", methods={"POST"})
def input_config():
    ### This function is responsible for extracting data such as inputs names, their ranges etc from user file
    # Receiving data from frontend
    user_id = json.loads(request.data)

    customized_file_path = os.path.join(data_files_cust_path, "{}.txt".format(user_id))
    input_dict = input_manger(customized_file_path)

    return input_dict

@app.route('/pre_trained_model', methods=['POST'])
def receiving_pre_trained_model():
    ### This function is responsible for extracting data such as inputs names, their ranges etc from pretrained model
    # Receiving data from frontend
    file1 = request.files.get("file")
    user_id = request.form.get('userId')

    # load the model
    file1.save(os.path.join(trained_models_path, "{}_usr_mdl_{}.pkl".format(os.path.splitext(file1.filename)[0],user_id)))
    model = joblib.load(file1)

    # Extracting name and ranges of values from the the customized trained model
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
    ### This function is responsible for predicting values based on user inputs
    input_values = []
    # Receiving data from frontend
    payload = json.loads(request.data)['formFields']
    user_id = json.loads(request.data)['userId']
    pretrained_flag = json.loads(request.data)['pretrainedFlag']

    for item in payload:
        input_values.append(item['value'])

    #loading the model
    saved_model_path = get_latest_file_with_suffix(trained_models_path, "_{}.pkl".format(user_id), pretrained_flag)
    model = joblib.load(saved_model_path)
    
    # Predicting values
    output_prediction = predictor_func(input_values, saved_model_path)

    return {
        "output_prediction": output_prediction,
        "unit_prediction": model.input_info['unit']
    }
    

# Running app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)