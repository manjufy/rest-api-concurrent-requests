/**
 * Authentication Module.
 */
exports.perms =  (moduleCode, role) => {
    const roles = ['ADMIN', 'SELLER', 'BUYER']
    if (!roles.includes(role)) throw Error('Invalid role')
    const methods = {}
    methods['POST'] = false;
    methods['PUT'] = false;
    methods['GET'] = false;
    
    const action_perm = {}
    switch(role) {
        case 'ADMIN':
            methods['POST'] = methods['PUT'] = methods['GET'] = true
            break
        case 'SELLER':
            switch(moduleCode) {
                case 'USERS': methods['GET'] = true
                break
            }
            break
        case 'BUYER':
            switch(moduleCode) {
                case 'USERS': methods['GET'] = true
            }
            break
    }

    if (!action_perm[role]) action_perm[role] = {}
    if (!action_perm[role][moduleCode]) {
        action_perm[role][moduleCode] = {
            ...methods
        }
    }

    return action_perm[role];
}

exports.authorise = (moduleCode, roles) => {
    return (req, res, next) => {
        const user = req.user // from passport-local session
        const perms = exports.perms(moduleCode, user.role) // { USERS: { POST: true, PUT: true, GET: true } }
        if (!user.role) {
            return res.status(401).json('Unauthorised')
        }

        if (req.isAuthenticated()) {
            if (perms[moduleCode][req.method]) {
                return next()
            } else {
                return res.status(403).json('Forbidden')
            }
        }

        return res.status(401).json('Unauthorised')
    }
}