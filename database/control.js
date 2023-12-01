const { Client } = require('pg')

const connectionString = process.env.DATABASE_URL;
const client = new Client(connectionString);

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}

client.connect(function(err) {
    if (err) {
        if(err.code === 'ECONNREFUSED')
            throw new DatabaseError('Database connection failed: connection refused');
        else if(err.code === 'ENOTFOUND')
            throw new DatabaseError(`Database connection failed: host ('${process.env.DATABASE_URL}') not found`);
    }
    else console.log(`Connected to database at adress "${connectionString}"!`);
}); 

module.exports = {
    client: client
}
