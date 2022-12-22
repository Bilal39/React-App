import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from pygam import LinearGAM
import pickle
import math
import random


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
    maxima = []
    maxima_output = []
    minima = []
    minima_output = []
    all_bounds = []

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
                counter += 1
            elif counter == 5:
                psoparticles = int(line)
                counter += 1
            elif counter == 6:
                psoiterations = int(line)
                counter += 1

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
    #gam.summary()  # printing summary of the model

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
    if math.isnan(training_r_squared) == True:
        training_r_squared = 0
    

    # Calculating R2 RMSE Values for testing data
    gam_predictions_testing = gam.predict(x_test)
    testing_rmse = round(mean_squared_error(
        y_test, gam_predictions_testing, squared=False), 2)

    testing_r_squared = round(r2_score(y_test, gam_predictions_testing), 2)
    if math.isnan(testing_r_squared) == True:
        testing_r_squared = 0



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


    # Gam Function
    def gam_function(variables):
      x = [variables]
      modelmat = gam._modelmat(x, term=-1)
      coeff = gam.coef_[gam.terms.get_coef_indices(-1)]
      return modelmat.dot(coeff).flatten()
    
    

    
    #------------------------------------------------------------------------------
    # TO CUSTOMIZE THIS PSO CODE TO SOLVE UNCONSTRAINED OPTIMIZATION PROBLEMS, CHANGE THE PARAMETERS IN THIS SECTION ONLY:
    # THE FOLLOWING PARAMETERS MUST BE CHANGED.
    
    nv = len(X_train.columns)      # number of variables

    
    # THE FOLLOWING PARAMETERS ARE OPTINAL.
    particle_size = psoparticles         # number of particles
    iterations = psoiterations           # max number of iterations
    w=0.85                    # inertia constant
    c1=1                    # cognative constant
    c2=0.5                     # social constant
    # END OF THE CUSTOMIZATION SECTION
    #------------------------------------------------------------------------------
    
    class Particle:
        def __init__(self,bounds):
            self.particle_position=[]                     # particle position
            self.particle_velocity=[]                     # particle velocity
            self.local_best_particle_position=[]          # best position of the particle
            self.fitness_local_best_particle_position= initial_fitness
            self.fitness_particle_position=initial_fitness

            for i in range(nv):
              self.particle_position.append(random.uniform(bounds [i][0],bounds [i][1])) 
              self.particle_velocity.append(random.uniform(-1,1))

        def evaluate(self,objective_function):
            self.fitness_particle_position=objective_function(self.particle_position)
            if mm == -1:
                if self.fitness_particle_position < self.fitness_local_best_particle_position:
                    self.local_best_particle_position = self.particle_position                  # update the local best
                    self.fitness_local_best_particle_position = self.fitness_particle_position  # update the fitness of the local best

            if mm == 1:
                if self.fitness_particle_position > self.fitness_local_best_particle_position:
                    self.local_best_particle_position = self.particle_position                  # update the local best
                    self.fitness_local_best_particle_position = self.fitness_particle_position

        def update_velocity(self,global_best_particle_position):
            for i in range(nv):
                r1=random.random()
                r2=random.random()
    
                cognitive_velocity = c1*r1*(self.local_best_particle_position[i] - self.particle_position[i])
                social_velocity = c2*r2*(global_best_particle_position[i] - self.particle_position[i])
                self.particle_velocity[i] = w*self.particle_velocity[i]+ cognitive_velocity + social_velocity
    
        def update_position(self,bounds):
            for i in range(nv):
                self.particle_position[i]=self.particle_position[i]+self.particle_velocity[i]
    
                # check and repair to satisfy the upper bounds
                if self.particle_position[i]>bounds[i][1]:
                    self.particle_position[i]=bounds[i][1]

                if self.particle_position[i] < bounds[i][0]:
                	self.particle_position[i]=bounds[i][0]              
    class PSO():
        def __init__(self,objective_function,bounds,particle_size,iterations):
        
            fitness_global_best_particle_position=initial_fitness
            global_best_particle_position=[]
    
            swarm_particle=[]
            for i in range(particle_size):
                swarm_particle.append(Particle(bounds))
            A=[]

            for i in range(iterations):
                for j in range(particle_size):
                    swarm_particle[j].evaluate(objective_function)
                    if mm == -1:
                      if swarm_particle[j].fitness_particle_position < fitness_global_best_particle_position:
                        global_best_particle_position = list(swarm_particle[j].particle_position)
                        fitness_global_best_particle_position = float(swarm_particle[j].fitness_particle_position)
                    if mm == 1:
                      if swarm_particle[j].fitness_particle_position > fitness_global_best_particle_position:
                        global_best_particle_position = list(swarm_particle[j].particle_position)
                        fitness_global_best_particle_position = float(swarm_particle[j].fitness_particle_position)
                #print("\n Iteration = ", i)
                #print('Optimal solution:', global_best_particle_position)
                #print('Objective function value:' , fitness_global_best_particle_position)
                for j in range(particle_size):
                  swarm_particle[j].update_velocity(global_best_particle_position)
                  swarm_particle[j].update_position(bounds)

                A.append(fitness_global_best_particle_position) 

            if mm == 1:
                maxima.append(global_best_particle_position)
                maxima_output.append(round(fitness_global_best_particle_position,3))
            else:
                minima.append(global_best_particle_position)
                minima_output.append(round(fitness_global_best_particle_position,3))
            #print('Optimal solution:', global_best_particle_position)
            #print('Objective function value:' , fitness_global_best_particle_position)
            #print('Evolutionary process of the objective function value:')


            #plt.plot(A)
    
    ## Bounds
    #bounds = []
    #for column in X_train.columns:
    #  min_val = (X_train[column].min())
    #  max_val = (X_train[column].max())
    #  bounds.append((min_val,max_val)) 

    for iter in range(5):
        #print(iter)
        # Dynamic Bounds
        bounds = []
        for column in X_train.columns:
          min_val = (X_train[column].min())
          max_val = (X_train[column].max())
          min_rand_value = round(float(np.random.uniform(min_val,max_val,1)),3)
          max_rand_value = round(float(np.random.uniform(min_val,max_val,1)),3)

          if min_rand_value <= max_rand_value:
            pass
          else:
            temp_value = min_rand_value
            min_rand_value = max_rand_value
            max_rand_value = temp_value

          bounds.append((min_rand_value,max_rand_value)) 
        
        all_bounds.append(bounds[0])

        mm = 1                           # if minimization problem, mm = -1; if maximization problem, mm = 1
        if mm == -1:
	        initial_fitness = float("inf") # for minimization problem

        if mm == 1:
	        initial_fitness = -float("inf") # for maximization problem

        PSO(gam_function, bounds, particle_size, iterations)



        mm = -1                           # if minimization problem, mm = -1; if maximization problem, mm = 1
        if mm == -1:
	        initial_fitness = float("inf") # for minimization problem

        if mm == 1:
	        initial_fitness = -float("inf") # for maximization problem

        PSO(gam_function, bounds, particle_size, iterations)

    #print("\nMAXIMA point values = ", maxima)
    #print("Maxima_output = ", maxima_output)
    #print("All bounds = ", all_bounds)
    #print("minima_output = ", minima_output)
    #print("\nMinima point values = ", minima)
    #maxima_output, minima_output, all_bounds = zip(*sorted(zip(maxima_output, minima_output,all_bounds)))
    #sorted_maxima_output, sorted_maxima_bounds = zip(*sorted(zip(maxima_output, all_bounds)))
    #sorted_minima_output, sorted_minima_bounds = zip(*sorted(zip(minima_output, all_bounds)))
    
    sorted_maxima_output, sorted_maxima_bounds = zip(*sorted(zip(maxima_output, maxima),reverse=True))
    sorted_minima_output, sorted_minima_bounds = zip(*sorted(zip(minima_output, minima)))
    
    ##print("\nSorted Maxima_output = ", sorted_maxima_output)
    ##print("sorted minima bounds = ", sorted_maxima_bounds)
    ##print("\nSorted minima_output = ", sorted_minima_output)
    ##print("Sorted minima bounds = ", sorted_minima_bounds)

    # Reading User Input Parameters
    with open("object_file.txt", encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break
    
    #str2 = "Input values for Max Output = {} , O/P = {}  ".format(predictions_dict[max_pred_val],max_pred_val)
    #str2 = "Max Output Value = {} {}, Based on Input values = {}".format(round(maxima_output[0],3),unit, [round(item, 3) for item in maxima[0]] )
    #str3 = "Min Output Value = {} {}, Based on Input values = {}".format(round(minima_output[0],2), unit, [round(item, 3) for item in minima[0]])

    #str2 = "Output = {} {}, Based on Input = {} '\n' \n <br/> Output = {} {}, Based on Input = {}\n  ".format(round(sorted_maxima_output[0],3),unit, [round(item, 3) for item in sorted_maxima_bounds[0]],
    #                                                                                                                               round(sorted_maxima_output[1],3),unit, [round(item, 3) for item in sorted_maxima_bounds[1]])
    #str3 = "Output = {} {}, Based on Input = {} '\n' Output = {} {}, Based on Input = {}\n".format(round(sorted_minima_output[0],2), unit, [round(item, 3) for item in sorted_minima_bounds[0]],
           
    #                                                                                                                       round(sorted_minima_output[1],2), unit, [round(item, 3) for item in sorted_minima_bounds[1]])
    str2 = "Top 5 Maxima Values"
    str3 = "Output = {} {}, Based on Input = {}".format(round(sorted_maxima_output[0],3),unit, [round(item, 3) for item in sorted_maxima_bounds[0]])
    str4 = "Output = {} {}, Based on Input = {}".format(round(sorted_maxima_output[1],3),unit, [round(item, 3) for item in sorted_maxima_bounds[1]])
    str5 = "Output = {} {}, Based on Input = {}".format(round(sorted_maxima_output[2],3),unit, [round(item, 3) for item in sorted_maxima_bounds[2]])
    str6 = "Output = {} {}, Based on Input = {}".format(round(sorted_maxima_output[3],3),unit, [round(item, 3) for item in sorted_maxima_bounds[3]])
    str7 = "Output = {} {}, Based on Input = {}".format(round(sorted_maxima_output[4],3),unit, [round(item, 3) for item in sorted_maxima_bounds[4]])
    str8 = "Top 5 Minima Values"
    str9 = "Output = {} {}, Based on Input = {}".format(round(sorted_minima_output[0],3), unit, [round(item, 3) for item in sorted_minima_bounds[0]])
    str10 = "Output = {} {}, Based on Input = {}".format(round(sorted_minima_output[1],3), unit, [round(item, 3) for item in sorted_minima_bounds[1]])
    str11 = "Output = {} {}, Based on Input = {}".format(round(sorted_minima_output[2],3), unit, [round(item, 3) for item in sorted_minima_bounds[2]])
    str12 = "Output = {} {}, Based on Input = {}".format(round(sorted_minima_output[3],3), unit, [round(item, 3) for item in sorted_minima_bounds[3]])
    str13 = "Output = {} {}, Based on Input = {}".format(round(sorted_minima_output[4],3), unit, [round(item, 3) for item in sorted_minima_bounds[4]])

    
    col_str = "Input values follows following order:"
    for element in X_train.columns:
        col_str += " '"
        col_str += element
        col_str += "', "
    str1 = col_str[:-2]

    str_list = []
    temp_dict = {}
    temp_dict['str1'] = str1
    temp_dict['str2'] = str2
    temp_dict['str3'] = str3
    temp_dict['str4'] = str4
    temp_dict['str5'] = str5
    temp_dict['str6'] = str6
    temp_dict['str7'] = str7
    temp_dict['str8'] = str8
    temp_dict['str9'] = str9
    temp_dict['str10'] = str10
    temp_dict['str11'] = str11
    temp_dict['str12'] = str12
    temp_dict['str13'] = str13
    str_list.append(temp_dict)


    return training_r_squared, testing_r_squared, final_data_list, smooth_funct_list, output_data_list, str_list


if __name__ == "__main__":
    main()
