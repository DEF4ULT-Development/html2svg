## html2svg convertor

An essy-used wrapper for [cloud-convert](https://cloudconvert.com/api).

Before using it, you need apply an [API](https://cloudconvert.com/pricing) for cloud service.

## Installation

Available on NPM as fetch.

```bash

$ tnpm install html2svg

```

## Usage

#### Implement Promise (es6)
```javascript

const html2svg = require('html2svg');

html2svg({
    apiKey: 'xxxxx',
    input: '/root/path/file.ext',
    needDownload: false
}).then(downloadUrl => {
    return console.log(downloadUrl); // return svg download url
}).catch(err => {
    console.error(err);
});

```

#### Work with async-await (es7)

```javascript
const html2svg = require('html2svg');

(async function() {

  try {
    var res = await html2svg({
      apiKey: 'xxxxx',
      input: '/root/path/file.ext',
      needDownload: false
    })
    console.log(res);
  } catch(err) {
    console.error(err)
  }

}());
```
## Config

| Param | Description | required | default | tip |
|---|---|---|---|---|
| apiKey | A key apply on [cloudconvert](https://cloudconvert.com/pricing) | true  | null  | - |
| input  |  Input path with file name | true  | null  | - |
| needDownload  | Download option | false  | false  | If you want to download svg file, set it true. Otherwise, it will return download url.  |
| output  | Ouput path with file name | false |  null  | If needDownload option is true, this option must be provided |

## Tips

- You need write style-sheet code inline HTML document to perform svg image better.

## Support

Please [open an issue](https://github.com/fraction/readme-boilerplate/issues/new) for support.





