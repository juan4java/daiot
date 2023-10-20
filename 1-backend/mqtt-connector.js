const mqtt = require('mqtt');
var fs = require('fs');

var mongo = require('./mongo-connector');

// var pool = require('./mysql-connector');
//const cliente = mqtt.connect('mqtt://192.168.0.37:11883');
var options = {
    rejectUnauthorized: false,
    username: '',
    password: '',
    connectTimeout: 5000,
    ca: [ fs.readFileSync("./certs/mosquitto.org.crt") ],
    cert: fs.readFileSync("./certs/client.crt"),
    key:  fs.readFileSync("./certs/client.key")
  }

//#SETME
const cliente = mqtt.connect('mqtt://test.mosquitto.org:8884', options);  
//const client = mqtt.connect('mqtt://ibkc4icfwtiv-u72npxn95j3k.cedalo.dev:1883', options);
//const cliente = mqtt.connect('mqtt://ibkc4icfwtiv-u72npxn95j3k.cedalo.dev:1883');

cliente.on("message", (topic, message) => {
    // message is Buffer
    console.log('message en el broker MQTT');
    console.log(message.toString());
    console.log(topic.toString());
});

cliente.on('connect', () => {
    console.log('[Servidor] Conectado al broker MQTT');

    cliente.subscribe('medicion/#', console.log); // client.subscribe('topic', {qos: valor})
    cliente.subscribe('edificio/1/#', console.log);
    cliente.subscribe('edificio/2/#', console.log);
    cliente.subscribe('edificio/+/amen/+/comun/#', console.log);
    cliente.subscribe('edificio/1/seg/avisos/#', console.log);
   // cliente.subscribe('edificio/1/depto/1/cocina/luz_1', console.log);

   console.log('Conectado al broker MQTT');
   // cliente.subscribe('edificio/#', console.log);

   if(cliente.connected === true){
       console.log("CONECTO")
   }

   //cada 10 segundos
   setInterval(() => {
       // se simula el envio de un topic con id aleatorio
       const id = Math.floor(Math.random() * 3);
       // valor aleatorio a enviar
       var valor  = Math.floor(Math.random() * 40);
       // message a enviar
       var message = JSON.stringify({ valor });
       // publico message
     
       var topicName = `medicion/timestamp`
       valor = new Date().getTime()
       console.log("hora " + valor)
       message =  JSON.stringify({valor})
       console.log(`${topicName}:${message}`);
       cliente.publish(topicName, message);

   }, 2000);
});

// al recibir un mensase
cliente.on('message', (topic , message ) => {
    console.log(`[Servidor] message recibido :O ${message}. topic: ${topic}`)
    if(topic.startsWith("edificio")){
        saveMedicion(topic, message)
    } else {
        console.log("ignoro mensaje de topico " + topic)
    }
});

cliente.on('error',(error) => {
    console.error(error);
    process.exit(1);
});

function saveMedicion(topic, message){
    
    if(topic == null || message == null){
        var response = `{"message":"Registro no generado"}`
        cliente.publish(topic, response);
        return
    }
    const messageJ = JSON.parse(message);
    let date_o = new Date();
    console.log(" mesj " + message);
    //2022-01-26 21:19:41
    let date = `${date_o.getFullYear()}-${date_o.getMonth()+1}-${date_o.getDate()} ${date_o.getHours()}:${date_o.getMinutes()}:${date_o.getSeconds()}`
    console.log(" date " + date);
    
    
    (async() => {
        
        var localDate = new Date()
        var timestamp = new Date(messageJ.timestamp)

        var test = {device_id: messageJ.device_id, timestamp: timestamp, value: messageJ.value, type: messageJ.type, meassure: messageJ.meassure , time:localDate}	
        
        const {insertedId} = await mongo.insertMeasurement( test);
        console.log("insertado id " + insertedId)
    })()
}


/**
 * Establece mensaje y status de response
 * @param {*} err 
 * @param {*} res 
 * @returns 
 */
function handleError(err) {
    console.error(`Error while connect to DB:  ${err.stack}`);
    responseAsJson = JSON.parse(`{"message":"Fallo al obtener los datoss"}`);
    return responseAsJson;
}

module.exports = cliente;