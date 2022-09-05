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

file_name = "object_file.txt"

# Reading the data
data_df = pd.read_csv(file_name, header=1)

criteria = [False, True, True, True, False]
col_names = data_df.columns.tolist()
print("before dropping \n", data_df.head())

for index, element in enumerate(criteria):
    if element == False:
        col_to_drop = col_names[index]
        data_df = data_df.drop(columns=[col_names[index]])
    else:
        pass

data_df.to_csv("updated_object_file.txt", sep = ",", index = False)

#print("criteria = ", criteria[1])
#print("col_names = ", col_names)

print("after dropping")
print(data_df.head())
#print(x.columns)
#x = x.drop(columns=['Other metal Loading%'])
##x = x.drop('Other metal Loading%')
#print("After dropping !!!!!!!!!!!")
#print(x.head())
#print(x.columns)
