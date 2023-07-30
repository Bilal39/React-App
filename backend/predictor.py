import joblib
import xgboost as xgb
import numpy as np


def predictor_func(input_values, train_model_path):
    ### This function is responsible for predicting values based on user given inputs

    # load the model
    model = joblib.load(train_model_path)
    input_values = [float(value) for value in input_values]

    try:
        output_prediction = model.predict([input_values])
    except:
        # For XGBoost
        input_values = np.array(input_values).reshape(1, -1)
        dinput_values = xgb.DMatrix(input_values)
        output_prediction = model.predict(dinput_values)
    
    output_prediction = round(float(output_prediction[0]),3)

    return output_prediction


if __name__ == "__main__":
    main()
