var bin = require('../');

bin({
    apiKey: 'ClOXSfzsI7yL9ywbVUBg8r1BXySYHrkzffBOaNRWvsIxeWOUekA8ll7OwIwS6MQTx6O-uTYw6P5QR4wOAUDNdQ',
    html: '/Users/gaofeng/work/html2svg/test/documents/button.html',
    needDownload: true,
    output: './out.svg'
}).then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});