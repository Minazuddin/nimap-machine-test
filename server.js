var http = require('http')

var app = require('./app')

var port = process.env.PORT | 5000;

var server = http.createServer(app)

server.listen(process.env.PORT | 5000,() => console.log(`Server listening to Port ${port}`))