import dbconnect from "@/lib/dbconfig";
import usermodel from "@/models/usermodel"; 
import { NextRequest } from "next/server"; 
import { authoption } from "../auth/[...nextauth].ts/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST (req: NextRequest) 
{  
    await dbconnect()

    const session = await getServerSession(authoption)

     const user: User = session?.user

     if(!session || session.user)
      {
         return Response.json(
          {
              sucess: false ,
              message : "User is not Autheticated"
          }
        )
      }
       
  try {
     
    const UserId = user._id 

    const {acceptmessge} = await req.json()

    const updateduser = await usermodel.findOneAndUpdate(
        {
          UserId ,
          isAcceptingMessages : acceptmessge 
        },
        {
          new:true
        }
      )

    if(!updateduser)
      {
       return Response.json(
          {
            sucess:false,
            message: 'user is not found'
          }
        )
      }

      Response.json(
        {
          sucess : true ,
          message : 'User is now accepting message'
        },
        {
          status:200
        }
      )



  } catch (error) {
    console.log('error while accepting message',error)
    Response.json(
        {
            sucess: false ,
            message : "error while accepting messages"
        }
    )
  }
}

export async function GET () 
{
  await dbconnect()

  const session = await getServerSession(authoption)

   const user: User = session?.user

   if(!session || session.user)
    {
      return Response.json(
        {
            sucess: false ,
            message : "User is not Autheticated"
        }
      )
    }

    try {

      const founduser = await usermodel.findById(user._id) 

      if(!founduser)
        {
          return Response.json(
            {
              sucess: false ,
              message : "user not found"
          }
          );
        }

        return Response.json(
          {
            sucess: true ,
            message :'user found',
            isAcceptingMessages : user.isAcceptingMessages
          },
          {
            status:200
          }
        )
      
    } catch (error) {
      console.log()
       
      return Response.json(
        {
          sucess: false ,
          message : 'Error retrieving message acceptance status',
         
        },
        {
          status:500
        }
      )
    }
}