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
    nbr_input_track_file_path = os.path.join(
        os.getcwd(), 'assests', "nbr_of_inputs.ini")
    input_parameters_path = os.path.join(
        os.getcwd(), 'assests', "input_parameters.ini")
    model_saving_path = os.path.join(os.getcwd(), 'assests', "gam_model.pkl")
    frontend_model_path = os.path.join(os.path.dirname(
        os.getcwd()), "src", "assests", "gam_model.pkl")

    # initializing list and dictionaries
    final_data_list = []
    train_data_dict = {}
    test_data_dict = {}
    hist_dict = {}
    output_data_list = []
    smooth_funct_list = []
    lower_bound_list = []
    upper_bound_list = []

    # Reading the data
    data_df = pd.read_csv(file_name)

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    # Reading User Input Parameters
    with open(input_parameters_path) as f:
        lines = f.readlines()
        counter = 0
        flag = 0
        for line in lines:
            if counter == 0:
                lambdaval = int(line)
                counter += 1
            elif counter == 1:
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

    # preparing histogram data
    hist_dict['data'] = y.tolist()
    hist_dict['bin_size'] = bin
    output_data_list.append(hist_dict)

    # Splitting Data Into training and testing data
    X_train, X_test, y_train, y_test = train_test_split(
        x, y, test_size=testing_percent, shuffle=shufflestatus)
    x_train = X_train.values
    x_test = X_test.values

    # Saving number of inputs in a file
    with open(nbr_input_track_file_path, 'w+') as f:
        f.write(str(len(x.columns)))

    # Setting Lambda Penalization Term
    input_column_nbr = len(x.columns)
    lams = np.random.rand(100, input_column_nbr)
    lams = lams * 5 - lambdaval
    lams = np.exp(lams)

    # Fitting Gam model
    gam = LinearGAM(n_splines=splines).gridsearch(x_train, y_train, lam=lams)
    gam.summary()  # printing summary of the model

    # Plotting Smooth Function graphs
    titles = data_df.columns[0:input_column_nbr]
    plt.switch_backend('agg')
    plt.figure()
    fig, axs = plt.subplots(1, input_column_nbr, figsize=(40, 7))

    for i, ax in enumerate(axs):
        lower_bound_list = []
        upper_bound_list = []
        smooth_func_temp_dict = {}
        XX = gam.generate_X_grid(term=i)
        ax.plot(XX[:, i], gam.partial_dependence(
            term=i, X=XX), label="Fitted Smooth Function")
        ax.plot(XX[:, i], gam.partial_dependence(term=i, X=XX, width=.95)[
                1], c='r', ls='--', label="Confidence Interval")
        smooth_func_temp_dict['xaxis'] = XX[:, i].tolist()
        smooth_func_temp_dict['yaxis1'] = gam.partial_dependence(
            term=i, X=XX).tolist()

        for confidence_interval in gam.partial_dependence(term=i, X=XX, width=.95)[1]:
            #print("confidence_interval = ", confidence_interval[0])
            lower_bound_list.append(confidence_interval[0])
            upper_bound_list.append(confidence_interval[1])

        # preparing smooth function data
        smooth_func_temp_dict['yaxis2'] = gam.partial_dependence(
            term=i, X=XX, width=.95)[1].tolist()
        smooth_func_temp_dict['lower_confidence'] = lower_bound_list
        smooth_func_temp_dict['upper_confidence'] = upper_bound_list
        smooth_func_temp_dict['feature_name'] = titles[i]

        smooth_funct_list.append(smooth_func_temp_dict)

    # Saving GAM Model for Predictions
    with open(model_saving_path, 'wb') as f1, open(frontend_model_path, 'wb') as f2:
        pickle.dump(gam, f1)
        pickle.dump(gam, f2)

    # Calculating R2 RMSE Values for training data
    gam_predictions_training = gam.predict(X_train)
    training_rmse = round(mean_squared_error(
        y_train, gam_predictions_training, squared=False), 2)
    training_r_squared = round(r2_score(y_train, gam_predictions_training), 2)

    # Calculating R2 RMSE Values for testing data
    gam_predictions_testing = gam.predict(x_test)
    testing_rmse = round(mean_squared_error(
        y_test, gam_predictions_testing, squared=False), 2)
    testing_r_squared = round(r2_score(y_test, gam_predictions_testing), 2)

    # Preparing Data for Training Plot
    train_data_dict['name'] = "Training Plot"
    train_data_dict['xaxis'] = y_train.tolist()
    train_data_dict['yaxis'] = gam_predictions_training.tolist()
    train_data_dict['xaxis2'] = np.unique(y_train).tolist()
    train_data_dict['yaxis2'] = np.poly1d(np.polyfit(
        y_train, gam_predictions_training, 1))(np.unique(y_train)).tolist()
    train_data_dict['rsqaured'] = training_r_squared
    final_data_list.append(train_data_dict)

    # Preparing Data for Testing Plot
    test_data_dict['name'] = "Testing Plot"
    test_data_dict['xaxis'] = y_test.tolist()
    test_data_dict['yaxis'] = gam_predictions_testing.tolist()
    test_data_dict['xaxis2'] = np.unique(y_test).tolist()
    test_data_dict['yaxis2'] = np.poly1d(np.polyfit(
        y_test, gam_predictions_testing, 1))(np.unique(y_test)).tolist()
    test_data_dict['rsqaured'] = testing_r_squared
    final_data_list.append(test_data_dict)

    return training_r_squared, testing_r_squared, final_data_list, smooth_funct_list, output_data_list


if __name__ == "__main__":
    main()
