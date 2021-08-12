var fs = require('fs');
let express = require('express');
let app = express();
let https = require('https');
let http = require('http');
var Gun = require('gun');

let stream = require('./ws/stream');
let path = require('path');

var config = {};

config.options = {
   key: process.env.SSLKEY ? fs.readFileSync(process.env.SSLKEY) : fs.readFileSync('src/assets/server.key'),
   cert: process.env.SSLCERT ? fs.readFileSync(process.env.SSLCERT) : fs.readFileSync('src/assets/server.cert')
}

config.port = process.env.PORT || 443;
config.gunport = process.env.GUNPORT || 8765;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:room', function(req, res) {
      res.redirect('/?room=' + req.params.room);
});

if (!process.env.SSL) {
	config.webserver = http.createServer({}, app);
	config.webserver.listen(config.port, () => console.log(`Meething HTTP app listening on port ${config.port}!`))
} else {
	config.webserver = https.createServer(config.options, app);
	config.webserver.listen(config.port, () => console.log(`Meething HTTPS app listening on port ${config.port}!`))
}
