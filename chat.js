var http = require('http'),
    sys  = require('sys'),
    fs   = require('fs'),
    ws   = require('./ws.js');

var clients = [];

http.createServer(function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  
  var rs = fs.createReadStream(__dirname + '/template.html');
  sys.pump(rs, response);
  
}).listen(4000);

ws.createServer(function(websocket) {
  
  var username;
  
  websocket.on('connect', function(resource) {
    clients.push(websocket);
    websocket.write('Digite seu username:');
  });
  
  websocket.on('data', function(data) {
    if (!username) {
      username = data.toString();
      websocket.write('Bem vindo, ' + username + '!');
      return;
    }
    
    var feedback = username + ' disse: ' + data.toString();
    
    clients.forEach(function(client) {
      client.write(feedback);
    });
  });
  
  websocket.on('close', function() {
    var pos = clients.indexOf(websocket);
    if (pos >= 0) {
      clients.splice(pos, 1);
    }
  });
  
}).listen(8080);