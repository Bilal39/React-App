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


def model_training(file_name):
    nbr_input_track_file_path = os.path.join(os.getcwd(), 'assests', "nbr_of_inputs.ini")
    input_parameters_path = os.path.join(os.getcwd(), 'assests', "input_parameters.ini")
    model_saving_path = os.path.join(os.getcwd(), 'assests', "gam_model.pkl")
    frontend_model_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "gam_model.pkl" )
    histogram_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "images","histogram.png" )
    training_plot_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "images", "training_plot.png" )
    testing_plot_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "images", "testing_plot.png" )
    smooth_func_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "images", "smooth_func.png" )

    # Reading the data
    data_df = pd.read_csv(file_name, header=1)
    #print("Data frame before removing header = ", data_df)
    #data_df = data_df.iloc[0:,:]
    #print("Dataframe after removing header = ", data_df)
    # Splitting Data into Inputs and Outputs 
    x = data_df.iloc[:,:-1]
    y = data_df.iloc[:,-1]

    # Reading User Input Parameters
    with open(input_parameters_path) as f:
        lines = f.readlines()
        counter = 0
        flag = 0
        for line in lines:
            if counter == 0:
                lambdaval = int(line)
                counter += 1
            elif counter==1:
                splines = int(line)
                counter += 1
            elif counter == 2:
                training_percent = int(line)
                testing_percent = (100 - training_percent)/100
                counter += 1
            elif counter == 3:
                bin = int(line)
                counter += 1 
            elif counter == 4:
                shufflestatus = str(line)   
                if shufflestatus == "True":
                   shufflestatus = bool("Something")
                else:
                    shufflestatus = bool("")

    # Splitting Data Into training and testing data
    X_train, X_test, y_train, y_test = train_test_split( x, y, test_size=testing_percent, shuffle= shufflestatus)
    x_train = X_train.values
    x_test = X_test.values

    # Saving number of inputs in a file
    with open(nbr_input_track_file_path, 'w+') as f:
        f.write(str(len(x.columns)))

    # Setting Lambda Penalization Term
    input_column_nbr = len(x.columns)
    lams = np.random.rand(100,input_column_nbr)
    lams = lams * 5 - lambdaval
    lams = np.exp(lams)

    # Fitting Gam model
    gam = LinearGAM(n_splines=4).gridsearch(x_train, y_train, lam=lams)
    #gam.summary() # printing summary of the model

    # Plotting Smooth Function graphs
    titles = data_df.columns[0:input_column_nbr]
    plt.switch_backend('agg')
    plt.figure()
    fig, axs = plt.subplots(1,input_column_nbr,figsize=(40, 7))

    for i, ax in enumerate(axs):
        XX = gam.generate_X_grid(term=i)
        ax.plot(XX[:, i], gam.partial_dependence(term=i, X=XX), label= "Fitted Smooth Function")
        ax.plot(XX[:, i], gam.partial_dependence(term=i, X=XX, width=.95)[1], c='r', ls='--', label="Confidence Interval")
        print(gam.partial_dependence(term=i, X=XX))
        plt.plot(XX[:, i],gam.partial_dependence(term=i, X=XX) )
        plt.show()
        print("length is = ", len(XX[:, i]))
        print("===================== new plot after this ================")
        

        if i == 0:
            ax.set_ylim(-30,30)
        ax.set_title("Smooth Function for '{}'".format(titles[i]))
        ax.grid()
        ax.legend(loc='best')
        ax.set_xlabel(titles[i])
        ax.set_ylabel("S({})".format(titles[i]))

    


    return 1


model_training("sample data.csv")