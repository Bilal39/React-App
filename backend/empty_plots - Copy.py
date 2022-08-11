from flask import Flask, render_template, url_for, request
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
from time import sleep
from pathlib import Path
import os



predictor_default_value_path = os.path.join(os.getcwd(), 'assests', "predictor_default_value.ini")

# Truncating file to reset default values
with open(predictor_default_value_path, 'r+') as f:
    f.truncate(0)

# check if size of file is 0
if os.stat(predictor_default_value_path).st_size == 0:
    print('File is empty')
else:
    print('File is not empty')

#with open(predictor_default_value_path) as f:
#    print("Entered in the file")
#    lines = f.readlines()
#    for line in lines:
#        inputnumber = int(line)
#        print("Input Number = ", line)
#        if inputnumber == None:
#            print("YES it is None")