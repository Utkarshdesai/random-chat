import { z } from "zod"; 

export const verifySchema = z.object({
    verifymsg : z.string().length(6 ,{message:'verification code should be 6 digit'})
})