const server = require('../../app')
const endpoint = `http://localhost:${server.get('port')}`;
exports.server = server
exports.superAgent = require('superagent')
exports.endpoint = endpoint