const io = require('../io');
const requestJson = require('request-json');
const crypt = require('../crypt');

const mLabAPIKey = "apiKey=" + process.env.MLAB_API_KEY;

function getUsersV1(req, res) {
  console.log("GET /apitechu/v1/users");
  console.log(req.query.count);
  console.log(req.query.top);

  var top = req.query.top;
  var count = req.query.count;
  var users = require('../usuarios.json');

  var retorno = {}

  if(count == undefined && top == undefined){
    retorno.users = users;
  }else if(count == 'true' && top == undefined){
    retorno.count = users.length;
    retorno.users = users;
  }else if(top != undefined && count == undefined){
    retorno.top = users.slice(0,top);
    retorno.users = users;
  }else if(count == 'true' && top != undefined){
    retorno.top = users.slice(0,top);
    retorno.count = users.length;
    retorno.users = users;
  }

  res.send(retorno);
}

function getUserByIdV2(req, res) {
  console.log("GET /apitechu/v2/users/:id");


  const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";
  var httpClient = requestJson.createClient(baseMLabURL);
  console.log("Client created");

  var id = Number.parseInt(req.params.id);
  console.log("La id del usuario a buscar es :" + id);

  var query = "q=" + JSON.stringify({"id":id});

  httpClient.get("user?" + query + "&" + mLabAPIKey,
    function(err, resMLab, body) {
      if (err) {
        var response = "Se ha producido un error al recuperar los usuarios";
        res.status(500);
      } else {
        if (body.length > 0) {
          var response = body[0];
        } else {
          var response = {
            "msg" : "Usuario no encontrado"
          }
          res.status(404);
        }
      }

      res.send(response);
    }
  )
}

function getUsersV2(req, res) {
  console.log("GET /apitechu/v2/users");
  console.log(req.query.count);
  console.log(req.query.top);

  const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";

  var top = req.query.top;
  var count = req.query.count;
  var httpClient = requestJson.createClient(baseMLabURL);
  console.log("Client created");

  httpClient.get("user?" + mLabAPIKey,
    function(err, resMLab, body) {
      var response = !err ? body : {
        "msg" : "Error obteniendo usuarios."
      }
      res.send(response);
    }
  )
}


function createUserV1(req, res) {
  console.log("POST /apitechu/v1/users");
  console.log(req.headers);
  console.log(req.body.first_name);
  console.log(req.body.last_name);
  console.log(req.body.email);

  var newUser = {
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email
  }

  console.log(newUser);

  var users = require('../usuarios.json');
  users.push(newUser);
  console.log("Usuario añadido al array");

  io.writeUserDataToFile(users);
  console.log("Proceso de creación de usuario finalizado");
}

function createUserV2(req, res) {
  console.log("POST /apitechu/v2/users");
  console.log(req.body.id);
  console.log(req.headers);
  console.log(req.body.first_name);
  console.log(req.body.last_name);
  console.log(req.body.email);

  const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";

  var newUser = {
    "id": req.body.id,
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email,
    "password": crypt.hash(req.body.password)
  }

  console.log(newUser);

  var httpClient = requestJson.createClient(baseMLabURL);
  console.log("Client created");

  httpClient.post("user?" + mLabAPIKey, newUser,
    function(err, resMLab, body) {
      console.log("Usuario creado en Mlab");
      res.status(201).send({"msg": "Usuario creado"});
    }
  )
}

function deleteUsersV2(req, res) {
  console.log("PUT /apitechu/v2/users/:id");
  console.log("id del usuario a borrar es " + req.params.id);

  const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";
  var httpClient = requestJson.createClient(baseMLabURL);

  var id = Number.parseInt(req.params.id);

  var query = "q=" + JSON.stringify({"id": id});

  console.log("La query es " + query);

  httpClient.put("user?" + query + "&" + mLabAPIKey, [],
    function(err, resMLab, body) {
      var response = !err ? body : {
        "msg" : "Error borrando un usuario"
      }
      res.send(response);
    }
  )
}

function deleteUsersV1(req, res) {
  console.log("DELETE /apitechu/v1/users/:id");
  console.log("id del usuario a borrar es " + req.params.id);

  var users = require("../usuarios.json");
  var i = 0;

  // for(i = 0; i < users.length; i++) {
  //   if (users[i].id == req.params.id){
  //     users.splice(i,1);
  //   }
  // }

  // for (user in users){
  //   if (users[user].id == req.params.id){
  //       users.splice(user,1);
  //     }
  // }

  // users.forEach(function(element) {
  //     if (element.id == req.params.id){
  //         users.splice(users.indexOf(element),1);
  //       }
  //   }
  //);

  // users.splice(users.findIndex(function(element){
  //     return element.id == req.params.id
  //   }),1);

  // for (user of users){
  //   if (user.id == req.params.id){
  //       users.splice(users.indexOf(user),1);
  //     }
  // }

  for (var [index, user] of users.entries()){
    if (user.id == req.params.id){
        users.splice(index,1);
      }
  }

  console.log("Usuario quitado del array");

  io.writeUserDataToFile(users);
}

module.exports.getUsersV1 = getUsersV1;
module.exports.getUsersV2 = getUsersV2;
module.exports.createUserV2 = createUserV2;
module.exports.getUserByIdV2 = getUserByIdV2;
module.exports.createUserV1 = createUserV1;
module.exports.deleteUsersV1 = deleteUsersV1;
module.exports.deleteUsersV2 = deleteUsersV2;
