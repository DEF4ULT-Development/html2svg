/**
 * Created by gaofeng on 16/3/17.
 */

const path = require('path');
const html2svg = require('../index');

const input = 'file://' + path.join(__dirname, './documents/button.html');
const output = path.join(__dirname, './svgs/button.svg');


html2svg({input, output})
    .then(path => {
        console.log(path);
    })
    .catch(err => {
        console.error(err);
    });
