const config = require('../config.js');
var knex = require('knex')({
	client: 'mysql2',
	connection: config.db,
	log: {
		warn(message) {
			console.warn(`knex warn:`, message);
		},
		error(message) {
			console.error(`knex error:`, message);
		},
		deprecate(message) {
			console.warn(`knex deprecate:`, message);
		},
		debug(message) {
			appLogger.info(`knex debug:`, message);
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
