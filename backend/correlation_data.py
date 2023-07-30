import pandas as pd

def correlation_among_data(file_path,checked_array):
    ### This function is responsible for generating correlation among inputs and output
    # Reading the data
    data_df = pd.read_csv(file_path, header=1)
    data_df_refer = pd.read_csv(file_path, header=1)

    # Checking if the columns are selected for correlation
    for n,status in enumerate(checked_array):
        if status == True:
            pass
        else:
            data_df = data_df.drop(data_df_refer.iloc[:,n].name, axis=1)
    
    corr_data_list = []
    # Getting correlation among inputs
    temp_corr_dict = {}
    corr_matrix = data_df.corr().to_numpy().tolist()
    temp_corr_dict["matrix"] = corr_matrix
    corr_data_list.append(temp_corr_dict)

    return corr_data_list

if __name__ == "__main__":
    main()
