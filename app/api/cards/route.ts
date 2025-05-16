import { NextRequest, NextResponse } from "next/server";
import {
    createUser,
    findUserByEmail,
    findUserById,
    hashPassword,
} from "@/api-libs/services/user.service";
import { User } from "@/lib/generated/prisma";
import { db } from "@/lib/db";

type jsonData = {
    imgUrl: string;
    name: string;
    scryfallId: string;
    manaCost: string;
};

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name");
        if (!name) return new NextResponse("Name is required", { status: 400 });
        const cards = await db.card.findMany({
            where: {
                name,
            },
        });
        return NextResponse.json({
            cards,
        });
    } catch (error) {
        console.error("Error finding card:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const { imgUrl, name, scryfallId, manaCost } =
            (await req.json()) as jsonData;
        if (!imgUrl)
            return new NextResponse("imgUrl is required", { status: 400 });
        if (!name) return new NextResponse("name is required", { status: 400 });
        if (!scryfallId)
            return new NextResponse("scryfallId is required", { status: 400 });

        const existingCard = await db.card.findUnique({
            where: {
                scryfallId,
            },
        });

        if (existingCard)
            return new NextResponse("Card already existing", { status: 400 });

        const card = await db.card.create({
            data: {
                imgUrl,
                name,
                scryfallId,
                manaCost: manaCost ? manaCost : "",
            },
        });

        if (!card)
            return new NextResponse("Error adding card to db", { status: 500 });

        return NextResponse.json(
            {
                message: "Card added successfully",
                card,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
