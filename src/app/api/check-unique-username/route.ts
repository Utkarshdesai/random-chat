import dbconnect from "@/lib/dbconfig";
import usermodel from "@/models/usermodel"; 
import { NextRequest } from "next/server";
import { z } from "zod";
import { uservalidationSchema } from "@/schemas/uservalidationSchema";

const uniqueuser = z.object({
    username : uservalidationSchema
})

export async function GET (req : NextRequest) 
{   
    await dbconnect()
    try {
        
           const {searchParams} = new URL (req.url)

           const queryparams ={
             username : searchParams.get('username')
           }

           const result = uniqueuser.safeParse(queryparams)

           if(!result.success)
            {
                const usernameErrors = result.error.format().username?._errors || [];
                    return Response.json(
                        {
                        success: false,
                        message:
                            usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                        },
                        { status: 400 }
                    );
            }

            const {username} = result.data 

          const checkexistinguser = await usermodel.findOne(
            {
                username,
                isverifed: true
               
            }
          )

          if(checkexistinguser) 
            {
                Response.json(
                    {
                        sucess:false ,
                        message: 'Username is exist try for another username'
                    },
                    {
                        status: 403
                    }
                )
            }

            Response.json(
                {
                    sucess: true ,
                    message : 'username is unique proceed further'
                },
                {
                    status: 200
                }
            )

    } catch (error) {
        console.log('error while cheching username unique')
        Response.json(
            {
                sucess : false ,
                message: 'error while checking unique username'
            },
            {
                status:500
            }
        )
    }
}