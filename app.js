const express = require('express')
const bodyParser = require('body-parser')
const promise = require('bluebird');
const app = express()

const sql = require('./common/sql')
const config = require('./config')
const paymentModel = require('./models/payments')
app.use(bodyParser.json())

/*************
 * <ROUTES> 
 *************/
app.post('/api/payments', async(req, res) => {
    const result = await paymentModel.create(req.body)
    if (result.code === 'ER_DUP_ENTRY')
        return res.status(400).send('Payment already exists!!!!')

    return res.status(200).json(result)
})

app.get('/api/payments/:id', async(req, res) => {
    const result = await paymentModel.getById(req.params.id)
    return res.status(200).json(result)
})

app.get('/api', (req, res) => res.send('API OK'))

/*************
 * </ROUTES> 
 *************/

app.set('port', process.env.PORT || config.app.port);
app.listen(process.env.PORT || config.app.port, () => console.log('Listening on port 3000'))

// TODO: must export this to be able to perform integration and end-to-end tests
module.exports = app
