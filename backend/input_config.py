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
    print("Running Input COnfig")
    input_specs = {}
    # Reading the data
    data_df = pd.read_csv("object_file.txt", header=1)
    x = data_df.iloc[:,:-1]
    y = data_df.iloc[:,-1]
    input_dict ={}

    for n in  range(len(x.columns)):
        var_name = "column{}".format(n+1)
        #print("column = ",n)
        min_val = x.iloc[:,n].min() 
        max_val = x.iloc[:,n].max() 
        #print("min value = ", min_val)
        #print("max value = ", max_val)
        input_dict[var_name] = [min_val,max_val]
        
    return input_dict

##input_dict = input_manger()
##print(input_dict)

if __name__ == "__main__":
    main()