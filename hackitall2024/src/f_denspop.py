import numpy as np
from scipy.optimize import curve_fit

def fit_model():
    # Your input and output data
    x_data = np.array([3902.25, 11247.72, 15215.72, 9847.35, 10014.93, 10407.58])
    y_data = np.array([850, 600, 500, 650, 600, 600])

    # Define the model: f(x) = a / (x + b) + c
    def model(x, a, b, c):
        return a / (x + b) + c

    # Fit the model to the data
    params, _ = curve_fit(model, x_data, y_data)

    # Extract the fitted parameters
    a, b, c = params
    print(f"Fitted parameters: a = {a}, b = {b}, c = {c}")
    
    return a, b, c

