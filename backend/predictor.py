import os
import joblib


def predictor_func(input_values, model_file_name):
    train_model_path = os.path.join(os.getcwd(), 'assests',"trained_models", model_file_name)

    # load the model
    gam = joblib.load(train_model_path)
    
    output_prediction = gam.predict([input_values])
    output_prediction = round(output_prediction[0],3)

    return output_prediction


if __name__ == "__main__":
    main()
