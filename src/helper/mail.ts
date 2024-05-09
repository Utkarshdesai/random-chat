import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/Resendmail";
import VerificationEmail from '../../email/Verificationemail'

async function Sendemail(email :string ,  verifycode: string , username:string) : Promise<ApiResponse>
{
    try {
      // write down logic
      const { data, error } = await resend.emails.send({
         from: 'Acme <onboarding@resend.dev>',
         to: email,
         subject: 'mystery message verification code',
         react: VerificationEmail({username , otp:verifycode})
       });

       console.log(data)

       return {sucess : true , message: 'send email sucessfully',statuscode:201 ,}

    } catch (error) {

      console.log(error)

      return {sucess : false , message: 'send email sucessfully' , statuscode: 404}
    }
   
   
}

export default Sendemail