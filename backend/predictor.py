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


def predictor_func(input_values):
    train_model_path = os.path.join(os.getcwd(), 'assests', "gam_model.pkl")

    # load model
    with open(train_model_path, 'rb') as f:
        gam = pickle.load(f)

    print("input values to be predicted = ", input_values)
    print(type(input_values[0]))
    output_prediction = gam.predict([input_values])
    output_prediction = round(output_prediction[0],3)
    #print("output_prediction = ", output_prediction)

    return output_prediction


if __name__ == "__main__":
    main()
