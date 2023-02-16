const http = require('http');
const fs = require('fs');
const path = require('path');

const FOLDER_PATH = 'public';

const PORT = process.env.PORT || 3000;
const server = http.createServer((request, response) => {

    //console.log(request.url);
    //console.log(request.headers.accept.split('/')[0]); //
    const headerAccept = request.headers.accept.split('/')[0];
    console.log(headerAccept);
    // если запрос на главную => ищем index.html, в противном случае ищем файл  по url в папке public
    let  filePatch = path.join(__dirname, request.url === '/' ? `/${FOLDER_PATH}/index.html` : `/${FOLDER_PATH}/${request.url}`);
    // Если в запросе нет расширения ищем index.html  в папке
    path.extname(filePatch) === '' ? filePatch += 'index.html' : void 0;

    function getHeaders(extName) {
        const extNameNotDot = extName.replace('.', '');
        switch( extNameNotDot ){
        case 'jpg' :
            return {'Content-Type' : 'image/jpg'};   
        case 'JPG' :
            return {'Content-Type' : 'image/jpg'};
        case 'png' :
                return {'Content-Type' : 'image/png'};
        case 'ico' :
                return {'Content-Type' : 'image/ico'};          
        default :
            return  {'Content-Type' : 'text/html'}; 
        }
    }
    response.writeHead(200, getHeaders(path.extname(filePatch)));

    fs.readFile(filePatch, (err, data) => {
        if(err){
            response.end('<h1>404</h1>');
        };
        response.end(data);
    });

});

server.listen(PORT ,() => {
    console.log(`Сервер успешно запущен на ${PORT} порту!`);
})