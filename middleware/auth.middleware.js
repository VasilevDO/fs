const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=(request, response, next) => {
    if (request.method==='OPTIONS') {
        return next();
    }

    try {
        const token=request.headers.authorization.split(' ')[1];
        if (!token) {
            response.status(401).json({message:'Not authorized'});
        }

        const decoded=jwt.verify(token, config.get('jwtKey'));
        request.user=decoded;
        next();

    } catch (e) {
        response.status(401).json({message:'Not authorized'});
    }

}