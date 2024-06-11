import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      isverifed?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    isverifed?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isverifed?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}