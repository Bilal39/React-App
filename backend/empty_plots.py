from flask import Flask, render_template, url_for, request
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
from time import sleep
from pathlib import Path
import os





def empty_plots():
    histogram_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "plots","histogram.png" )
    training_plot_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "plots", "training_plot.png" )
    testing_plot_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "plots", "testing_plot.png" )
    smooth_func_path = os.path.join(os.path.dirname(os.getcwd()),"src", "assests", "plots", "smooth_func.png" )

    plt.switch_backend('agg')
    plt.figure()
    plt.grid()
    plt.title("Training Plot")
    plt.xlabel('Actual values')
    plt.ylabel('Predicted values')
    plt.savefig(training_plot_path)
    plt.switch_backend('agg')

    plt.figure()
    plt.grid()
    plt.title("Testing Plot")
    plt.xlabel('Actual values')
    plt.ylabel('Predicted values')
    plt.savefig(testing_plot_path)
    plt.switch_backend('agg')

    plt.figure()
    plt.grid()
    plt.title("Histogram")
    plt.xlabel("Output Values")
    plt.ylabel("Number of times")
    plt.savefig(histogram_path)
    plt.switch_backend('agg')


    plt.figure()
    plt.grid()
    plt.title("Smooth Function")
    plt.xlabel("X")
    plt.ylabel("S(X)")
    plt.savefig(smooth_func_path)
    plt.switch_backend('agg')

empty_plots()

#if __name__ == "__main__":
#    main()