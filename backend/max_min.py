from flask import Flask, render_template, url_for, request
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
from time import sleep
from pathlib import Path
import os
import pandas as pd
from itertools import combinations
import copy
import pickle

def maxima_minima(file_name):

    # Reading the data
    data_df = pd.read_csv(file_name)

    # Assigning trained model path
    train_model_path = os.path.join(os.getcwd(), 'assests', "gam_model.pkl")

    # load model
    with open(train_model_path, 'rb') as f:
        gam = pickle.load(f)

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    #print(x.columns.tolist())
    col_str = "Input values follows following order:"
    for element in x.columns:
        col_str += " '"
        col_str += element
        col_str += "', "
    str1 = col_str[:-2]
    #print("col string = ", col_str)

    # Initiating list for storing values
    feat_ranges = []
    feat_range_steps = []
    min_val_list = []
    max_val_list = []
    for n, heading in enumerate(x.columns):
            temp_dict = {}
            var_name = heading
            min_val = round(x.iloc[:, n].min(),2)
            max_val = round(x.iloc[:, n].max(),2)
            min_val_list.append(min_val)
            max_val_list.append(max_val)
            feat_ranges.append(round(max_val-min_val,2))
            
    for nbr in feat_ranges:
        #print("nbr = ", nbr )
        #step = (nbr*len(x.columns))/(len(x.columns)*100)
        step = nbr/70
        feat_range_steps.append(step)
    #print("min_val_list = ", min_val_list)
    #print("max_val_list = ",max_val_list)
    #print("ranges = ", feat_ranges)
    #print("steps = ",feat_range_steps)

    nested_loop_length = 10
    flag = 0 
    local_counter = 0
    prediction_list = []
    combination_predictions = {}

    def nested_loop( nested_loop_length,feat_val,step_size,flag,updated_feat_val=0 ):
        if flag == 0:
            #print("entered flag 0")
            updated_feat_val = copy.deepcopy(feat_val)
            flag = 1
        if nested_loop_length>=1:
            for index,element in enumerate(feat_val):
                updated_feat_val[index] = round(updated_feat_val[index]+ step_size[index],2)
                #print("array = ",updated_feat_val)
                #print("step_size = ", step_size)
                #print("max(x[x.columns[0]]) = ", max(x[x.columns[0]]))
                if updated_feat_val[0] >= (max(x[x.columns[0]])-(step_size[0])):
                    break
                output_prediction = round(gam.predict([updated_feat_val])[0],2)
                combination_predictions[output_prediction] = copy.deepcopy(updated_feat_val)
                #print(" Output prediction = ", output_prediction)
                prediction_list.append(output_prediction)
                nested_loop(nested_loop_length-1,feat_val,step_size,flag, updated_feat_val)
        else:
            pass
        return combination_predictions,prediction_list
    predictions_dict, prediction_list = nested_loop(nested_loop_length, min_val_list, feat_range_steps,flag, updated_feat_val=0)
    max_pred_val = max(prediction_list) 
    min_pred_val = min(prediction_list) 
    #print(max_pred_val, "array = ", predictions_dict[max_pred_val])
    #print(min_pred_val,"array = ", predictions_dict[min_pred_val])

    # Reading User Input Parameters
    with open("object_file.txt", encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break

    #str2 = "Input values for Max Output = {} , O/P = {}  ".format(predictions_dict[max_pred_val],max_pred_val)
    str2 = "Max Output Value = {} {}, Based on Input values = {}".format(max_pred_val,unit, predictions_dict[max_pred_val])
    str3 = "Min Output Value = {} {}, Based on Input values = {}".format(min_pred_val,unit, predictions_dict[min_pred_val])
    #str3 = "Input values for Min Output = {} , O/P = {}  ".format(predictions_dict[min_pred_val],min_pred_val)
    #print(str2) 
    #print(str3) 
    str_list = []
    temp_dict = {}
    temp_dict['str1'] = str1
    temp_dict['str2'] = str2
    temp_dict['str3'] = str3
    str_list.append(temp_dict)
    
    return str_list

if __name__ == "__main__":
    main()