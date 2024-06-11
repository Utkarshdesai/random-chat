import dbconnect from "@/lib/dbconfig";
import usermodel from "@/models/usermodel";
import bcrypt from 'bcrypt'
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"


export const authoption :  NextAuthOptions = {
    providers : [
             
          CredentialsProvider ({
              id: 'crendinational' ,
              name : "Credentials" ,

              credentials : {
                Email: { label: "email", type: "email", placeholder: "abc@gmail.com" },
                password : { label: "Password", type: "password" } 

              },

              async authorize (credentials : any) : Promise <any> 
              { 
                  await dbconnect()
                 try 
                 {
                    // check user is exist 
                    const user = await usermodel.findOne( {
                      $or
                       :[
                          {
                            email : credentials.identifier
                          },

                          {
                              password: credentials.identifier
                          }
                      ]
                    })

                    if(!user?.email) 
                      {
                          throw new Error ( 'user is not found with this email')
                      }

                      if(!user?.isverifed)
                          {
                              throw new Error ( 'user is not verified')
                          }

                      const checkpassword = await bcrypt.compare ( credentials.password , user.password) 

                      if(checkpassword) 
                          {
                             Response.json({
                              message : 'password match sucessfully'
                             })
                          }

                          else 
                          {
                              throw new Error ( 'password is not found')
                          }

                 } 
                 
                 catch (error) {
                    console.log('error while registering user' , error)
                    Response.json(
                      {
                      sucess : false ,
                      message: 'error while registration'
                     },
                     {status:500}
                   )
                 }

              }              
          })        
    ],

    callbacks : {
       async jwt ( {token , user}) {
         
        if (user)
            {
                token._id = user._id?.toString(),
                token.username = user.username ,
                token.isAcceptingMessages =user.isAcceptingMessages,
                token.isverifed = user.isverifed
            }
          
            return token ;
         

       }, 

       async session ({token , session }) 
       {
           if(token) 
            {
               session.user._id = token._id ,
               session.user.username = token.username ,
               session.user.isAcceptingMessages = token.isAcceptingMessages ,
               session.user.isverifed = token.isverifed
              
            }

            return session; 
       }    
    } , 

    session : {
        strategy : "jwt"
    } , 

    secret :  process.env.SECRET_KEY ,

    pages : {
      signIn : '/Sign-In'
    }


};
