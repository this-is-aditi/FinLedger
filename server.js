require("dotenv").config()

const app=require("./src/app")
const connectToDB=require("./src/config/db")

connectToDB();


app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT")
  res.send("Working")
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    
})
console.log("API KEY:", process.env.OPENAI_API_KEY);