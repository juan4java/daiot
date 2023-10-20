//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

const cors = require('cors');
const bodyParser = require('body-parser');


var express = require('express');
var app = express();

var pool = require('./mysql-connector');
var mqtt = require('./mqtt-connector');
var mongo = require('./mongo-connector');

const routerDispositivo = require('./routes/dispositivo')
const routerMedicion = require('./routes/medicion')
const routerRegistro = require('./routes/registro')
const routerTest = require('./routes/test')

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const myLogger = function(req, res, next) {
    console.log('Logged')
    next()
}

//const authenticator = function(req, res, next) {
    // si el usuario tiene permiso
    //next()
    // si el usuario no tiene permiso
    //res.send('No tenes permiso para acceder al recurso').status(401)
//}

app.use(myLogger)
// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to enable cors
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



app.use('/dispositivo', routerDispositivo)
app.use('/medicion', routerMedicion)
app.use('/registro', routerRegistro)
app.use('/test', routerTest)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
  

//=======[ Main module code ]==================================================

app.get('/', function(req, res, next) {
    res.send({'mensaje': 'Hola DAM'}).status(200);
});

app.get('/user/', function(req, res, next) {
    pool.query('Select * from usuarios', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

app.listen(PORT, function(req, res) {

    console.log("Iniciando mongodb");
    (async() => {
        var a = await mongo.init()  
        })()
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================


