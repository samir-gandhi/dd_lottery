// Trivial example: find greatest common divisor for two positive numbers
var div = 2
var gcd = 1;

if (parameters.n1 < 2 || parameters.n2 < 2) {
    return {
        n1: parameters.n1,
        n2: parameters.n2,
        gcd: 1,
        message: "One or both of your parameters were less than 2, so the result is 1"
    };
}

if (parameters.n1 > 1000000000000 || parameters.n2 > 1000000000000) {
    return {
        n1: parameters.n1,
        n2: parameters.n2,
        gcd: null,
        message: "One or both of your parameters were greater than 1,000,000,000,000, so the result is too expensive to compute"
    };
}

while (parameters.n1 >= div && parameters.n2 >= div) {
    if (parameters.n1%div === 0 && parameters.n2%div === 0) {
        gcd = div;
    }
    div++;
}

return {
    n1: parameters.n1,
    n2: parameters.n2,
    gcd: gcd
};
