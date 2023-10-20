const express = require('express')

const routerTest = express.Router()


routerTest.get('/mqtt', function(req, res, next) {
    const id = Math.floor(Math.random() * 3);
    var valor  = Math.floor(Math.random() * 40);
    var mensaje = JSON.stringify({ valor });
    var topicName = `edificio/1/depto/1/postman`
    mqtt.publish(topicName, mensaje);
    res.send({'mensaje': 'Se publico al broker'}).status(200);
});


routerTest.get('/mongo/get', function(req, res, next) {

    (async() => {
        console.log(req.params.a)
        var filter = { device_id: 1 }
        var a = await mongo.getMeasurementList(filter)  
        res.send(a).status(200);
      })()
});


routerTest.get('/mongo/insert', function(req, res, next) {

    (async() => {
        
        var date = new Date(req.body.timestamp)
        console.log("fecha" + req.body.timestamp)
        console.log("fecha" + date)
        console.log("aca v " + JSON.stringify(req.body))
        console.log("aca d " + req.body.device_id)
        var test = {device_id:req.body.device_id, timestamp: date, value: req.body.value, type: req.body.type, meassure: req.body.meassure}	
        const {insertedId} = await mongo.insertMeasurement( test);
        console.log("insertado id " + insertedId)
        res.send({id:insertedId}).status(200);
      })()
});
module.exports = routerTest
