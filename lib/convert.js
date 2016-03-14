const path = require('path');
const exec = require('child-process-promise').exec;

module.exports = function(input, output) {

    console.log(path.join(__dirname, '../bin'));

    // cd ../bin
    process.chdir(path.join(__dirname, '../bin'));

    // To convert
    return exec('java -jar webvector-3.4.jar ' + input + ' ' + output + ' svg');
};
