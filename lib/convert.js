const path = require('path');
const exec = require('child-process-promise').exec;

/**
 * Convert
 *
 * @param  {string} input
 * @param  {string} output
 * @return {Promise}       Command execute result
 */
module.exports = function(input, output) {
    // cd ../bin
    process.chdir(path.join(__dirname, '../bin'));

    // To convert
    return exec('java -jar webvector-3.4.jar ' + input + ' ' + output + ' svg');
};
