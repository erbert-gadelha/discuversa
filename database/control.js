const { Client } = require('pg')

const connectionString = process.env.DATABASE_URL;
const client = new Client(connectionString);

client.connect(function(err) {
    if (err) console.error(err);
    else console.log(`Connected to database at adress "${connectionString}"!`);
}); 

module.exports = {
    client: client
}
