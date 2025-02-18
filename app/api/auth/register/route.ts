import { NextRequest, NextResponse } from "next/server";
import { connectionDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest){

    try {
        const { email, password } = await request.json()

        if(!email || !password){
            return NextResponse.json(
                { error: "Email and password is required" },
                { status: 400 }
            )
        }

        await connectionDb();

        const existingUser = await User.findOne({email})

        if(existingUser){
            return NextResponse.json(
                { error: "Email is already registered" },
                { status: 400 }
            )
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error in creating user", error);
        
        return NextResponse.json(
            { error: "Failed to register User" },
            { status: 500 }
        )
    }
}