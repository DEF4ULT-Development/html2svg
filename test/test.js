const path = require('path');
const html2svg = require('../index');

const input = 'file://' + path.join(__dirname, './documents/button.html');
const output = path.join(__dirname, './output.svg');

html2svg({input, output}).then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});