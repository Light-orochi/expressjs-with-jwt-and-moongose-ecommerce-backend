const express = require("express");
const dotenv= require("dotenv");
const connectDB=require("./database/db");
const authRouter = require("./routes/authRoute")
const adminRouter = require("./routes/adminRoutes")
const productRouter = require("./routes/productRoute")
const userRouter = require("./routes/userRoute")

dotenv.config();
connectDB();


const PORT =process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("api is running");
}); 

app.use("/api/auth",authRouter);

app.use("/admin",adminRouter);
app.use("/api",productRouter);
app.use("api",userRouter);


app.listen(PORT,
    console.log("connected at port  " +PORT)
);
 