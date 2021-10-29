//Importer les modules
var bcrypt  = require('bcrypt')
var jwtUtils    = require('../utils/jwt.utils');
/* const db = require('../models');
const Message = db.Message; */
var models  = require('../models');
var asyncLib = require('async');
const { json } = require('sequelize');

//Constante
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

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

        if(username.length >= 13 || username.length <=4){
            return res.status(400).json({'error':'username doit etre compris entre 5 et 12'});
        }

        if(!EMAIL_REGEX.test(email)) {
            return res.status(400).json({'error':'email pas valide'});
        }

        if(!PASSWORD_REGEX.test(password)){
            return res.status(400).json({'error':'password incorecte'});
        }
        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    attributes:['email'],
                    where:{ email: email }
                })
                .then(function(userFound){
                    done(null,userFound);
                })
                .catch(function(err){
                    return res.status(500).json({'error':'impossible de verifier'});
                });
            },
            function(userFound,done) {
                if(!userFound){
                    bcrypt.hash(password, 5, function(err,bcryptedPassword){
                        done(null,userFound,bcryptedPassword);
                    });
                }else{
                    return res.status(409).json({'error':'utilisateur existe deja'});
                }
            },
            function(userFound,bcryptedPassword,done){
                var newUser = models.User.create({
                    email:email,
                    username:username,
                    password:bcryptedPassword,
                    bio:bio,
                    isAdmin:0
                })
                .then(function(newUser){
                    done(newUser);
                })
                .catch(function(err){
                    return res.status(500).json({'error':'cannot add user'})
                });
            }
        ],function(newUser){
            if(newUser){
                return res.status(201).json({
                    'userId':newUser.id
                });
            }else{
                return res.status(500).json({'error':'impossible ajouter utilisateur'});
            }
        });
    },         
    login: function(req,res){
        //Recuperer les parametres saisit dans le body
        var email = req.body.email;
        var password = req.body.password;

        if(email == null || password ==null){
            return res.status(400).json({'error':'donne absent'});
        }

        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    where: {  email:email }
                })
                .then(function(userFound){
                    done(null,userFound);
                })
                .catch(function(err){
                    return res.status(500).json({'error':'impossible de verifier utilisateur'});
                });
            },
            
        
        //TODO verfier les regex de l'email
        
        function(userFound,done){
            if(userFound){
                bcrypt.compare(password,userFound.password, function(errBycrypt,resBycrypt){
                    done(null,userFound,resBycrypt);
                });
            }else{
                return res.status(404).json({'error':'user not exist in BD'});
            }
        },
        function(userFound, resBycrypt, done) {
            if(resBycrypt) {
              done(userFound);
            } else {
              return res.status(403).json({ 'error': 'invalid password' });
            }
        }
    ], function(userFound) {
        if (userFound) {
          return res.status(201).json({
            'userId': userFound.id,
            'token': jwtUtils.generateTokenForUser(userFound)
          });
        } else {
          return res.status(500).json({ 'error': 'cannot log on user' });
        }
      });
    },
    getUserProfile: function(req,res) {
        var headerAuth = req.headers['authorization'];
        var userId     = jwtUtils.getUserId(headerAuth);

        if(userId < 0)
            return res.status(400).json({'error':'mauvaise token'});
        models.User.findOne({
            attributes: ['id','email','username','bio'],
            where:{id:userId}
        }).then(function(user){
            if(user) {
                res.status(201).json(user);
            }else{
                res.status(404).json({'error':'user not found'});
            }
        }).catch(function(err){
            res.status(500).json({'error':'cannot fetch user'});
        });
    },
    updateUserProfile: function(req,res){
        var headerAuth = req.headers['authorization'];
        var userId     = jwtUtils.getUserId(headerAuth);

        var bio=req.body.bio;
        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                    attributes: ['id','bio'],
                    where: {id:userId}
                }).then(function(userFound){
                    done(null,userFound);
                })
                .catch(function(err){
                    return res.status(500).json({'error':'impossible de verifier le user'})
                });
            },
            function(userFound,done) {
                if(userFound) {
                    userFound.update({
                        bio:(bio ? bio :userFound.bio)
                    }).then(function(){
                        done(userFound);
                    }).catch(function(err) {
                        res.status(500).json({'error':'impossible update user'});
                    });
                }else{
                    res.status(404).json({'error':'user not found'});
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            }else{
                return res.status(500).json({'error':'cannot update user profile'});
            }
        }); 
    }
}
 