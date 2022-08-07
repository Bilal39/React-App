from flask import Flask, render_template, url_for, request
from werkzeug.utils import secure_filename
import pandas as pd
import matplotlib.pyplot as plt
from time import sleep
from pathlib import Path
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from pygam import LinearGAM
import pickle
import pandas as pd
import csv


def input_manger():
    input_data_list = []
    input_dict = {}
    input_nbr_path = os.path.join(os.getcwd(), 'assests', "nbr_of_inputs.ini")

    print("Running Input Config")

    with open(input_nbr_path) as f:
        lines = f.readlines()
        # print('lines', lines)
        for line in lines:
<<<<<<< HEAD
            inputnumber = int(line)
=======
            # print('line', line)
            inputnumber = int(line)

    # print('inputnumber', inputnumber, type(inputnumber))
    input_dict["columnsCount"] = inputnumber
>>>>>>> 1b317f6719ec446f074575e02186c70dcb7be555

    # Reading the data
    data_df = pd.read_csv("object_file.txt", header=1)
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    for n in range(len(x.columns)):
        temp_dict = {}
        var_name = "col{}".format(n+1)
<<<<<<< HEAD

        min_val = x.iloc[:, n].min()
        max_val = x.iloc[:, n].max()

        temp_dict['name'] = var_name
        temp_dict['max'] = max_val.item()
        temp_dict['min'] = min_val.item()
        temp_dict['value'] = round((max_val.item()+min_val.item())/2, 2)
        input_data_list.append(temp_dict)

    input_dict["data"] = input_data_list
    print('input_dict', input_dict)
=======
        #print("column = ",n)
        min_val = x.iloc[:, n].min()
        max_val = x.iloc[:, n].max()
        # print("min value = ", min_val, type(min_val), min_val.item(), type(min_val.item()))
        # print("max value = ", max_val, type(min_val), max_val.item(), type(max_val.item()))
        min_max_dict[var_name] = [min_val.item(), max_val.item()]

    input_dict["columns"] = min_max_dict
    print('input_dict', input_dict, type(input_dict))
>>>>>>> 1b317f6719ec446f074575e02186c70dcb7be555
    return input_dict

#input_dict = input_manger()
# print(input_dict)


if __name__ == "__main__":
    main()
