// Your input and output data
var xData = [3902.25, 11247.72, 15215.72, 9847.35, 10014.93, 10407.58];
var yData = [850, 600, 500, 650, 600, 600];
// Define the model: f(x) = a / (x + b) + c
function model(x, a, b, c) {
    return a / (x + b) + c;
}
// Initial guess for the parameters a, b, c
var initialGuess = [1, 1, 1];
// Function to calculate the sum of squared residuals
function sumOfSquaredResiduals(params) {
    var a = params[0], b = params[1], c = params[2];
    var sum = 0;
    for (var i = 0; i < xData.length; i++) {
        var residual = yData[i] - model(xData[i], a, b, c);
        sum += residual * residual;
    }
    return sum;
}
// Simple gradient descent for optimization
function gradientDescent(xData, yData, initialGuess, learningRate, iterations) {
    var params = initialGuess;
    for (var i = 0; i < iterations; i++) {
        var gradients = [0, 0, 0];
        for (var j = 0; j < xData.length; j++) {
            var a_1 = params[0], b_1 = params[1], c_1 = params[2];
            var residual = yData[j] - model(xData[j], a_1, b_1, c_1);
            gradients[0] += -2 * residual * (-1 / Math.pow((xData[j] + b_1), 2));
            gradients[1] += -2 * residual * (a_1 / Math.pow((xData[j] + b_1), 2));
            gradients[2] += -2 * residual;
        }
        params[0] -= learningRate * gradients[0];
        params[1] -= learningRate * gradients[1];
        params[2] -= learningRate * gradients[2];
    }
    return params;
}
// Fit the model to the data
var params = gradientDescent(xData, yData, initialGuess, 0.0001, 10000);
// Extract the fitted parameters
var a = params[0], b = params[1], c = params[2];
console.log("Fitted parameters: a = ".concat(a, ", b = ").concat(b, ", c = ").concat(c));
