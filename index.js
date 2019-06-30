var request = require('requestify');
var cache = require('memory-cache');
const express = require("express");
const app = express();
const server_url = process.env.PORT ? 'https://hypechat-taller2-staging.herokuapp.com/' : 'http://127.0.0.1:8000/';

app.use(function (req, res, next) {
  if(cache.get(req.query.user) == null) {
    next();
  } else {
    res.json({message: 'No puedo responder porque fui muteado por ' + cache.get(req.query.user) + ' segundos.'});
  }
});

app.get('/', function (req, res) {
  res.json({message: 'Hola ' + req.query.user + '. Escribí "@tito help" para ver los comandos disponibles.'});
});

app.get('/help', function (req, res) {
  res.json({message: '"@tito help": muestra los comandos disponibles.\n' +
                     '"@tito info": muestra información del canal: integrantes, cantidad de mensajes, etc.\n' +
                     '"@tito mute <n>": desactiva respuestas por n segundos.\n' +
                     '"@tito me": muestra información del usuario que envía el mensaje.'});
});

app.get('/info', function (req, res) {
  request.get(server_url + 'organization/' + req.query.org).then(function (response) {
    let body = response.getBody();
    res.json({message: 'Nombre del canal: ' + req.query.channel + '\n' +
                       'Creador: ' + body.owner + '\n' +
                       'Descripción: ' + body.description + '\n' +
                       'Cantidad de mensajes: ' + body.messages + '\n' +
                       'Cantidad de integrantes: ' + body.members});
  });
});

app.get('/me', function (req, res) {
  request.get(server_url + 'profile/' + req.query.user).then(function (response) {
    let body = response.getBody();
    res.json({message: 'Nombre de usuario: ' + req.query.user + '\n' +
                       'Nombre: ' + body.first_name + '\n' +
                       'Apellido: ' + body.last_name + '\n' +
                       'Email: ' + body.email});
  });
});

app.get('/mute%20:seconds(\\d+)', function (req, res) {
  cache.put(req.query.user, req.params.seconds, Number(req.params.seconds) * 1000);
  res.json({message: 'Ahora estoy muteado por ' + req.params.seconds + ' segundos.'});
});

app.use(function(req, res, next) {
  res.status(404).json({message: 'No entiendo el mensaje.'});
});

app.listen(process.env.PORT || 3000);
