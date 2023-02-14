const http = require('http');
// const fs = require('fs');
// const path = require('path');

const PORT = process.env.PORT || 3000;
const server = http.createServer((request, response) => {
    console.log(request.url);
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.end('<h1>Title</h1>');
});

server.listen(PORT ,() => {
    console.log(`Сервер успешно запущен на ${PORT} порту!`);
})