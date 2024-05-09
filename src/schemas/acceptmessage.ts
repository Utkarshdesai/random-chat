import { z } from "zod"; 

export const acceptmessageSchema = z.object({
    acceptmsg : z.boolean()
})

