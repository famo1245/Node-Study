const fs = require('fs');
const dirName = './data';

fs.readdir(dirName, (err, fileList) => {
  console.log(fileList);
});
