# Import flask and datetime module for showing date and time
from flask import Flask
from flask_cors import CORS
import datetime
from flask import request
from werkzeug.utils import secure_filename
import os
from train_model import model_training
from predictor import predictor_func
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
training_status = {'mstatus':"in progress .."}

# Create a directory in a known location to save files to.
uploads_dir = os.path.join(app.instance_path, 'uploads')


@app.route('/parameter',  methods={"POST"})
def getting_form():
	training_status['mstatus'] = 'in progress ..'
	input_parameters_path = os.path.join(os.getcwd(), 'assests', "input_parameters.ini")
	payload = json.loads(request.data)
	#print("Payload = ")
	#pprint(payload)

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
	#print(file1)
	#print("Above is printer python file")
	file1.save(secure_filename(file_path))

	train_r_squared,test_r_squared = model_training(file_path)
	results_dict['train_r_squared'] = float(train_r_squared)
	results_dict['test_r_squared'] = float(test_r_squared)
	training_status['mstatus'] = "Done!"

	return {
		"training_r_squared_value":train_r_squared,
		"testing_r_squared_value":test_r_squared,
		"mstatus":"Done!"
		}

@app.route('/training_status' ,  methods=["GET"])
def train_status():

	# Returning an api for showing in reactjs
	return {
		"mstatus":training_status['mstatus']
		}

# Route for seeing data
@app.route('/results_update')
def results():

	# Returning an api for showing in reactjs
	return {
		"training_r_squared_value":results_dict['train_r_squared'],
		"testing_r_squared_value":results_dict['test_r_squared'],
		"mstatus":training_status['mstatus']
		}


@app.route('/predict',  methods={"POST"})
def get_prediction():
	input_values = []
	payload = json.loads(request.data)
	#print("\n input data for predictions = ")
	#print(payload)
	for item in payload:
		input_values.append(np.array(list(item.values())).astype(float)[0])
	#print(input_values)
	output_prediction = predictor_func(input_values)
	#print("output_prediction = ", output_prediction[0], "\n")
	output_result['output_value'] = output_prediction
	
	# Reading User Input Parameters
	with open("object_file.txt",encoding='utf-8-sig') as f:
		lines = f.readlines()
		for line in lines:
			unit = str(line.split(',')[0])
			break
			
	print('Output unit is = ', unit)
	output_result['unit_value'] = unit

	return {"output_prediction" : output_prediction}

@app.route('/outputval')
def output_value():
	#print("Entering for getting output value !!!!!!!!!!!!!!")

	return {
		"output_prediction":output_result['output_value'],
		"unit_prediction": output_result['unit_value']
	}

# Running app
if __name__ == '__main__':
	app.run(debug=True)
