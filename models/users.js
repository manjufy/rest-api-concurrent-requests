const sql = require('../common/sql')

exports.login = (email, password) => {
    const query = `
        SET @email = ?;
        SET @pwd = ?;

        SELECT id, full_name, username, email, role, status FROM users where email=@email AND password = password(@pwd);
    `;
    return sql.query(query, [email, password])
        .then(data => {
            if (data.length > 0 ) {
                const user = data && data[0] && data[0][0]
                return Object.entries(user).length > 0 && user
            }

            return
        })
}

exports.getByEmail = (email) => {
    const query = `
            SET @email = ?;

            SELECT id, full_name, username, email, role, status FROM users where email=@email;
        `;
    return sql.query(query, [email])
        .then(data => {
            
            if (data.length > 0 ) {
                const user = data && data[0] && data[0][0]
                return Object.entries(user).length > 0 && user
            }

            return
        })
}

exports.getById = (id) => {
    const query = `
            SET @id = ?;

            SELECT id, full_name, username, email, role, status FROM users where id=@id;
        `;
    return sql.query(query, [id])
        .then(data => {

            if (data.length > 0 ) {
                const user = data && data[0] && data[0][0]
                return Object.entries(user).length > 0 && user
            }

            return
        })
}

exports.upsert = (params) => {
    try {
        if (!params.id) {
            return sql.knex('users').insert({
                type: params.type || 'PUBLIC',
                full_name: params.full_name,
                username: params.username,
                password: sql.kraw('password(?)', params.password),
                email: params.email,
                phone: params.phone,
                city: params.city,
                state: params.state,
                post_code: params.post_code,
                country: params.country,
                status: 1,
                role: params.role || 'CUSTOMER' // DEALER || CUSTOMER
            })
        } else {
            return sql.knex('users').update({
                type: params.type || 'PUBLIC',
                full_name: params.full_name,
                username: params.username,
                password: sql.kraw('password(?)', params.password),
                email: params.email,
                phone: params.phone,
                city: params.city,
                state: params.state,
                post_code: params.post_code,
                country: params.country,
                status: 1,
                role: params.role || 'CUSTOMER' // DEALER || CUSTOMER
            })
        }
    } catch(error) {
        throw error
    }
}