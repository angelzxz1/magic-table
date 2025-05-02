import {
    findUserById,
    matchSession,
    verifyJwt,
} from "@/api-libs/services/user.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const cookieStore = await cookies();
    if (!cookieStore)
        return new NextResponse("No cookies found", { status: 404 });
    const token = cookieStore.get("token");
    if (!token) return new NextResponse("No token found", { status: 404 });
    const verifiedToken = verifyJwt(token.value) as {
        sessionId: string;
        userId: string;
    };
    if (!verifiedToken)
        return new NextResponse("Invalid token", { status: 401 });
    const sessionId = verifiedToken.sessionId;
    const userId = verifiedToken.userId;
    if (!sessionId || !userId)
        return new NextResponse("Invalid token", { status: 401 });
    const session = await matchSession(sessionId, userId);

    if (!session) {
        const res = new NextResponse("Session not found", { status: 404 });
        console.log("Session not found, clearing cookie");
        res.cookies.set("token", "", { maxAge: 0 });
        return res;
    }

    if (session.userId !== userId)
        return new NextResponse("Invalid token", { status: 401 });
    const user = await findUserById(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });
    return NextResponse.json({
        message: "Token is valid",
        session,
        user,
    });
}
