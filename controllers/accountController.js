const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";
const requestJson = require('request-json');
const mLabAPIKey = "apiKey=" + process.env.MLAB_API_KEY;

function accountsV2(req, res) {
  console.log("GET /apitechu/v2/accounts/:id");

  var httpClient = requestJson.createClient(baseMLabURL);

  var id = Number.parseInt(req.params.id);

  console.log("La id es: " + id);

  var query = "q=" + JSON.stringify({"UserId":id});

  httpClient.get("accounts?" + query + "&" + mLabAPIKey,
    function(err, resMLab, body) {
      if (err) {
        var response = "Se ha producido un error al recuperar las cuentas";
        res.status(500);
      } else {
        if (body.length > 0) {
          var response = body;
        } else {
          var response = {
            "msg" : "Cuenta no encontrado"
          }
          res.status(404);
        }
      }

      res.send(response);
    }
  );
}

module.exports.accountsV2 = accountsV2;
