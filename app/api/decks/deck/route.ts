import { NextRequest, NextResponse } from "next/server";
import {} from "@/api-libs/services/user.service";
import { User } from "@/lib/generated/prisma";
import type { Card } from "@/lib/utils";
type jsonData = {
    userId: string;
    deckName: string;
};

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = (await req.json()) as jsonData;
        if (!userId)
            return new NextResponse("User ID is required", { status: 400 });
    } catch (error) {
        console.error("Error creating deck:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
