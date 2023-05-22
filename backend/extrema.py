import pandas as pd
import numpy as np
import os
import random
import joblib
import xgboost as xgb


# def model_training(file_name, data_range):
def pso_execution(pso_data, model_file_name, trained_flag):

    pso_iterations = int(pso_data['psoiterations'])
    pso_particles = int(pso_data['psoparticles'])
    if trained_flag == 0:
        model_saving_path = os.path.join(os.getcwd(), 'assests',"trained_models", model_file_name)
    else:
        model_saving_path = os.path.join(os.getcwd(), 'assests', "user_trained_model.pkl")

    model = joblib.load(model_saving_path)

    print("model.input_info = ", model.input_info)

    # initializing list and dictionaries
    maxima = []
    maxima_output = []
    minima = []
    minima_output = []
    all_bounds = []

    # Reading the data
    data_df = pd.read_csv("updated_object_file.txt")

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]   

    # Gam Function
    def model_function(variables):
        #print("variables = ", variables)
        x = [variables]
        try:
            # GAM Model
            modelmat = model._modelmat(x, term=-1)
            coeff = model.coef_[model.terms.get_coef_indices(-1)]
            output = modelmat.dot(coeff).flatten()
        except:
            try:
                # Scikit learn models
                output = model.predict(x)
            except:
                # For XGBoost model
                dx = xgb.DMatrix(x)
                output = model.predict(dx)

        return output

    # ------------------------------------------------------------------------------
    # TO CUSTOMIZE THIS PSO CODE TO SOLVE UNCONSTRAINED OPTIMIZATION PROBLEMS, CHANGE THE PARAMETERS IN THIS SECTION ONLY:
    # THE FOLLOWING PARAMETERS MUST BE CHANGED.

    nv = len(model.input_info['max'])      # number of variables

    # THE FOLLOWING PARAMETERS ARE OPTINAL.
    # particle_size = psoparticles         # number of particles
    # iterations = psoiterations           # max number of iterations
    w = 0.85                    # inertia constant
    c1 = 1                      # cognative constant
    c2 = 0.5                    # social constant
    # END OF THE CUSTOMIZATION SECTION
    # ------------------------------------------------------------------------------

    class Particle:
        def __init__(self, bounds):
            self.particle_position = []                     # particle position
            self.particle_velocity = []                     # particle velocity
            self.local_best_particle_position = []          # best position of the particle
            self.fitness_local_best_particle_position = initial_fitness
            self.fitness_particle_position = initial_fitness

            for i in range(nv):
                self.particle_position.append(
                    random.uniform(bounds[i][0], bounds[i][1]))
                self.particle_velocity.append(random.uniform(-1, 1))

        def evaluate(self, objective_function):
            self.fitness_particle_position = objective_function(
                self.particle_position)
            if mm == -1:
                if self.fitness_particle_position < self.fitness_local_best_particle_position:
                    # update the local best
                    self.local_best_particle_position = self.particle_position
                    # update the fitness of the local best
                    self.fitness_local_best_particle_position = self.fitness_particle_position

            if mm == 1:
                if self.fitness_particle_position > self.fitness_local_best_particle_position:
                    # update the local best
                    self.local_best_particle_position = self.particle_position
                    self.fitness_local_best_particle_position = self.fitness_particle_position

        def update_velocity(self, global_best_particle_position):
            for i in range(nv):
                r1 = random.random()
                r2 = random.random()

                cognitive_velocity = c1*r1 * \
                    (self.local_best_particle_position[i] -
                     self.particle_position[i])
                social_velocity = c2*r2 * \
                    (global_best_particle_position[i] -
                     self.particle_position[i])
                self.particle_velocity[i] = w*self.particle_velocity[i] + \
                    cognitive_velocity + social_velocity

        def update_position(self, bounds):
            for i in range(nv):
                self.particle_position[i] = self.particle_position[i] + \
                    self.particle_velocity[i]

                # check and repair to satisfy the upper bounds
                if self.particle_position[i] > bounds[i][1]:
                    self.particle_position[i] = bounds[i][1]

                if self.particle_position[i] < bounds[i][0]:
                    self.particle_position[i] = bounds[i][0]

    class PSO():
        def __init__(self, objective_function, bounds, particle_size, iterations):

            fitness_global_best_particle_position = initial_fitness
            global_best_particle_position = []

            swarm_particle = []
            for i in range(particle_size):
                swarm_particle.append(Particle(bounds))
            A = []

            for i in range(iterations):
                for j in range(particle_size):
                    swarm_particle[j].evaluate(objective_function)
                    if mm == -1:
                        if swarm_particle[j].fitness_particle_position < fitness_global_best_particle_position:
                            global_best_particle_position = list(
                                swarm_particle[j].particle_position)
                            fitness_global_best_particle_position = float(
                                swarm_particle[j].fitness_particle_position)
                    if mm == 1:
                        if swarm_particle[j].fitness_particle_position > fitness_global_best_particle_position:
                            global_best_particle_position = list(
                                swarm_particle[j].particle_position)
                            fitness_global_best_particle_position = float(
                                swarm_particle[j].fitness_particle_position)
                #print("\n Iteration = ", i)
                #print('Optimal solution:', global_best_particle_position)
                #print('Objective function value:' , fitness_global_best_particle_position)
                for j in range(particle_size):
                    swarm_particle[j].update_velocity(
                        global_best_particle_position)
                    swarm_particle[j].update_position(bounds)

                A.append(fitness_global_best_particle_position)

            if mm == 1:
                maxima.append(global_best_particle_position)
                maxima_output.append(
                    round(fitness_global_best_particle_position, 3))
            else:
                minima.append(global_best_particle_position)
                minima_output.append(
                    round(fitness_global_best_particle_position, 3))
            #print('Optimal solution:', global_best_particle_position)
            #print('Objective function value:' , fitness_global_best_particle_position)
            #print('Evolutionary process of the objective function value:')

            # plt.plot(A)

    # Bounds
    bounds = []
    for column in x.columns:
        min_val = (x[column].min())
        max_val = (x[column].max())
        bounds.append((min_val, max_val))

    # Reading User Input Parameter
    with open("object_file.txt", encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break

    col_str = "Input values follows following order:"
    for element in model.input_info['names']:
        col_str += " '"
        col_str += element
        col_str += "', "
    str1 = col_str[:-2]
    #print("Train model data ranges = ", data_range)

    if pso_data['limit_flag'] is True:
        bounds = []
        for index, column in enumerate(model.input_info['names']):
            for reference in range(len(model.input_info['names'])):
                if column == pso_data['lower_bounds'][reference]['name']:
                    min_val = float(
                        pso_data['lower_bounds'][reference]['value'])
                    max_val = float(
                        pso_data['upper_bounds'][reference]['value'])
                    if min_val <= max_val:
                        pass
                    else:
                        temp_value = min_val
                        min_val = max_val
                        max_val = temp_value
                    bounds.append((float(min_val), float(max_val)))

        all_bounds.append(bounds)
        #print("bounds = ", bounds)
        #print("All bounds = ", all_bounds)

        for iter in range(4):
            local_bounds = []
            for single_bound in bounds:
                min_val = single_bound[0]
                max_val = single_bound[1]
                min_rand_value = round(
                    float(np.random.uniform(min_val, max_val, 1)), 3)
                max_rand_value = round(
                    float(np.random.uniform(min_val, max_val, 1)), 3)

                if min_rand_value <= max_rand_value:
                    pass
                else:
                    temp_value = min_rand_value
                    min_rand_value = max_rand_value
                    max_rand_value = temp_value
                local_bounds.append((min_rand_value, max_rand_value))
            #print("local_bounds = ", local_bounds)
            all_bounds.append(local_bounds)
        #print("All bounds = ", all_bounds)

    else:
        for iter in range(5):
            # print(iter)
            # Dynamic Bounds
            bounds = []
            for index, element in enumerate(model.input_info['max']):
                min_val = model.input_info['min'][index]
                max_val = model.input_info['max'][index]

                min_rand_value = round(
                    float(np.random.uniform(min_val, max_val, 1)), 3)
                max_rand_value = round(
                    float(np.random.uniform(min_val, max_val, 1)), 3)

                if min_rand_value <= max_rand_value:
                    pass
                else:
                    temp_value = min_rand_value
                    min_rand_value = max_rand_value
                    max_rand_value = temp_value

                bounds.append((min_rand_value, max_rand_value))

            #print(" Bounds = ", bounds)
            all_bounds.append(bounds)

    for bounds in all_bounds:

        # if minimization problem, mm = -1; if maximization problem, mm = 1
        mm = 1
        if mm == -1:
            initial_fitness = float("inf")  # for minimization problem
        if mm == 1:
            initial_fitness = -float("inf")  # for maximization problem

        PSO(model_function, bounds, pso_particles, pso_iterations)
        # if minimization problem, mm = -1; if maximization problem, mm = 1
        mm = -1
        if mm == -1:
            initial_fitness = float("inf")  # for minimization problem
        if mm == 1:
            initial_fitness = -float("inf")  # for maximization problem
        PSO(model_function, bounds, pso_particles, pso_iterations)

        #print("\nMAXIMA point values = ", maxima)
        #print("Maxima_output = ", maxima_output)
        #print("All bounds = ", all_bounds)
        #print("minima_output = ", minima_output)
        #print("\nMinima point values = ", minima)
        #maxima_output, minima_output, all_bounds = zip(*sorted(zip(maxima_output, minima_output,all_bounds)))
        #sorted_maxima_output, sorted_maxima_bounds = zip(*sorted(zip(maxima_output, all_bounds)))
        #sorted_minima_output, sorted_minima_bounds = zip(*sorted(zip(minima_output, all_bounds)))

    sorted_maxima_output, sorted_maxima_bounds = zip(
        *sorted(zip(maxima_output, maxima), reverse=True))
    sorted_minima_output, sorted_minima_bounds = zip(
        *sorted(zip(minima_output, minima)))

    #str2 = "Input values for Max Output = {} , O/P = {}  ".format(predictions_dict[max_pred_val],max_pred_val)
    #str2 = "Max Output Value = {} {}, Based on Input values = {}".format(round(maxima_output[0],3),unit, [round(item, 3) for item in maxima[0]] )
    #str3 = "Min Output Value = {} {}, Based on Input values = {}".format(round(minima_output[0],2), unit, [round(item, 3) for item in minima[0]])

    str2 = "Top 5 Maxima Values"
    str3 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_maxima_output[0], 3), unit, [round(item, 3) for item in sorted_maxima_bounds[0]])
    str4 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_maxima_output[1], 3), unit, [round(item, 3) for item in sorted_maxima_bounds[1]])
    str5 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_maxima_output[2], 3), unit, [round(item, 3) for item in sorted_maxima_bounds[2]])
    str6 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_maxima_output[3], 3), unit, [round(item, 3) for item in sorted_maxima_bounds[3]])
    str7 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_maxima_output[4], 3), unit, [round(item, 3) for item in sorted_maxima_bounds[4]])
    str8 = "Top 5 Minima Values"
    str9 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_minima_output[0], 3), unit, [round(item, 3) for item in sorted_minima_bounds[0]])
    str10 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_minima_output[1], 3), unit, [round(item, 3) for item in sorted_minima_bounds[1]])
    str11 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_minima_output[2], 3), unit, [round(item, 3) for item in sorted_minima_bounds[2]])
    str12 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_minima_output[3], 3), unit, [round(item, 3) for item in sorted_minima_bounds[3]])
    str13 = "Output = {} {}, Based on Input = {}".format(round(
        sorted_minima_output[4], 3), unit, [round(item, 3) for item in sorted_minima_bounds[4]])

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

    return str_list


if __name__ == "__main__":
    main()
