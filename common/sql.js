const config = require('../config.js');
var knex = require('knex')({
	client: 'mysql2',
	connection: config.db,
	log: {
		warn(message) {
			appLogger.warn(`knex warn: %s`, message);
		},
		error(message) {
			appLogger.error(`knex error: %s`, message);
		},
		deprecate(message) {
			appLogger.warn(`knex deprecate: %s`, message);
		},
		debug(message) {
			appLogger.debug(`knex debug: %s`, message);
		},
	}
});
exports.kraw = knex.raw;
exports.schema = knex.schema;
exports.knex = function(arg){
	var k = knex(arg);
	return k;
};

exports.transaction = knex.transaction;
exports.query = function(script, parms){
	if (!parms){
		script = 'SET @XXXXX = ?; ' + script;
		parms = [null];
	}
	return knex.raw(script, parms)
		.then((data)=>{

			if (!data[0]) return;

			const ret = [];
			data[0].forEach(val => {
				if (Array.isArray(val))
					ret.push(val);
			});

			return ret;
		});
};