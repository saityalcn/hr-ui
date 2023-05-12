import { NextRequest, NextResponse } from "next/server";
import jsCookie from 'js-cookie';

export default function middleware(req){
    const isAuthenticated = true
    const url = req.url;
    const cookie = req.cookies
    var email = "abc"


    email = cookie.get("email")?.value
    
    if(url.includes("/home") || url.includes("/employee") || url.includes("/project")){
        if(!email){
            return NextResponse.redirect("http://localhost:3000/")
        }
    }   

    return NextResponse.next();
}