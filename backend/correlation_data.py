import pandas as pd

def correlation_among_data(file_path,checked_array):

    # Reading the data
    data_df = pd.read_csv(file_path, header=1)
    data_df_refer = pd.read_csv(file_path, header=1)

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    x_refer = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    for n,status in enumerate(checked_array):
        if status == True:
            #print("It's True")
            pass
        else:
            #print("It's False")
            #print(x_refer.iloc[:,n].name)
            data_df = data_df.drop(data_df_refer.iloc[:,n].name, axis=1)
    #print("data_df.head() = ",data_df.head())
    

    ## Getting Correlation among inputs and output
    corr_data_list = []
    
    ### Getting correlation among inputs
    temp_corr_dict = {}
    #print("##########Correlation = \n", data_df.corr().to_numpy())
    corr_matrix = data_df.corr().to_numpy().tolist()
    temp_corr_dict["matrix"] = corr_matrix
    corr_data_list.append(temp_corr_dict)
    #print("column_names = ", column_names)

    return corr_data_list

if __name__ == "__main__":
    main()
