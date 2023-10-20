const {MongoClient} = require("mongodb");
//#SETME
const collectionName = "data";
//#SETME
const uri = "mongodb+srv://mongoPublic:Lctz7qPZrXcOJHnv@cluster0.ygov0d7.mongodb.net";    
const cliente = new MongoClient(uri)
var collection = null

module.exports.init = async function init() {
    // Use connect method to connect to the server
    await cliente.connect();
    console.log('Connected successfully to mongo servver');
    //#SETME
    const db = await cliente.db('daiot');
    //#SETME
    collection = await db.collection('data');

    const findResult = (await collection.find({ a: 3 }).toArray());
    console.log('Found documents =>', findResult);

    return 'done.';
  }

 function getCliente() {
    
    console.log("quiero conectarme")
    cliente.connect()
        
    // cliente = await MongoClient.connect(uri, {useNewUrlParser: true})
    return cliente;
}

module.exports.getMeasurementList = async function getMeasurementList(filter) {

    const findResult = (await collection.find(filter).toArray());
    console.log('Found documents =>', findResult);
    return findResult
}

module.exports.insertMeasurement = async function insertMeasurement(message) {
    const {insertedId} = await collection.insertOne(message);
    return insertedId;
}

