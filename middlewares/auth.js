const jwt = require('jsonwebtoken');

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').split(" ")[1];
    if(!token){
        res.status(400).json({error:"Token required"});
    }
    else{
        const decoded = jwt.verify(token,"secretJWTkey");
        req.user = decoded.userid;
        next();
    }
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Invalid token"});
    }
}

module.exports = auth;