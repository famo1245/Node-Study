const fs = require('fs');

console.log('A');
// const result = fs.readFileSync('./sample.txt', 'utf8');
// console.log(result);
fs.readFile('./sample.txt', 'utf8', (err, data) => {
  console.log(data);
});
console.log('C');
