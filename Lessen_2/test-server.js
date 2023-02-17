const Server = require('./server');

const serv = new Server(3001);
serv.init();
serv.start(); 
serv.post('/materials', (req, res) => {
    console.log(req.body);
    // Действия по обработке запроса (обработка данных возврат статусов и заголовокв)
    res.writeHead( 201, {'Content-Type' : `application/json`} );
    res.end();
});
serv.get('/materials', (req, res) => {
    console.log(req, res);
    // Действия по обработке запроса (обработка данных возврат статусов и заголовокв)
    res.writeHead( 200, {'Content-Type' : `application/json`} );
    res.end();
});

serv.get('/cars', (req, res) => {
    console.log(req, res);
    // Действия по обработке запроса (обработка данных возврат статусов и заголововков)
    res.writeHead( 200, {'Content-Type' : `application/json`} );
    res.end();
});