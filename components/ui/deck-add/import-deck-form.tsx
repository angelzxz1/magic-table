"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    createDeck,
    fetchCard,
    fetchCards,
    parseCardName,
    parseDeckList,
} from "@/lib/utils";
import { useState } from "react";
import { Import, Loader } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { UserWithoutPassword } from "@/store/features/user/userSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    deckName: z.string().min(5),
    deckList: z.string().min(2),
    commander: z.string().min(2),
});

export function DeckForm() {
    const router = useRouter();
    const user = useAppSelector(
        (state) => state.user.user
    ) as UserWithoutPassword;
    const [fetching, isFetching] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deckList: "",
            commander: "",
            deckName: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        isFetching(true);
        const { commander, deckName, deckList } = values;
        const formatedCommander = parseCardName(commander);
        if (!formatedCommander) {
            toast.error("Invalid commander format.");
            isFetching(false);
            return;
        }
        const fetchedCommaner = await fetchCard(formatedCommander);
        if (!fetchedCommaner) {
            toast.error("Commander not found.");
            isFetching(false);
            return;
        }
        const decklist = parseDeckList(deckList);
        const { notFound, results } = await fetchCards(decklist);

        if (notFound.length > 0) {
            form.setValue("deckList", "");
            let strNotFound = "---This cards weren't found---\n";
            notFound.forEach((item) => {
                const { quantity, name, setCode } = item;
                strNotFound += `${quantity} ${name} (${setCode})\n`;
            });
            strNotFound += "---The list below was found---\n";
            results.forEach((item) => {
                const { card, quantity } = item;
                const { name, setCode } = card;
                strNotFound += `${quantity} ${name} (${setCode})\n`;
            });
            form.setValue("deckList", strNotFound);
            toast.error("Some cards were not found.");
        } else {
            const res = await createDeck({
                commander: fetchedCommaner,
                DeckList: results,
                deckName,
                userId: user.id,
            });
            if (!res) {
                toast.error("Error creating deck.");
                isFetching(false);
                return;
            }
            form.setValue("deckList", "");
            form.setValue("commander", "");
            form.setValue("deckName", "");
            toast.success("Deck created successfully!");
            router.push(`/${user.username}/decks/${res.deck.id}`);
        }
        isFetching(false);
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full flex flex-wrap"
            >
                <FormField
                    control={form.control}
                    name="deckName"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="ml-3">Deck Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    {...field}
                                    placeholder="Awesome Deck"
                                    disabled={fetching}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="commander"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="ml-3">Commander</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    {...field}
                                    placeholder="1 The Scarab God (hou) "
                                    disabled={fetching}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="deckList"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="ml-3">The 99 List</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={50}
                                    placeholder="6 Swamp (hou) // use this format"
                                    className="h-96"
                                    {...field}
                                    disabled={fetching}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full justify-end">
                    <Button type="submit">
                        {fetching ? (
                            <Loader className="animate-spin" />
                        ) : (
                            <Import />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
