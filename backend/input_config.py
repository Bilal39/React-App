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
        for line in lines:
            inputnumber = int(line)

    # Reading the data
    data_df = pd.read_csv("object_file.txt", header=1)
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    for n in range(len(x.columns)):
        temp_dict = {}
        var_name = "col{}".format(n+1)

        min_val = x.iloc[:, n].min()
        max_val = x.iloc[:, n].max()

        temp_dict['name'] = var_name
        temp_dict['max'] = max_val.item()
        temp_dict['min'] = min_val.item()
        temp_dict['value'] = round((max_val.item()+min_val.item())/2, 2)
        input_data_list.append(temp_dict)

    input_dict["data"] = input_data_list
    print('input_dict', input_dict)
    return input_dict

#input_dict = input_manger()
# print(input_dict)


if __name__ == "__main__":
    main()
