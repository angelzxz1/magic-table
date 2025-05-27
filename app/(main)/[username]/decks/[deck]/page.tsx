import { ShowCards } from "@/components/ui/deck-page/show-cards";
import { db } from "@/lib/db";

const DeckPage = async ({ params }: { params: Promise<{ deck: string }> }) => {
    const { deck } = await params;
    const Mazo = await getDeck(deck);
    if (!Mazo) {
        return <div>Deck not found</div>;
    }
    const { cards } = Mazo;
    return (
        <div className="w-full h-full">
            <ShowCards deckList={cards} />
        </div>
    );
    // return <div>found</div>;
};

const getDeck = async (deckId: string) => {
    try {
        const deckRes = await db.deck.findUnique({
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
        if (!deckRes) return null;
        return deckRes;
    } catch (e) {
        console.log("Error finding deck in DB: ", e);
        return null;
    }
};

export default DeckPage;
