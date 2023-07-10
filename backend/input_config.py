import pandas as pd
import os
import pandas as pd


def input_manger():
    input_data_list = []
    input_dict = {}
    input_nbr_path = os.path.join(os.getcwd(), 'assests', "nbr_of_inputs.ini")
    predictor_default_value_path = os.path.join(
        os.getcwd(), 'assests', "predictor_default_value.ini")

    # check if size of file is 0
    if os.stat(predictor_default_value_path).st_size == 0:
        #print('File is empty')
        flag = 0
    else:
        #print('File is not empty')
        flag = 1
        predictor_input_values = []
        # adding default predictor values in a list
        with open(predictor_default_value_path) as f:
            lines = f.readlines()
            for line in lines:
                predictor_input_values.append(float(line))

    # Reading the data
    data_df = pd.read_csv("updated_object_file.txt")
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    for n, heading in enumerate(x.columns):
        temp_dict = {}
        var_name = heading

        min_val = x.iloc[:, n].min()
        max_val = x.iloc[:, n].max()

        temp_dict['name'] = var_name
        temp_dict['max'] = max_val.item()
        temp_dict['min'] = min_val.item()

        if flag == 0:
            temp_dict['value'] = round((max_val.item()+min_val.item())/2, 2)
        else:
            temp_dict['value'] = predictor_input_values[n]

        input_data_list.append(temp_dict)
    #print("input_data_list = ", input_data_list)

    input_dict["data"] = input_data_list
    print("input_dict = ", input_dict)
    return input_dict

#input_dict = input_manger()
#print(input_dict)


if __name__ == "__main__":
    main()
