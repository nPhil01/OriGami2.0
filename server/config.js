var host = 'localhost';
var port = 5000;
var mongoport = 27017;

module.exports = {
	express_host: 'http://' + host + ':' + port,
	express_port: port,
	mongodb_host: 'mongodb://' + host + ':' + mongoport + '/origamidb-server',
	mongodb_port: mongoport
};
