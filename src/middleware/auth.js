const jwt = require("jsonwebtoken");
const {User, Token} = require("../models/employee");

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({_id:verifyUser._id});
        next();
    }catch(err){
        res.status(401).render("secret");
    }
}

module.exports = auth;