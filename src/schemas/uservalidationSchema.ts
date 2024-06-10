import {z} from 'zod' 

export const uservalidationSchema = z.object({
    username : z.string().
    max(2 , 'minimum length of username should be 2').
    max(14 , 'maximum length of username should be 14')
   
})
