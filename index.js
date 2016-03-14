const convert = require('./lib/convert');

module.exports = function(options) {
    var input = options.input;
    var output = options.output;
    var apiKey = options.apiKey;
    var needDownload = options.needDownload;

    if (!html) {
        throw new Error('Please set the input filename');
    }

    if (needDownload && !output) {
        throw new Error('Please set the output path with file\'s name');
    }

    if (!apiKey) {
        throw new Error('Please provide API Key');
    }

    return convert({
        input,
        output,
        apiKey,
        needDownload
    });

};