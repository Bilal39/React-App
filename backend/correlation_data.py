import pandas as pd
from scipy.stats import pearsonr

def correlation_among_data(file_path):

    # Reading the data
    data_df = pd.read_csv(file_path, header=1)

    # Splitting Data into Inputs and Outputs
    x = data_df.iloc[:, :-1]
    y = data_df.iloc[:, -1]

    # Getting Column names
    column_names = x.columns.tolist()

    ## Getting Correlation among inputs and output
    corr_data_list = []
    
    total_columns = len(data_df.columns)

    for n in range(total_columns - 1):
        temp_corr_dict = {}
        data1= data_df.iloc[:,n]
        data2= data_df.iloc[:,total_columns-1]

        data1 = pd.to_numeric(data1, errors='coerce').fillna(0, downcast='infer')
        data2 = pd.to_numeric(data2, errors='coerce').fillna(0, downcast='infer')

        # Finding Pearson correlation
        print("data1 = ", data1)
        print("data2 = ", data2)

        corr, _ = pearsonr(data1, data2)

        #print('Pearsons correlation: %.3f' % corr)
        temp_corr_dict['name'] = data_df.columns[n]
        temp_corr_dict["val"] = round(corr,3)
        corr_data_list.append(temp_corr_dict)
    
    ### Getting correlation among inputs
    temp_corr_dict = {}
    corr_matrix = x.corr().to_numpy().tolist()
    temp_corr_dict["matrix"] = corr_matrix
    corr_data_list.append(temp_corr_dict)

    return column_names, corr_data_list

if __name__ == "__main__":
    main()
