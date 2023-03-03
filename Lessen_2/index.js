require('dotenv').config();
console.log(process.env.MY_URL);

const http = require('http');
const fs = require('fs');
const path = require('path');

const FOLDER_PATH = 'public';
const PORT = process.env.PORT || 3000;

function getHeaders(ext) {
    switch(ext){
    // if images:
    case 'jpg' :
    case 'JPG':
    case 'png': 
    case 'ico':
    case 'svg':
    case 'webp':
    case 'gif':
        return {'Content-Type' : `image/${ext}`};    
    // add other ext-s....
    case 'jpg' :
    return {'Content-Type' : `application/x-javascript`};
    case 'css' :
        return {'Content-Type' : `text/css`};      
    case 'woff2' :
        return {'Content-Type' : `application/font-woff2`};   
    case 'woff' :
        return {'Content-Type' : `application/font-woff`};   
    default :
        return  {'Content-Type' : 'text/html'}; 
    }
}

const server = http.createServer((request, response) => {
    let  filePatch = path.join(__dirname, request.url === '/' ? `/${FOLDER_PATH}/index.html` : `/${FOLDER_PATH}/${request.url}`);
    const extName = path.extname(filePatch); 
    const extNameNotDot = extName.replace('.', '');
    extName === '' ? filePatch += 'index.html' : void 0;
        
        fs.readFile(filePatch, (err, data) => {
            if(err){
                response.writeHead( 404, getHeaders(extNameNotDot) );
                response.end('<h1>404 - Page Not Found</h1>'); // лучше возвращать страницу 404, но пока так
            };
            response.writeHead( 200, getHeaders(extNameNotDot) );
            response.end(data);
        });
});

server.listen(PORT ,() => {
    console.log(`Сервер успешно запущен на ${PORT} порту!`);
});
