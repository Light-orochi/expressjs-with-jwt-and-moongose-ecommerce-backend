const express= require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt  = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv");
const e = require("express");
const auth =  require("../middlewares/authMiddleware")


//sign up

router.post("/signup",async (req,res,next)=>{
    try{
        const {name ,email,password}=req.body;
        const existingUser = await User.findOne({email});

        if (existingUser){
            return res.status(400).json({message:"user already exist"});

        }
        const hashedPassword=await bcrypt.hash(password,10);
        let user=new User({
            email,
            password:hashedPassword,
            name
        })
        user = await user.save();

        res.json(user);
    }catch (error){
        res.status(500).json({error:error.message})
    }


});

router.post("/signin",async(req,res,next)=>{
try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    console.log(user);
    if(!user){
        return res.status(400).json({message:"user  does not exist"});
    }
    const same=await bcrypt.compare(password,user.password);
    if(!same){
        return res.status(400).json({message:"invalid credential"});  
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.json({token,...user._doc});


    
} catch (error) {

   res.status(500).json({error:error.message}); 
}


router.post("/validToken",async (req,res)=>{
    try{
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

    router.get("/user-data",auth,async (req,res)=>{
        const user  = await User.findById((req.user));

        res.json({ ...user._doc, token: req.token });

    })




})

module.exports=router;