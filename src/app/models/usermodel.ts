import mongoose , {Schema ,Document } from "mongoose";


export interface Message extends Document {
    content :string ,
    createdAt : Date
}


const MessageSchema : Schema <Message> = new mongoose.Schema ({
   content : {
      type : String ,
      required: [true, 'message is required'] ,
      maxlength :30 ,
      minlength :10
   },

   createdAt : {
    type : Date ,
    required: true ,
    default : Date.now()
    
   }
})



export interface user extends Document {
  username : string ,
  email : string ,
  password :string ,
  isverifed : boolean,
  verifycode:string,
  verifycodeexpiry : string ,
  isAcceptingMessages: boolean,
  messages : Message[],
  
}



const UserSchema : Schema<user> = new mongoose.Schema ({
   username :{
    type: String ,
    required: [true , 'username is required'],
   },
  
   email :{
    type :String ,
    required :[true , 'email is required'],
    unique : true
   },
  
   password :{
    type :String ,
    required: [true , 'password is required'] ,
    maxlength: 12 ,
    minlength: 8 ,
   },

   isverifed : {
    type : Boolean, 
    default: false
   },

   isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
 
  messages: [MessageSchema],


})

//export it 

const usermodel =  (mongoose.models.user as mongoose.Model<user>) ||
mongoose.model<user>('user', UserSchema); 

export default usermodel;
