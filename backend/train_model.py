import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from pygam import LinearGAM
import math
import joblib
from sklearn.ensemble import RandomForestRegressor, StackingRegressor
import xgboost as xgb
from sklearn.svm import SVR
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import AdaBoostRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.linear_model import Lasso, Ridge
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor


def model_training(userid, original_file_name, input_parameters_dict):
    ### This function is responsible for model training
    
    # Defining necessary paths
    nbr_input_track_file_path = os.path.join(
        os.getcwd(), 'assests', "nbr_of_inputs.ini")
    
    file_name = os.path.join(os.getcwd(), "assests",
                                        "data_files_customized", "{}.txt".format(userid))
    
    original_file = os.path.join(os.getcwd(), "assests",
                                        "data_files", "{}.txt".format(userid))
    
    model_saving_path = os.path.join(
        os.getcwd(), 'assests', "trained_models")


    def select_points(lst, x):
        interval = len(lst) // x
        if interval == 0:
            interval = 1
        return [lst[i] for i in range(0, len(lst), interval)]

    # initializing list and dictionaries
    final_data_list = []
    train_data_dict = {}
    test_data_dict = {}
    hist_dict = {}
    smooth_funct_list = []
    lower_bound_list = []
    upper_bound_list = []

    # Reading the data
    data_df = pd.read_csv(file_name)

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    # Saving number of inputs in a file
    with open(nbr_input_track_file_path, 'w+') as f:
        f.write(str(len(x.columns)))

    # Reading User Input Parameters
    with open(original_file, encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break

    # Extracting user given parameter values
    training_percent = int(input_parameters_dict['splitpercent'])
    testing_percent = (100 - training_percent)/100
    bin = int(input_parameters_dict['bin'])
    shuffle_value = str(input_parameters_dict['shuffledata'])

    if shuffle_value == "True":
        shufflestatus = bool("Something")
    else:
        shufflestatus = bool("")

    # preparing histogram data
    hist_dict['data'] = y.tolist()

    # Splitting Data Into training and testing data
    if testing_percent == 0.0:
        X_train = x
        x_train = X_train.values
        y_train = y
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            x, y, test_size=testing_percent, shuffle=shufflestatus)

        x_train = X_train.values
        x_test = X_test.values

    # GAM Model Execution
    if input_parameters_dict['model'] == 0:
        model_name = "GAM"
        lambdaval = int(input_parameters_dict['lambdaval'])
        splines = int(input_parameters_dict['splines'])

        # Setting Lambda Penalization Term
        input_column_nbr = len(x.columns)
        lams = np.random.rand(100, input_column_nbr)
        lams = lams * 5 - lambdaval
        lams = np.exp(lams)

        # Fitting Gam model
        model = LinearGAM(n_splines=splines).gridsearch(
            x_train, y_train, lam=lams)
        #print("coeff = ", gam.coef_[gam.terms.get_coef_indices(-1)])
        # gam.summary()  # printing summary of the model

        # Plotting Smooth Function graphs
        titles = data_df.columns[0:input_column_nbr]
        plt.switch_backend('agg')
        plt.figure()
        fig, axs = plt.subplots(1, input_column_nbr, figsize=(40, 7))

        if len(x.columns) == 1: # If there is single input
            lower_bound_list = []
            upper_bound_list = []
            smooth_func_temp_dict = {}
            XX = model.generate_X_grid(term=0)
            axs.plot(XX[:, 0], model.partial_dependence(
                term=0, X=XX), label="Fitted Smooth Function")
            axs.plot(XX[:, 0], model.partial_dependence(term=0, X=XX, width=.95)[
                1], c='r', ls='--', label="Confidence Interval")
            smooth_func_temp_dict['xaxis'] = XX[:, 0].tolist()
            smooth_func_temp_dict['yaxis1'] = model.partial_dependence(
                term=0, X=XX).tolist()

            selected_smooth_points = select_points(model.partial_dependence(
                term=0, X=XX).tolist(), len(x.iloc[:, 0].values.tolist()))

            smooth_func_temp_dict['data_points_xaxis'] = x.iloc[:,
                                                                0].values.tolist()
            smooth_func_temp_dict['data_points_yaxis'] = y.values.tolist()
            smooth_func_temp_dict['selected_smooth_points'] = selected_smooth_points

            for confidence_interval in model.partial_dependence(term=0, X=XX, width=.95)[1]:
                #print("confidence_interval = ", confidence_interval[0])
                lower_bound_list.append(confidence_interval[0])
                upper_bound_list.append(confidence_interval[1])
            # preparing smooth function data
            smooth_func_temp_dict['yaxis2'] = model.partial_dependence(
                term=0, X=XX, width=.95)[1].tolist()
            smooth_func_temp_dict['lower_confidence'] = lower_bound_list
            smooth_func_temp_dict['upper_confidence'] = upper_bound_list
            smooth_func_temp_dict['feature_name'] = titles[0]

            smooth_funct_list.append(smooth_func_temp_dict)

        else: # If there are multiple inputs
            for i, ax in enumerate(axs):
                lower_bound_list = []
                upper_bound_list = []
                smooth_func_temp_dict = {}
                XX = model.generate_X_grid(term=i)
                ax.plot(XX[:, i], model.partial_dependence(
                    term=i, X=XX), label="Fitted Smooth Function")
                ax.plot(XX[:, i], model.partial_dependence(term=i, X=XX, width=.95)[
                        1], c='r', ls='--', label="Confidence Interval")
                smooth_func_temp_dict['xaxis'] = XX[:, i].tolist()
                smooth_func_temp_dict['yaxis1'] = model.partial_dependence(
                    term=i, X=XX).tolist()

                selected_smooth_points = select_points(model.partial_dependence(
                    term=i, X=XX).tolist(), len(x.iloc[:, i].values.tolist()))

                smooth_func_temp_dict['data_points_xaxis'] = x.iloc[:, i].values.tolist(
                )
                smooth_func_temp_dict['data_points_yaxis'] = y.values.tolist()
                smooth_func_temp_dict['selected_smooth_points'] = selected_smooth_points

                for confidence_interval in model.partial_dependence(term=i, X=XX, width=.95)[1]:
                    #print("confidence_interval = ", confidence_interval[0])
                    lower_bound_list.append(confidence_interval[0])
                    upper_bound_list.append(confidence_interval[1])

                # preparing smooth function data
                smooth_func_temp_dict['yaxis2'] = model.partial_dependence(
                    term=i, X=XX, width=.95)[1].tolist()
                smooth_func_temp_dict['lower_confidence'] = lower_bound_list
                #print("lower bound = ",  lower_bound_list)
                smooth_func_temp_dict['upper_confidence'] = upper_bound_list
                smooth_func_temp_dict['feature_name'] = titles[i]

                smooth_funct_list.append(smooth_func_temp_dict)

    elif input_parameters_dict['model'] == 1:  # RFR Model
        # Extracting user given parameter values
        model_name = "RFR"
        n_estimators = int(input_parameters_dict['n_estimators'])
        max_depth = int(input_parameters_dict['max_depth'])
        if max_depth == 0:
            max_depth = None

        # Create the Random Forest Regression model
        model = RandomForestRegressor(
            n_estimators=n_estimators, max_depth=max_depth)

        # Train the model
        model.fit(x_train, y_train)

    elif input_parameters_dict['model'] == 2:  # XGB Model
        # Extracting user given parameter values
        model_name = "XGB"
        learn_rate = float(input_parameters_dict['learn_rate'])
        n_estimators = int(input_parameters_dict['n_estimators'])
        max_depth = int(input_parameters_dict['max_depth'])
        if max_depth == 0:
            max_depth = None

        # Set the parameters for the XGBoost model
        params = {
            'max_depth': max_depth,  # Specify the maximum depth of the trees
            'eta': learn_rate  # Specify the learning rate
        }

        # Convert the data into DMatrix format (optimized for XGBoost)
        dtrain = xgb.DMatrix(x_train, label=y_train)
        dtest = xgb.DMatrix(x_test, label=y_test)

        # Train the XGBoost model
        model = xgb.train(params, dtrain, n_estimators)

    elif input_parameters_dict['model'] == 3:  # SVR Model
        # Extracting user given parameter values
        model_name = "SVR"
        cost_value = int(input_parameters_dict['cost'])
        epsilon_value = float(input_parameters_dict['epsilon'])

        # Train the SVR model
        model = SVR(C=cost_value, epsilon=epsilon_value)
        model.fit(x_train, y_train)

    elif input_parameters_dict['model'] == 4:  # Linear Regression Model
        # Extracting user given parameter values
        model_name = "LR"
        fit_intercept = str(input_parameters_dict['fit_intercept'])
        normalize = str(input_parameters_dict['normalize'])

        if fit_intercept == "True":
            fit_intercept = bool("Something")
        else:
            fit_intercept = bool("")
        
        if normalize == "True":
            normalize = bool("Something")
        else:
            normalize = bool("")

        # Train the linear regression model
        model = LinearRegression(normalize=normalize, fit_intercept=fit_intercept)
        model.fit(x_train, y_train)

    elif input_parameters_dict['model'] == 5:  # Stacking ML Models
        model_name = "stackingML"

        # Define the base models
        base_models = [
            ('rfr', RandomForestRegressor()),
            ('xgboost', XGBRegressor()),
            ('svr', SVR()),
            ('lr', LinearRegression()),
            ('ada', AdaBoostRegressor()),
            ('gpr', GaussianProcessRegressor()),
            ('dt', DecisionTreeRegressor()),
            ('lasso', Lasso()),
            ('ridge', Ridge()),
            ('lgbm', LGBMRegressor())
        ]

        # Define the final model
        final_model = LinearRegression()

        # Create the stacking regressor
        model = StackingRegressor(estimators=base_models, final_estimator=final_model)

        # Fit the stacking regressor on the training data
        model.fit(X_train, y_train)


    # set the input information
    model.input_info = {'names': x.columns.tolist(), 'max': x.max(
    ).tolist(), 'min': x.min().tolist(), "unit": unit}
    

    pkl_name = "{}_{}_userID_{}.pkl".format(original_file_name,model_name,userid)
    
    # save the model
    joblib.dump(model, os.path.join(model_saving_path,pkl_name))

    # Calculating R2 RMSE Values for training data
    if input_parameters_dict['model'] == 2:  # For XGB Format
        predictions_training = model.predict(dtrain)
    else:
        predictions_training = model.predict(X_train)
    range_values = max(y)-min(y)
    training_rmse = mean_squared_error(
        y_train, predictions_training, squared=False)
    training_rmse = round((training_rmse/range_values)*100, 2)

    training_r_squared = round(r2_score(y_train, predictions_training), 2)
    if math.isnan(training_r_squared) == True:
        training_r_squared = 0
        training_rmse = 0

    # Calculating R2 RMSE Values for testing data
    if testing_percent == 0.0:
        testing_r_squared = 0
        testing_rmse = 0
        pass
    else:
        # Calculating R2 RMSE Values for training data
        if input_parameters_dict['model'] == 2:  # For XGB Format
            predictions_testing = model.predict(dtest)
        else:
            predictions_testing = model.predict(x_test)
        testing_rmse = mean_squared_error(
            y_test, predictions_testing, squared=False)
        testing_rmse = round((testing_rmse/range_values)*100, 2)

        testing_r_squared = round(r2_score(y_test, predictions_testing), 2)
        if math.isnan(testing_r_squared) == True:
            testing_r_squared = 0
            testing_rmse = 0

    print("training_r_squared = ", training_r_squared)
    print("testing_r_squared = ", testing_r_squared)
    
    # Preparing Data for Training Plot
    train_data_dict['name'] = "Training Plot"
    train_data_dict['xaxis'] = y_train.tolist()
    train_data_dict['yaxis'] = predictions_training.tolist()
    train_data_dict['xaxis2'] = np.unique(y_train).tolist()
    train_data_dict['yaxis2'] = np.poly1d(np.polyfit(
        y_train, predictions_training, 1))(np.unique(y_train)).tolist()
    train_data_dict['rsqaured'] = training_r_squared
    train_data_dict['rmse'] = training_rmse
    final_data_list.append(train_data_dict)

    # Preparing Data for Testing Plot
    if testing_percent != 0.0:
        test_data_dict['name'] = "Testing Plot"
        test_data_dict['xaxis'] = y_test.tolist()
        test_data_dict['yaxis'] = predictions_testing.tolist()
        test_data_dict['xaxis2'] = np.unique(y_test).tolist()
        test_data_dict['yaxis2'] = np.poly1d(np.polyfit(
            y_test, predictions_testing, 1))(np.unique(y_test)).tolist()
        test_data_dict['rsqaured'] = testing_r_squared
        test_data_dict['rmse'] = testing_rmse
        final_data_list.append(test_data_dict)

    return final_data_list, smooth_funct_list


if __name__ == "__main__":
    main()
