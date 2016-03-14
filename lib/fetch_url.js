const url = require('url');
const request = require('request');

module.exports = function(dataUrl, resolve, reject) {

    request({
        url: 'http:' + dataUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    }, function(err, res, body) {
        if (err) {
            return reject(err);
        }

        resolve(JSON.parse(body).output.url);
    });
};

