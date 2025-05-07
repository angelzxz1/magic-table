import {
    createSession,
    findUserByEmail,
    generateToken,
    verifyPassword,
} from "@/api-libs/services/user.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
type jsonData = {
    email: string;
    password: string;
};

export const POST = async (req: NextRequest) => {
    try {
        // Get email and password from request body
        const { email, password } = (await req.json()) as jsonData;

        // Check if email and password are provided
        if (!email)
            return new NextResponse("Email is required", { status: 400 });
        if (!password)
            return new NextResponse("Password is required", { status: 400 });

        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) return new NextResponse("User not found", { status: 404 });

        // Check if password is correct
        console.log("Login: ", password, " - ", user.password);
        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch)
            return new NextResponse("Invalid credentials", { status: 401 });

        const session = await createSession(user.id);
        if (!session)
            return new NextResponse("Session not created", { status: 500 });

        const token = generateToken(user.id, session.id);
        const { password: _, ...userWithoutPassword } = user;

        const res = NextResponse.json({
            message: "Login successful",
            user: userWithoutPassword,
        });
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        return res;
    } catch (error) {
        console.error("Error in login:", error);
        return new NextResponse("Internal server error", {
            status: 500,
        });
    }
};
