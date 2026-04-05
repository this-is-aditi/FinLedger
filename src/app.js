const express=require ("express");
const cookieParser=require("cookie-parser")

/**
 * -Routes required
 */
const authRouter=require("./routes/auth.routes")
const accountRouter=require("./routes/account.routes")
const transactionRoutes=require("./routes/transaction.routes")

const app=express();



app.use(express.json())
app.use(cookieParser())

/**
 * -use routes
 */
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRoutes)

/**
 * -testing api
 */
app.get("/",(req,res)=>{
    res.send("Ledger service is up and running")
})

module.exports=app
