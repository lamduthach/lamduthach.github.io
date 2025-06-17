const fs = require('fs');
const path = require('path');

const csvReadPath = "cf/report";
const csvWritePath = "cf/today.csv";

fs.readFile(csvReadPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const filtered = data
    .split('\n')
    .filter(line => line.includes('	Error	'))
    .join('\n');

  fs.writeFile(csvWritePath, filtered, 'utf8', err => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Rows containing "	Error	" have been kept.');
    }
  });
});
