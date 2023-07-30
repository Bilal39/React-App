import pandas as pd
import pandas as pd


def input_manger(updated_data_file):
    ### This function is responsible for extracting data such as inputs names, their ranges etc from user file
    # Initializing objects
    input_data_list = []
    input_dict = {}

    # Reading the data
    data_df = pd.read_csv(updated_data_file)
    x = data_df.iloc[:, :-1]

    # Extracting Information
    for n, heading in enumerate(x.columns):
        temp_dict = {}
        var_name = heading
        min_val = x.iloc[:, n].min()
        max_val = x.iloc[:, n].max()
        temp_dict['name'] = var_name
        temp_dict['max'] = max_val.item()
        temp_dict['min'] = min_val.item()
        temp_dict['value'] = round((max_val.item()+min_val.item())/2, 2) # Taking Avg
        input_data_list.append(temp_dict)

    input_dict["data"] = input_data_list
    return input_dict


if __name__ == "__main__":
    main()
