const fs = require('fs');
let inputPath = "../data/Shopee_HaNoi.csv";

const data = fs.readFileSync(inputPath, "utf8").split("\n");

console.log(data[0]);


