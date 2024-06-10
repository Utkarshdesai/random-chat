import dbconnect from "@/lib/dbconfig";
import usermodel, { Message, user } from "@/models/usermodel";


export async function POST (req : Request) 
{ 
    await dbconnect()

    try {
        
          const { content , username} = await req.json() 

          //check user is exist 
          const user = await usermodel.findOne({username})

          if(!user) 
            {
                Response.json(
                    {
                        mesage : "user is not Present" ,
                        sucess: false
                    }
                )
            }

        //check user is verifed 
         if(!user?.isAcceptingMessages) 
            {
                Response.json(
                    {
                        messge: 'user is not verfied',
                        sucess:false
                    }
                )
            }
        
        const updatedmessage = {content , createdAt:new Date ()}

         user?.messages.push(updatedmessage as Message)

         await user?.save() 

         Response.json(
            {
                message: "Messages are sent sucessfully",
                sucess: true
            },
            {
                status:201
            }
         )


    } catch (error) {
        Response.json(
            { 
              sucess: false,
              messge : "error while sending messages to user"
            },

            {
                status: 404
            }
        )
    }
}