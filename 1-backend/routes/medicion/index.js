const express = require('express')
const routerMedicion = express.Router()

var pool = require('../../mysql-connector');
var mqtt = require('../../mqtt-connector');
var mongo = require('../../mongo-connector');

const routerCommon = require('../common');

routerMedicion.get('/list', function(req, res) {
    
    var sql = `SELECT * FROM mediciones`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result;
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    }); 
})

routerMedicion.get('/force/:device_id', function(req, res) {
    

    (async() => {  
        
        var valor  = "force";
        var mensaje = JSON.stringify({ valor });
        var topicName = `edificio/1/depto/1/force`
        mqtt.publish(topicName, mensaje);

        res.send({"force":"send"}).status(200);
      })()

})




routerMedicion.get('/timeseries/:device_id/:minute_select', function(req, res) {
    

    (async() => {
        var id = (req.params.device_id)
        var min = (req.params.minute_select)
        console.log("buscando <" + id + ">")
        console.log("minute select <"  + min+ ">")
        
        var windowTime = new Date(new Date().getTime() - 1000 * 60 * min)

        var filter = {device_id: parseInt(id) , time:{$gte : windowTime}}
        console.log(filter)

        var a = await mongo.getMeasurementList(filter)  
        res.send(a).status(200);
      })()

})

routerMedicion.get('/onoff/:device_id/:onoff', function(req, res) {
    

    (async() => {
        var id  = req.params.onoff
        console.log("veo value "+ id)
        var mensaje = JSON.stringify({value:parseInt(id)});
        var topicName = `edificio/1/depto/1/onoff`
        mqtt.publish(topicName, mensaje);
        res.send({"value":id}).status(200);
      })()

})


routerMedicion.get('/:dispositivo_id', function(req, res) {

    if(req.params.dispositivo_id == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.params.dispositivo_id)){
        sendErrorResponse(res);
        return
    }

    var sql = `SELECT * FROM mediciones WHERE equipoId = ${req.params.dispositivo_id} ORDER BY fecha DESC`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result;
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    });
})

routerMedicion.get('/last/:dispositivo_id', function(req, res) {

    if(req.params.dispositivo_id == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.params.dispositivo_id)){
        sendErrorResponse(res);
        return
    }

    var sql = `SELECT * FROM mediciones WHERE equipoId = ${req.params.dispositivo_id} ORDER BY fecha DESC LIMIT 1`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result[0];
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    });
})




routerMedicion.put('/', function(req, res) {
    
    if(req.body.equipoId == null || req.body.valor == null || req.body.fecha == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.body.equipoId)||
         !isValidDate(req.body.fecha)||
         !isValidValue(req.body.valor)){
        sendErrorResponse(res);
        return
    }

    var sql = `INSERT INTO mediciones (valor, fecha , equipoId) 
        VALUES ('${req.body.valor}', '${req.body.fecha}', '${req.body.equipoId}')`;
    var responseAsJson

    pool.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            var response = `{"message":"Registro insertado", "id":${result.insertId}}`
            responseAsJson = JSON.parse(response)
            res.status(200)
        }
        clienteSend("medicion insertada", req.body.equipoId)
        res.send(result);
    }); 
})


/**
 * Establece mensaje y status de response
 * @param {*} err 
 * @param {*} res 
 * @returns 
 */
function handleError(err, res) {
    console.error(`Error while connect to DB:  ${err.stack}`);
    responseAsJson = JSON.parse(`{"message":"Fallo al obtener los datos"}`);
    res.status(503);
    return responseAsJson;
}


/**
 * Envia respuesta y mensaje ante un error
 * @param {*} res 
 */
function sendErrorResponse(res) {
    responseAsJson = JSON.parse(`{"message":"Parametros no validos , o incompletos"}`);
    res.status(400);
    res.send((JSON.stringify(responseAsJson)));
}


/**
 * Valida que un id sea numerico, posea un largo determinado maximo
 */
function isValidDeviceId(id){
    if(id.length > 11){
        console.log("Medicion invalid for id " , id)
        return false
    }

    var pattern = /^\d+$/;
    let result =  pattern.test(id);
    if(result){
        return true;
    } else {
        console.log("Medicion invalid for id " , id)
        return false
    }
}

function isValidDate(fecha){
    if(fecha.length == 19 || fecha.length == 18 ){
        return true
    }

    console.log("Medicion invalid for date " , fecha)
    return false
}

function isValidValue(valor){
    if(valor > 100){
        console.log("Medicion invalid for value " , valor)
        return false
    }

    var pattern = /^\d+$/;
    let result =  pattern.test(valor);
    if(result){
        return true;
    } else {
        console.log("Medicion invalid for value " , valor)
        return false
    }
}

function clienteSend(message,id) {

    var valor = Math.floor(Math.random() * 40);
    var mensaje = JSON.stringify({ valor });
    var topicName = `edificio/1/medicion/${id}/casa`
    console.log(`${topicName}:${mensaje}`);
    mqtt.publish(topicName, message);
}


module.exports = routerMedicion;

function save(){
    console.log('llegue!')
};
