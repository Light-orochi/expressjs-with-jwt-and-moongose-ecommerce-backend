const jwt = require("jsonwebtoken");
const User = require("../models/user")

const  admin = async (req,res,next)=>{
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).json({message:"no token , access not authorized"});
        const verifiedToken = jwt.verify(token,process.env.JWT_SECRET);
        if (!verifiedToken)
            return res
                .status(401)
                .json({ message: "Token verification failed, authorization denied." });
        const user  = await User.findById(verifiedToken.id);

        if (user.type == "user" || user.type == "seller") {
            return res.status(401).json({ message: "You are not an admin!" });
        }
        req.user = verifiedToken.id;
        req.token = token;
        next();


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports=admin;