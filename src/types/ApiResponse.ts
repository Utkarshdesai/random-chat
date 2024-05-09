import { Message } from "../models/usermodel"

export interface ApiResponse {
    sucess : boolean ,
    message? : string ,
    statuscode?: number ,
    messages? :  Message[] ,
    isAcceptingMessages?: boolean;
}