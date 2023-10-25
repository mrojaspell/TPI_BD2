const config = require('./config.json');

let client = null; // Declare a module-aw variable

async function getClient() {
    if(client != null){
        return client;
    }
    if (config['database'] === "postgres") {
        const Pool = require("pg").Pool;
        client = new Pool(config["postgres"]);
    } else if (config['database'] === "mongodb") {
        const MongoClient = require('mongodb').MongoClient;
        const mongoClient = await MongoClient.connect(`mongodb://${config["mongodb"]["host"]}:${config["mongodb"]["port"]}/`);
        client = mongoClient.db(config["mongodb"]["database"]);
    }
    return client;
}

module.exports = getClient;