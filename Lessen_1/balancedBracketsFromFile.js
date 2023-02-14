const path = require('path');
const fs = require('fs');
const readline = require('readline');
const brackets = require('./brackets.js')
const {readFile} = fs;
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const outputFileName = 'output.txt'; // Имя файла с результатом
const filePath = path.join(__dirname, outputFileName); // Путь до файла с результатом

// Определение результата
const getResult = (data) => {
  const result = brackets( data.trim() );
  return result ? 'cкобки сбалансированы' : 'cкобки не сбалансированы';
}

// Читаем данные из файла в кодировке utf-8
const readDataFromFile = (fileName) => {
  readFile(`${__dirname}/${fileName}`, 'utf-8',  (err, data) => {
    if (err) throw err;
    writeDataInFile(data);
  });
}

// Записываем данные в файл 
const writeDataInFile = (data) => {
    const dataForWrite = getResult(data);  // Определим результат
    fs.appendFile(filePath, `${data}: ${dataForWrite}\n`, (error) => {
      if (error) {
        throw error;
      }
      console.log(`Результат записан в файл ${outputFileName}`)
  });
}

rl.question('Файл источник: ', (answer) => {
  //ps эту проверку можно не делать так как из консоли всегда тип string
  if( typeof answer !== 'string') {
    throw new Error('Аргумент должен быть строкой!');
  }
  readDataFromFile(answer);
  rl.close();
});

