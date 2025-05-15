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
import { fetchCardData, parseDeckList } from "@/lib/utils";
import { useState } from "react";
import { Import, Loader } from "lucide-react";

const formSchema = z.object({
    deckList: z.string().min(2),
});

export function DeckForm() {
    const [fetching, isFetching] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deckList: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        isFetching(true);
        const decklist = parseDeckList(values.deckList);
        const res = await fetchCardData(decklist);
        form.reset();
        isFetching(false);
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full flex flex-wrap"
            >
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
