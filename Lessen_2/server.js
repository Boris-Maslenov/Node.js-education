const http = require('http');
const fs = require('fs');
const path = require('path');

class Server {
    // PORT, FOLDER_PATH
    // ? - зачем передавать host если сервер запускается по адресу localhost ?
    constructor(PORT=3000, FOLDER_PATH='public') {
        this.port = PORT;
        this.FOLDER_PATH = FOLDER_PATH;
        this.server;
        this.body = [];
        this.routesPOST = [];
        this.routesGET = [];
        this.init();
    }

    post(route, cb){
        this.routesPOST.push([route, cb]);
    }

    get(route, cb){
        this.routesGET.push([route, cb]);
    }

    getHeaders(ext) {
        switch(ext) {
            case 'jpg' :
            case 'JPG' :
            case 'png' : 
            case 'ico' :
            case 'svg' :
            case 'webp' :
            case 'gif' :
                return {'Content-Type' : `image/${ext}`};    
            case 'jpg' :
            return {'Content-Type' : `application/x-javascript`};
            case 'css' :
                return {'Content-Type' : `text/css`};      
            case 'woff2' :
                return {'Content-Type' : `application/font-woff2`};   
            case 'woff' :
                return {'Content-Type' : `application/font-woff`};   
            default :
                return {'Content-Type' : 'text/html'}; 
        }
    }

    isEndpoint(url, routes) {
        let result = [false, ''];
        if(routes.length > 0) {
            for(let i = 0; i < routes.length; i++) {
                     const value = routes[i][0];
                    if(value === url){
                        result[1] = i;
                        result[0] = true;
                    }
            }
        }
        return result;
    }

    init(){
        this.server = http.createServer((request, response) => {
            const url = request.url;
            const method = request.method;
            // Обработка эндпойнтов 
                if (method === 'POST') {
                    const [isRoute, index] = this.isEndpoint(url, this.routesPOST); // проверяем есть ли маршрут, и возвращаем его индекс из массива маршрутов
                    if(isRoute) { // маршрут найдет можно обрабатывать
                        const cb = this.routesPOST[index][1]; // коллбэк на найденный роут
                        request.on('data', chunk => { // дождемся получения данных
                            // полученнве данные положим в request.body чтобы можно было использовать дальше
                                request.body = chunk.toString();
                                // запускаем коллбэк
                                cb(request, response);
                        });
                        
                    } else {
                        response.writeHead( 404, {'Content-Type' : 'text/html'});
                        response.end();
                    }
        
                } else if(method === 'GET') {
                    const [isRoute, index] = this.isEndpoint(url, this.routesGET);
                    if(isRoute) { 
                        const cb = this.routesGET[index][1]; 
                        // в идеале можно еще распарсить строку querу для удобства
                        cb(request, response);
                    } else {
                           // Если роуты не найдены то отдаем статику //
                           let filePatch = path.join(__dirname, url === '/' ? `/${this.FOLDER_PATH}/index.html` : `/${this.FOLDER_PATH}/${url}`);
                           const extName = path.extname(filePatch); 
                           const extNameNotDot = extName.replace('.', '');
                           extName === '' ? filePatch += 'index.html' : void 0;
                               fs.readFile(filePatch, (err, data) => {
                                   if(err){
                                       response.writeHead( 404, this.getHeaders(extNameNotDot) );
                                       response.end('<h1>404 - Page Not Found</h1>'); //
                                   };
                                   response.writeHead( 200, this.getHeaders(extNameNotDot) );
                                   response.end(data);
                               });
                    }
                } 
        });
    }
    start(){
        this.server.listen(this.port ,() => {
            console.log(`Сервер успешно запущен на ${this.port} порту!`);
        });
    }
}

module.exports = Server;











