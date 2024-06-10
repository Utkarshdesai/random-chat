import dbconnect from "@/lib/dbconfig";
import usermodel from "@/models/usermodel";
import { NextRequest } from "next/server";

export async function POST (req : NextRequest) 
{
    await dbconnect()
    try {
    
     const {username , code} = await req.json() 
     const decodeuser = decodeURIComponent(username)

     const user = await usermodel.findOne({username : decodeuser})

     if(!user)
        {
            Response.json(
                {
                    sucess: false,
                    message: 'username is not exist'
                },
                {
                    status : 404
                }
            )
        }

    const iscodevalid = user?.verifycode === code
    const isCodeNotExpired = user?.verifycodeexpiry &&  new Date(user?.verifycodeexpiry) > new Date(); 


    if(iscodevalid && isCodeNotExpired) 
        {
            user.isverifed = true;
            await user.save()

            Response.json(
                {
                    sucess: true ,
                    message : 'account is verify sucessfully'
                },
                {
                    status:200
                }
            )
        }

        else if(!isCodeNotExpired)
            {
                Response.json(
                    {
                        sucess : false ,
                        message : 'code is expired'
                    },
                    {
                        status:400
                    }
                )
            }

            else {
                Response.json(
                    {
                        sucess: false ,
                        message : 'Incorrect verification code'
                    },
                    {
                        status: 400
                    }

                )
            }



   } catch (error) {
      console.log('error while verify code of user' ,error)
      Response.json(
        {
            sucess: false,
            message : 'error while verify-code'
        },
        {
            status: 404
        }
      )
   }
}