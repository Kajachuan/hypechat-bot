var request = require('requestify');
var cache = require('memory-cache');
const express = require("express");
const app = express();
const server_url = process.env.PORT ? 'https://hypechat-taller2-staging.herokuapp.com/' : 'http://127.0.0.1:8000/';

app.use(function (req, res, next) {
  if(cache.get(req.query.user) == null) {
    next();
  } else {
    res.json({message: 'No puedo responder porque fui muteado por ' + cache.get(req.query.user) + ' segundos'});
  }
});

app.get('/', function (req, res) {
  res.json({message: 'Hola ' + req.query.user + '. Escribí "@tito help" para ver los comandos disponibles'});
});

app.get('/help', function (req, res) {
  res.json({help: '"@tito help": muestra los comandos disponibles.',
            info: '"@tito info": muestra información del canal: integrantes, cantidad de mensajes, etc.',
            mute: '"@tito mute <n>": desactiva respuestas por n segundos.',
            me: '"@tito me": muestra información del usuario que envía el mensaje.'});
});

app.get('/info', function (req, res) {
  request.get(server_url + 'organization/' + req.query.org).then(function (response) {
    let body = response.getBody()
    res.json({name: body.name,
              owner: body.owner,
              description: body.description})
  });
});

app.get('/me', function (req, res) {
  request.get(server_url + 'profile/' + req.query.user).then(function (response) {
    let body = response.getBody()
    res.json({username: user,
              first_name: body.first_name,
              last_name: body.last_name,
              email: body.email})
  });
});

app.get('/mute%20:seconds(\\d+)', function (req, res) {
  cache.put(req.query.user, req.params.seconds, Number(req.params.seconds) * 1000);
  res.json({message: 'Ahora estoy muteado por ' + req.params.seconds + ' segundos'});
});

app.listen(process.env.PORT || 3000);
