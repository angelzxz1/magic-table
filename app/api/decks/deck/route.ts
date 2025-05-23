import { NextRequest, NextResponse } from "next/server";
import {} from "@/api-libs/services/user.service";
import { Deck, User } from "@/lib/generated/prisma";
import type { Card } from "@/lib/utils";
import { db } from "@/lib/db";
type jsonData = {
    userId: string;
    deckName: string;
    commander: string;
    DeckList: Deck[];
};

export const POST = async (req: NextRequest) => {
    try {
        const { userId, DeckList, commander, deckName } =
            (await req.json()) as jsonData;
        if (!userId)
            return new NextResponse("User ID is required", { status: 400 });
        if (!DeckList)
            return new NextResponse("Deck List is required", { status: 400 });
        if (!commander)
            return new NextResponse("Commander is required", { status: 400 });
        if (!deckName)
            return new NextResponse("Deck Name is required", { status: 400 });

        console.log(DeckList.length);
        // const deck = db.deck.create({
        //     data: {
        //         commander: "",
        //         name: "",
        //         userId: "",
        //     },
        // });
        return NextResponse.json({
            message: "Deck Created",
            // deck,
        });
    } catch (error) {
        console.error("Error creating deck:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
