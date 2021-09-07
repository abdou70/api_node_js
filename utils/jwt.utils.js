//Import des modules
var jwt = require('jsonwebtoken');

const JWt_SIGN_SECRET = '0sjs6gf9mk9nwxq22pzn5hvpxmpgtty34tfx8gz17sy6djnm0xuc65bi9rcc ';

//Exporter des fonction
module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
          userId: userData.id,
          isAdmin: userData.isAdmin
        },
        JWt_SIGN_SECRET,
        {
            expiresIn:'1h'
      })  
    }
}