import {
    findUserById,
    matchSession,
    verifyJwt,
} from "@/api-libs/services/user.service";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "../session-verify";
import { Deck } from "@/lib/generated/prisma";

type jsonData = {
    userId: string;
};

export async function GET(req: Request) {
    try {
        const session = await verifySession();
        if (!session) return new NextResponse("No session", { status: 400 });
        const { userId } = session;
        if (!userId)
            return new NextResponse("Username is required", { status: 400 });
        const decks: Deck[] = await db.deck.findMany({
            where: {
                userId,
            },
        });
        return NextResponse.json(
            {
                message: "Deck list",
                decks,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log("Error: ", error);
        return new NextResponse("Internal server error", {
            status: 500,
        });
    }
}
