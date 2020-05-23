const sql = require('../common/sql')

exports.getPayment = (userId, orderId) => {
    const query = `
            SET @user_id = ?;
            SET @order_id = ?;

            SELECT *  FROM payments where user_id=@user_id AND order_id=@order_id;
        `;
    return sql.query(query, [userId, orderId])
        .then(data => {

            if (data.length > 0 ) {
                const payment = data && data[0] && data[0][0]
                return Object.entries(payment).length > 0 && payment
            }

            return
        })
}

exports.getById = (id) => {
    const query = `
            SET @id = ?;

            SELECT * FROM payments where id=@id;
        `;
    return sql.query(query, [id])
        .then(data => {

            if (data.length > 0 ) {
                const payment = data && data[0] && data[0][0]
                return Object.entries(payment).length > 0 && payment
            }

            return
        })
}

exports.create = async (params) => {
    try {
            return await sql.knex('payments').insert({
                user_id: params.user_id,
                order_id: params.order_id,
                status: params.status,
                amount: params.amount,
                transaction_id: params.transaction_id,
                gateway_response: JSON.stringify(params)
            })
    } catch(error) {
        return error
    }
}