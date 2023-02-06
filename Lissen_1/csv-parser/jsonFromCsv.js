const fs = require('fs');
const path = require('path');
var iconv = require('iconv-lite');

const inputFile = 'name_java.csv';
const outputFile = 'name_java.json';
const filePath = path.join(__dirname, inputFile);


const parseDataInJson = (data) => {

    const dataToStr = iconv.decode(data, 'win1251');
    const dataToArray  = dataToStr.replaceAll('\r\n', ',').split(',');
    if(dataToArray.length === 0){
        console.log('В файле не найдены строки');
        return false;
    }
    const mainKey = dataToArray[0].toLowerCase();
    let resultObj = {};
    resultObj[mainKey] = [];
    for(let i = 1; i < dataToArray.length; i++){
        const stepValue = dataToArray[i];
        if(stepValue === '') continue;
        resultObj[mainKey].push(stepValue)
    }
 
    return  JSON.stringify(resultObj);

}

const jsonFromCsv = () => {
    if( path.extname(filePath) !== '.csv'){
        throw new Error('Не верный формат файла');
    }
    fs.readFile(filePath, null,(err, data) => {
        if (err) throw err;
        const dataJson = parseDataInJson(data);
        fs.writeFile(`${__dirname}/${outputFile}`, dataJson, (error) => {
            if (error) {
                throw error;
            }
            console.log(`Файл ${outputFile} успешно обновлен`);
        });
    });

}

jsonFromCsv();