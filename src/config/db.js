const mongoose=require("mongoose")

function connectToDB(){

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        //console.log("server is connected to DB")
        console.log("Connected DB:", mongoose.connection.name)

        
    })
    .catch(err=>{
        console.log("DB Error:", err.message)

        //console.log("Error connecting to DB")
        process.exit(1)
        
    })
}
module.exports=connectToDB