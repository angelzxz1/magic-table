import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { result } from "@/lib/utils";
type jsonData = {
    userId: string;
    deckName: string;
    commander: result;
    DeckList: result[];
};

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const deckId = searchParams.get("deckId");
        console.log("Deck ID: ", deckId);
        if (!deckId)
            return new NextResponse("Deck ID is required", { status: 400 });
        const deck = await db.deck.findUnique({
            where: {
                id: deckId,
            },
            include: {
                commander: true,
                cards: {
                    include: {
                        card: true,
                    },
                },
            },
        });
        if (!deck) return new NextResponse("Deck not found", { status: 404 });
        return NextResponse.json({
            deck,
        });
    } catch (error) {
        console.error("Error finding deck:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
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
        if (DeckList.length === 0)
            return new NextResponse("Deck List is empty", { status: 400 });
        if (DeckList.length > 100)
            return new NextResponse("Deck List is too long", { status: 400 });
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) return new NextResponse("User not found", { status: 404 });
        const commanderInList = DeckList.find(
            (item) => item.card.name === commander.card.name
        );
        if (commanderInList)
            return new NextResponse(
                "Commander shoulnd not be in the deck list",
                { status: 404 }
            );
        const deck = await db.deck.create({
            data: {
                commanderId: commander.card.id,
                name: deckName,
                userId,
            },
        });
        if (!deck) return new NextResponse("Deck not created", { status: 500 });
        const notAddedCards: string[] = [];
        DeckList.forEach(async (item) => {
            const { card, quantity } = item;
            const { id: CardID } = card;
            const cardInDeck = await db.deckCard.create({
                data: {
                    deckId: deck.id,
                    cardId: CardID,
                    count: quantity,
                },
            });
            if (!cardInDeck) {
                notAddedCards.push(card.name);
            }
        });
        if (notAddedCards.length > 0) {
            return new NextResponse(
                `Deck created, but some cards were not added: ${notAddedCards.join(
                    ", "
                )}`,
                { status: 500 }
            );
        }
        return NextResponse.json({
            message: "Deck Created!",
            deck,
        });
    } catch (error) {
        console.error("Error creating deck:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
