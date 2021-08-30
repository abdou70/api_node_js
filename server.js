// importer express
var express = require('express');

// instancier le serveur

var server = express();

//Configuration des routes

server.get('/',function(req,res){
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Bonjour Je suis Abdou Niang AgroBussiness</h1>');

});

//Demarer le serveur

server.listen(8080,function(){
    console.log("Server en ecoute :");

});