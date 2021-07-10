var users = require('../usuarios.json');
//var io = require('../io.js');
const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";
const requestJson = require('request-json');
const crypt = require('../crypt');

const mLabAPIKey = "apiKey=" + process.env.MLAB_API_KEY;

function loginV1(req, res) {
  console.log("POST /apitechu/v1/login");

  console.log(req.body);

  for (var [index, user] of users.entries()){
    if (user.email == req.body.email && user.password == req.body.password){
        res.send({ "mensaje": "Login correcto", "idUsuario": user.id});
        user.logged = true;
      } else {
        res.send({ "mensaje": "Login incorrecto"});
      }
  }
  //io.writeUserDataToFile(users);
}

function logoutV1(req, res) {
  console.log("POST /apitechu/v1/logout/:id");

  for (var [index, user] of users.entries()){
    if (user.id == req.params.id){
      if (user.logged == true){
          delete user.logged;
          res.send({ "mensaje": "Logout correcto", "idUsuario": user.id});
      }else{
        res.send({ "mensaje": "Logout incorrecto"});
      }
    }else{
      res.send({ "mensaje": "Logout incorrecto"});
    }
  }
  //io.writeUserDataToFile(users);
}

function loginV2(req, res) {
  console.log("POST /apitechu/v2/login");

  var httpClient = requestJson.createClient(baseMLabURL);

  var query = "q=" + JSON.stringify({"email": req.body.email});

  console.log("La query es " + query);

  httpClient.get("user?" + query + "&" + mLabAPIKey,
    function(err, resMLab, body) {
      //console.log(body[0].password);
      //console.log(crypt.checkPassword(req.body.password, body[0].password));
      var check = crypt.checkPassword(req.body.password, body[0].password);
      if (check){
          console.log(body[0]._id.$oid);

          var query = "q=" + JSON.stringify({"id": body[0].id});

          var putBody = '{"$set": {"logged": true}}';

          console.log("La query es " + query);

          httpClient.put("user?" + query + "&" + mLabAPIKey, JSON.parse(putBody),
            function(errPUT, resMLabPUT, bodyPUT) {
              console.log("PUT done");
              var response = {
                "msg" : "Usuario logado con éxito",
                "idUsuario" : body[0].id
              }
              res.send(response);
            }
          )
        } else {
          res.send({ "mensaje": "Login incorrecto"});
          res.status(404);
        }
    }
  )
}

function logoutV2(req, res) {
console.log("POST /apitechu/v2/logout/:id");

var id = Number.parseInt(req.params.id);
var query = "q=" + JSON.stringify({"id": id});
console.log("query es " + query);

httpClient = requestJson.createClient(baseMLabURL);
httpClient.get("user?" + query + "&" + mLabAPIKey,
  function(err, resMLab, body) {
    if (body.length == 0) {
      var response = {
        "mensaje" : "Logout incorrecto, usuario no encontrado"
      }
      res.send(response);
    } else {
      console.log("Got a user with that id, logging out");
      id = Number.parseInt(body[0].id);
      query = "q=" + JSON.stringify({"id": id});
      console.log("Query for put is " + query);
      var putBody = '{"$unset":{"logged":""}}'
      httpClient.put("user?" + query + "&" + mLabAPIKey, JSON.parse(putBody),
        function(errPUT, resMLabPUT, bodyPUT) {
          console.log("PUT done");
          var response = {
            "msg" : "Usuario deslogado",
            "idUsuario" : body[0].id
          }
          res.send(response);
        }
      )
    }
  }
);
}



module.exports.loginV1 = loginV1;
module.exports.loginV2 = loginV2;
module.exports.logoutV1 = logoutV1;
module.exports.logoutV2 = logoutV2;
