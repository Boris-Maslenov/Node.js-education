const net = require('node:net');

let clientsMap = {}; ///{ id : socket }
let namesMap = {}; /// { id : name }

// Отправка сообщения для всеx участников чата:
const toAllMessage = (data) => {
  const clientsCort = Object.entries(clientsMap);
  if ( clientsCort.length > 0 ) {
      clientsCort.forEach( ([_, socket]) => {
      socket.write(data);
   });
  }
};

const getTime = () => {
  return new Date().toLocaleTimeString();
}

const server = net.createServer((socket) => {
   socket.id = `${socket.remoteAddress}:${socket.remotePort}`; // сформируем id клиента (как это сделать верно ?)
   const id = socket.id;
   clientsMap[id] = socket;
   socket.setNoDelay(true);

   socket.on('data', (data) => {
        // первое сообщение от клиента это его Имя => сопоставляем id  из clientsMap с namesMap чтобы находить имя клиента по id в будущем
        if (!namesMap[id]) {
          // Добавили имя к id сокета
          namesMap[id] = data.toString();
          // Уведомление всех о подключении нового участника чата:
          // Сформируем сообщение
          const message = `=> ${getTime()}: пользователь ${namesMap[id]} подключился к чату`;
          // Разошлем всем участникам
          toAllMessage(message);
        } else {
            // Если пишет существующий клиент
            const message = `=> ${namesMap[id]} (${getTime()}) : ${data} `;
            toAllMessage(message);
        }
   });

  socket.on('end', (arg) => {
    console.log('close'); // есть способ отследить какой именно socket отключился? чтобы передать сообщенеие всем об отключении клиента

  });

   socket.on('error', (err) => {
     console.log('Socket error', err);
   });
 })

server.on('error', (err) => {
 console.log('Server error', err);
});

server.listen(3000);


