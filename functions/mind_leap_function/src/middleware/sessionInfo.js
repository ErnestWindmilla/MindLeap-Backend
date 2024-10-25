const jwt = require('jsonwebtoken');

const sessionInfo = (req , res , next) => {
    const token =  req.cookies.access_token
    req.session = { user: null }

    try {
        const data = jwt.verify( token , process.env.SECRET_JWT_KEY )
        req.session.user = data

        conosole.log( "Datos de session",req.session )
    }catch (err) {
        // debug
        console.log("No Session ");
    }

    console.log("Cookies actuales: ", req.cookies);

    next()  
};


module.exports = { sessionInfo };