import 'source-map-support/register';
import http from 'http';
import uws from 'uws';
import connect from 'connect';
import portfinder from 'portfinder';
import serveStatic from 'serve-static';
import serveFavicon from 'serve-favicon';

const app = connect();
const SocketServer = uws.Server;

app.use(serveFavicon('./public/favicon.ico'));
app.use(serveStatic('./public', { index: ['index.html'] }));

portfinder.basePort = 3000;
portfinder.getPort((err, port) => {
  if (err)
    console.log(err.message);

  const server = http.createServer(app).listen(port, () => {
    console.log(`Server started: http://127.0.0.1:${port}`);
  });

  const wss = new SocketServer({ server });
  const sockets = [];

  wss.on('connection', (socket) => {
    sockets.push(socket);

    socket.on('message', (arrayBuffer) => {
      console.log('state:', new Uint8Array(arrayBuffer));
      sockets.forEach((s) => {
        if (s !== socket)
          s.send(arrayBuffer);
      });
    });
  });
});
