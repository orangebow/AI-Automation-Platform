//"use client";
import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";
import   Link  from "next/link";
import Image from "next/image";

const Page = async () => {

    //await requireUnauth();
 
            
          return  <LoginForm/>;
        
};

export default Page;

//I didn't have to write auth for going on login page in url:
//just: http://localhost:3000/login
// even my page.tsx is in login in (auth) in app in src;
//that's why we use (folder_name) so that it cannot be part of url. 