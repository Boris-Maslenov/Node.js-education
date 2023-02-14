const brackets = require('./brackets.js');

const balancedBracketsFromCmd = () => {
    const argument = process.argv[2];
    if( typeof argument !== 'string'){
        throw new Error('Аргумент должен быть строкой!')
    }
    const result = brackets(argument);
    console.log(result ? 'Скобки сбалансированы' : 'Скобки не сбалансированы');
}

balancedBracketsFromCmd();