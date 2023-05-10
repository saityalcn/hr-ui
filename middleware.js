import { NextResponse } from "next/server";

export default function middleware(req){
    const {cookie} = req;
    const isAuthenticated = true
    const url = req.url;

    if(url.includes("/home") || url.includes("/employee")){
        if(!isAuthenticated){
            return NextResponse.redirect("http://localhost:3000/")
        }
    }   

    return NextResponse.next();
}