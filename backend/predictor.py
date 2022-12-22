import os
import pickle


def predictor_func(input_values):
    train_model_path = os.path.join(os.getcwd(), 'assests', "gam_model.pkl")

    # load model
    with open(train_model_path, 'rb') as f:
        gam = pickle.load(f)

    print("input values to be predicted = ", input_values)
    print(type(input_values[0]))
    output_prediction = gam.predict([input_values])
    output_prediction = round(output_prediction[0],3)
    #print("output_prediction = ", output_prediction)

    return output_prediction


if __name__ == "__main__":
    main()
