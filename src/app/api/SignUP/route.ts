import dbconnect from "@/lib/dbconfig";
import usermodel from "@/models/usermodel";
import bcrypt from 'bcrypt'
import { STATUS_CODES } from "http";
import { ApiResponse } from "@/types/ApiResponse";
import mailsender from '../../../helper/mail'


export async function POST (request : Request ) 
{
    
    try {
        await dbconnect()

        const {username ,  email ,  password} =  await request.json()

        const ExistingUserbyusername = await usermodel.findOne({username , isverifed: true })
      
        if (ExistingUserbyusername)
            {
                return Response.json(
                    {
                        sucess : false ,
                        STATUS_CODES : 400,
                        message : 'user is already taken'
                    }
                )
            }

        else 
        {
           // find user by email 

           const ExistingUserbyemail = await usermodel.findOne(email)

           let Verifycode = Math.floor(100000 + Math.random() * 900000).toString();

           if(ExistingUserbyemail) 
            {
                if(ExistingUserbyemail.isverifed)
                    {
                        return Response.json({
                            sucess: false,
                            STATUS_CODES: 404,
                            message: 'User is verified'
                        })
                    }
                else{

                    const hashedpassword = await bcrypt.hash(password,10)
                    ExistingUserbyemail.password = hashedpassword 
                    ExistingUserbyemail.verifycode = Verifycode 
                    ExistingUserbyemail.verifycodeexpiry = new Date( Date.now() + 3600000)
                    await ExistingUserbyemail.save()
                }
            }

            else{
                //create new user
                const hashedpassword = await bcrypt.hash(password, 10)
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                const newuser = usermodel.create({
                    username,
                    password : hashedpassword ,
                    verifycode: Verifycode ,
                    verifycodeexpiry : expiryDate ,
                    isverifed: false ,
                    isAcceptingMessages: true,
                    messages: []
                })

                console.log(newuser)
            }

            //send email to user 
            const emailresponse = await mailsender(email , username ,Verifycode)
             
            if(! emailresponse.sucess) 
                {
                  return Response.json({
                    sucess :false ,
                    message : 'error while sending email' ,
                    STATUS_CODES :500
                  })
                }
            
            else
            {
                Response.json({
                    sucess :true ,
                    message : 'New user is created sucessfully' ,
                    STATUS_CODES :201
                })
            }
          
          
        }

       
  
    } catch (error) {
       console.log(error , 'error while regstiration of user') 
  
       Response.json({
        sucess: false,
        STATUS_CODES: 404
       })
           
     
    }
}