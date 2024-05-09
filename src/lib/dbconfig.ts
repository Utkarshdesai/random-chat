import mongoose from "mongoose";

type connectionobject = {
  Isconnected? : Number ,
}

const connection : connectionobject = {}

const dbconnect = async() : Promise<void> => {
   //check curretly it is connected 

   if(connection.Isconnected)
    {
         console.log('db is already connected')
         return
    }

  try {
  // connect to db

  const connect = await mongoose.connect(process.env.DBURL || '' , {})

   console.log('databse connected sucessfully')

   connection.Isconnected = connect.connections[0].readyState;
    
  } catch (error) {
    console.log('db is not connected')

    //graceful exit in case of connection error
    process.exit(1)
  }
}

export default  dbconnect;