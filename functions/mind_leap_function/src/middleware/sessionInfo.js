const jwt = require('jsonwebtoken');

const sessionInfo = (req , res , next) => {
    const token =  req.cookies.access_token
    req.session = { user: null }

    try {
        const data = jwt.verify( token , process.env.SECRET_JWT_KEY )
        req.session.user = data
    }catch (err) {
        // debug
        console.log("No Session ");
    }

    next()
};


module.exports = { sessionInfo };