const fs = require('fs');

function writeUserDataToFile(data) {
  console.log("writeUserDataToFile");

  var jsonUserData = JSON.stringify(data);

  fs.writeFile("usuarios.json", jsonUserData, "utf8",
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Usuario persistido en fichero");
      }
    }
  )
}

module.exports.writeUserDataToFile = writeUserDataToFile;
