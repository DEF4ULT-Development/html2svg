const fs = require('fs');
const Cloudconvert = require('cloudconvert');
const fetchUrl = require('./fetch_url');

module.exports = function(options) {
    var input = options.input;
    var output = options.output;
    var apiKey = options.apiKey;
    var needDownload = options.needDownload;

    var cloudconvert = new Cloudconvert(apiKey);

    return new Promise(function(resolve, reject) {

        // Create Stream
        fs.createReadStream(input).pipe(cloudconvert.convert({
            "inputformat": "html",
            "outputformat": "svg"
        }).on('error', function(err) {
            reject(err);
            console.error('Failed: ' + err);
        }).on('finished', function(data) {
            console.log('Done: ' + data.message);

            if (needDownload) {
                this.pipe(fs.createWriteStream(output)).on('finish', function () {
                    resolve('Downloaded! Path: ' + output);
                });
            } else {
                fetchUrl(data.url, resolve, reject);
            }
        }));

    });
}
