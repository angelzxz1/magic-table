"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDeck, fetchCardData, parseDeckList } from "@/lib/utils";
import { useState } from "react";
import { Import, Loader } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { UserWithoutPassword } from "@/store/features/user/userSlice";

const formSchema = z.object({
    deckName: z.string().min(5),
    deckList: z.string().min(2),
    commander: z.string().min(2),
});

export function DeckForm() {
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
        try {
            isFetching(true);
            const { commander, deckName } = values;
            const decklist = parseDeckList(values.deckList);
            const { notFound, results } = await fetchCardData(decklist);
            // const res = await createDeck({
            //     commander,
            //     DeckList: results,
            //     deckName,
            //     userId: user.id,
            // });

            // console.log(res);
            form.reset();
            if (notFound.length > 0) {
                let strNotFound = "---This cards weren't found---\n";
                notFound.forEach((item) => (strNotFound += `${item.name}\n`));
                strNotFound += "---The list below";
                form.setValue("deckList", strNotFound);
            }
            isFetching(false);
        } catch (error) {
            console.log("Error on the submit", error);
            isFetching(false);
        }
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
                            <FormControl>
                                <Input
                                    className="w-full"
                                    {...field}
                                    placeholder="Deck Name"
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
                            <FormControl>
                                <Input
                                    className="w-full"
                                    {...field}
                                    placeholder="Commander"
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
                            <FormControl>
                                <Textarea
                                    rows={50}
                                    placeholder="1x The Scarab God (hou) // use this format"
                                    className="h-96"
                                    {...field}
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
