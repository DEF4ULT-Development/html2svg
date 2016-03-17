const convert = require('./lib/convert');

module.exports = function(options) {
    var input = options.input;
    var output = options.output;

    if (!input) {
        throw new Error('Please set the input filename');
    }

    if (!output) {
        throw new Error('Please set the output filename');
    }

    return convert(input, output).then(res => {
        if (+res.childProcess.exitCode !== 0 || res.stderr.indexOf('Done') === -1) {
            throw new Error(res.stderr || 'Error occurred!');
        }

        return output;
    });

};