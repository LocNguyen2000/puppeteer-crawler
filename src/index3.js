const fs = require('fs')

let inputPath = './test.csv'
let urls = []

const data = fs.readFileSync(inputPath, 'utf8' ).split('\r\n')

data.shift()
data.pop()

console.log(data);

// console.log("urls: ", JSON.stringify(data));


