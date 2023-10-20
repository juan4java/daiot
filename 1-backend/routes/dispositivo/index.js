const express = require('express')
const routerDispositivo = express.Router()

var pool = require('../../mysql-connector');
const routerCommon = require('../common');

routerDispositivo.get('/list', function(req, res) {
    var sql = `SELECT * FROM equipos`;
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

routerDispositivo.get('/:dispositivo_id', function(req, res) {
    
    if(req.params.dispositivo_id == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidDeviceId(req.params.dispositivo_id)){
        sendErrorResponse(res);
        return
    }
    
    var sql = `SELECT * FROM equipos WHERE equipoId = ${req.params.dispositivo_id}`;
    
    pool.query(sql, function (err, result) { 
        
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            responseAsJson = result;
            res.status(200)
        }
        
        console.log("esto acaaaaa")
        res.send((JSON.stringify(responseAsJson)));
    }); 
})

routerDispositivo.put('/create', function(req, res) {
    var sql = `INSERT INTO equipos ( nombre, ubicacion, tipoId) 
        VALUES ('${req.body.nombre}', '${req.body.ubicacion}', '${req.body.tipoId}')`; 
    
    var responseAsJson
    pool.query(sql, function(err, result, fields) {
        console.log(result)
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            var response = `{"message":"Registro insertado", "id":${result.insertId}}`
            responseAsJson = JSON.parse(response)
            res.status(200)
        }
        res.send(result);
    });
})


routerDispositivo.put('/update', function(req, res) {
    var sql = `UPDATE equipos SET
     ( nombre = '${req.body.nombre}', ubicacion = '${req.body.ubicacion}', tipoId = '${req.body.tipoId}') 
        WHERE equipoId =  ('${req.body.equipoId}')`; 
    
    var responseAsJson
    pool.query(sql, function(err, result, fields) {
        console.log(result)
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            var response = `{"message":"Registro actualizado"}`
            responseAsJson = JSON.parse(response)
            res.status(200)
        }
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
        console.log("Device invalid for id" , id)
        return false
    }

    var pattern = /^\d+$/;
    let result =  pattern.test(id);
    if(result){
        return true;
    } else {
        console.log("Device invalid for id" , id)
        return false
    }
}

module.exports = routerDispositivo