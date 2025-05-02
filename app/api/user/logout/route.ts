// /api/logout/route.ts

import { matchSession, verifyJwt } from "@/api-libs/services/user.service";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        if (!cookieStore)
            return NextResponse.json({ message: "No cookies found, all good" });

        const token = cookieStore.get("token");

        if (!token)
            return NextResponse.json({ message: "No token found, all good" });

        const { sessionId, userId } = verifyJwt(token.value) as {
            sessionId: string;
            userId: string;
        };

        if (!sessionId || !userId) {
            const res = NextResponse.json({
                message: "No user or session, all good, clearing token",
            });
            res.cookies.set("token", "", { maxAge: 0 });
            return res;
        }

        const deletedSession = await db.session.delete({
            where: {
                id: sessionId,
                userId: userId,
            },
        });

        if (!deletedSession) {
            const res = NextResponse.json({
                message: "Session not found, all good, clearing token",
            });
            res.cookies.set("token", "", { maxAge: 0 });
            return res;
        }

        const res = NextResponse.json({ message: "Logged out" });
        res.cookies.set("token", "", { maxAge: 0 });
        return res;
    } catch (error) {
        console.error("Error logging out", error);
    }
}
