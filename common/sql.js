const config = require('../config')
const knex = require('knex')({
    client: 'mysql2',
    connection: config.db,
})

exports.knex = (args) => knex(args)