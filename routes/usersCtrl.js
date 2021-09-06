//Importer les modules
var bcrypt  = require('bcrypt')
var jwt     = require('jsonwebtoken');
/* const db = require('../models');
const Message = db.Message; */
var models  = require('../models');


//Routes
module.exports = {
    register: function(req,res){
        //Recuperer les parametre dans le body
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio      = req.body.bio; 
        //Verifier si les parametres sont non nul 

        if(email ==null || username==null || password==null){
            return res.status(400).json({ 'error':'parametre absent'});
        }

         //verifier si l'utilisateur existe dans la base de donnee
        models.User.findOne({
            attributes:['email'],
            where:{ email: email }
        })
        .then(function(userFound){
            if(!userFound){

                bcrypt.hash(password, 5, function(err,bcryptedPassword){
                    var newUser = models.User.create({
                        email:email,
                        username:username,
                        password:bcryptedPassword,
                        bio:bio,
                        isAdmin:0
                    })
                    .then(function(newUser){
                        return res.status(201).json({
                            'userId':newUser.id
                        })
                    })
                    .catch(function(err){
                        return res.status(500).json({'error':'cannot add user'})
 
                    });

                });

            }else{
                return res.status(409).json({'error':'utilisateur existe deja'})
            }

        })
        .catch(function(err){
            return res.status(500).json({'error':'imposssible de verifier utilisateur'})
        })
    },
    login: function(req,res){
         
    }
}
 