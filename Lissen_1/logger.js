const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'logFn.txt'); 

const logger = (fn) => (...args) => {
    const resultOb = {
                resultFn: fn(...args),
                time: new Date(),
                fnName: fn.name,
            };      
    fs.appendFile(filePath, JSON.stringify(resultOb), (error) => {
        if (error) {
            throw error;
        }
    });
    return resultOb.resultFn;
}

// Пример: использования
const sum = (a, b) => {
    return a + b;
}

const sumLogger = logger(sum);

console.log(sumLogger(1,2));
console.log(sumLogger(10,2));
console.log(sumLogger(0,5));
console.log(sumLogger(12,12));
console.log(sumLogger(13,24));
