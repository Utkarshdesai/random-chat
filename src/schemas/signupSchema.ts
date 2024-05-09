import {z} from 'zod' 

export const signUpSchema = z.object({
    username : z.string() ,
    email : z.string().email({message:'Invalid email address'}) ,
    password : z.string()
                .max(10 ,{message: 'Maximam 10 character required'})
                .min(6 ,{message: 'minimum 6 character required'})

})

