import { z } from "zod"; 

export const MessageSchema = z.object({
    content : z.string()
              .max(30 ,{message :'minimum 30 character is allowed'})
})

