import { NextRequest ,NextResponse } from "next/server";
import { getToken , GetTokenParams, JWT} from "next-auth/jwt"; 
export { default } from "next-auth/middleware" 

export async function middleware(request : NextRequest ) {

    const token = await getToken({req : request , secret : process.env.SECRET_KEY})
    const url = request.nextUrl;

    if(token && (url.pathname.startsWith('/dashboard') ||  

      url.pathname.startsWith('/sign-in') || 
      url.pathname.startsWith('/sign-up') || 
      url.pathname.startsWith('/dashboard') )
   )

   {
    return NextResponse.redirect(new URL('/dashboard', request.url));
   }
 
   
   if(!token && url.pathname.startsWith('/dashboard'))
    {
        return NextResponse.redirect( new URL ('/sign-in' ,request.url))
    }


     return NextResponse.next()
  
    
  }
   
  // See "Matching Paths" below to learn more
  export const config = {
    matcher: ['/dashboard' , '/sign-in'  ,'/sign-up'
        
    ],
  }