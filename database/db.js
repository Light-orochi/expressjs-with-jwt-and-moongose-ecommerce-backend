const  mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connexion = await  mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
        });
        console.log("connexion successfully");


    }catch (error){
        console.log(error.message);
        console.log("not connected ");
        process.exit(1)
    }

}
module.exports=connectDB;