// importer express
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router; 

// instancier le serveur

var server = express();

//Configuration Body Parser

server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
//Configuration des routes

server.get('/',function(req,res){
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Bonjour Je suis Abdou Niang AgroBussiness</h1>');

});

server.use('/api/',apiRouter);

//Demarer le serveur

server.listen(8080,function(){
    console.log("Server en ecoute :");

});