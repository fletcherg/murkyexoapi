
const config = {

    app: {
        port : 1337
    },
    db: {
        user: 'murkyExoAPI',
        password: 'dbpass',
        server: 'servername',
        database: 'EXODB',
        options: {
            encrypt: false
        }
    },
    auth: {
        APITokens : [
            'jwttokenfromEXO',
            'heymynameismohamedaymen',
            'blah'
        ],
        basicauth : {
            users: { 'EXOAPI' : 'EXOAPI12' }
        }
    }

}

module.exports = config


