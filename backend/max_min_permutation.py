import os
import pandas as pd
import copy
import pickle


def variads(lst, lstsofar,model, combination_predictions,pre_prediction_list, flag = 1):
    if flag == 0:
        combination_predictions = {}

    offset = len(lstsofar)
    outerlen = len(lst)
    innerLst = lst[offset]
    printit = False
    if offset == (outerlen - 1):
        printit = True
    for item in innerLst:
        if printit:
            #print (lstsofar + [item])
            output_prediction = round(model.predict([lstsofar + [item]])[0], 2)
            combination_predictions[output_prediction] = copy.deepcopy(
                lstsofar + [item])
            pre_prediction_list.append(output_prediction)
            #print(output_prediction, "\n")
        else:
            variads(lst, lstsofar + [item],model, combination_predictions,pre_prediction_list )
    return combination_predictions, pre_prediction_list


def maxima_minima(file_name):

    # Reading the data
    data_df = pd.read_csv(file_name)

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    # print(x.columns.tolist())
    col_str = "Input values follows following order:"
    for element in x.columns:
        col_str += " '"
        col_str += element
        col_str += "', "
    str1 = col_str[:-2]

    # Initiating list for storing values
    feat_ranges = []
    feat_range_steps = []
    min_val_list = []
    max_val_list = []
    
    for n, heading in enumerate(x.columns):
        temp_dict = {}
        min_val = round(x.iloc[:, n].min(), 2)
        max_val = round(x.iloc[:, n].max(), 2)
        min_val_list.append(min_val)
        max_val_list.append(max_val)
        feat_ranges.append(round(max_val-min_val, 2))

    for nbr in feat_ranges:
        step = round(nbr/5, 2)
        feat_range_steps.append(step)
    ###print("min_val_list = ", min_val_list)
    ###print("max_val_list = ", max_val_list)
    ###print("ranges = ", feat_ranges)
    ###print("steps = ", feat_range_steps)

    combined_data_lists = []
    for index, col in enumerate(min_val_list):
        print('\n', )
        temp_list = "list{}".format(index+1)
        locals()[temp_list] = []
        initial_value = col
        while initial_value < max_val_list[index]:
            locals()[temp_list].append(round(initial_value, 2))
            initial_value += feat_range_steps[index]
        #print("{} = ".format(temp_list),locals()[temp_list])
        combined_data_lists.append(locals()[temp_list])
        

    #print("combined_data_lists = ",combined_data_lists)

    pre_prediction_list = []
    combination_predictions = {}
    
    flag = 0

    train_model_path = os.path.join(os.getcwd(), 'assests', "gam_model.pkl")
    # load model
    with open(train_model_path, 'rb') as f:
        model = pickle.load(f)
    predictions_dict, prediction_list = variads(combined_data_lists, [],model,combination_predictions,pre_prediction_list, flag)
    max_pred_val = max(prediction_list)
    min_pred_val = min(prediction_list)

    # Reading User Input Parameters
    with open("object_file.txt", encoding='utf-8-sig') as f:
        lines = f.readlines()
        for line in lines:
            unit = str(line.split(',')[0])
            if unit == "Enter output unit":
                unit = "units"
            break

    #str2 = "Input values for Max Output = {} , O/P = {}  ".format(predictions_dict[max_pred_val],max_pred_val)
    str2 = "Max Output Value = {} {}, Based on Input values = {}".format(
        max_pred_val, unit, predictions_dict[max_pred_val])

    str3 = "Min Output Value = {} {}, Based on Input values = {}".format(
        min_pred_val, unit, predictions_dict[min_pred_val])
    #str3 = "Input values for Min Output = {} , O/P = {}  ".format(predictions_dict[min_pred_val],min_pred_val)
    print(str2)
    print(str3)
    str_list = []
    temp_dict = {}
    temp_dict['str1'] = str1
    temp_dict['str2'] = str2
    temp_dict['str3'] = str3
    str_list.append(temp_dict)

    return str_list

if __name__ == "__main__":
    main()


