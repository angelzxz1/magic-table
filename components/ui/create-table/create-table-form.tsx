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
import { useState } from "react";
import { Import, Loader } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { UserWithoutPassword } from "@/store/features/user/userSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const formSchema = z.object({
    name: z.string().min(5),
    maxPlayers: z.enum(["2", "3", "4", "5", "6"], {
        required_error: "You need to select a table size.",
    }),
});

export function CreateTableForm({ getTables }: { getTables: () => void }) {
    const router = useRouter();
    const user = useAppSelector(
        (state) => state.user.user
    ) as UserWithoutPassword;
    const [creatingTable, isCreatingTable] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            maxPlayers: "4",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit({ maxPlayers, name }: z.infer<typeof formSchema>) {
        isCreatingTable(true);
        try {
            const response = await fetch("/api/tables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    maxPlayers: parseInt(maxPlayers),
                    name,
                    userId: user.id,
                    creator: user.username,
                }),
            });

            if (!response.ok) {
                throw new Error("Error creating table");
            }
            const data = await response.json();
            console.log("Table created:", data);
            getTables(); // Refresh the list of tables after creation
            toast.success("Table created successfully!");
        } catch (error) {
            console.error("Failed to create table:", error);
            toast.error("Failed to create table. Please try again.");
        }
        isCreatingTable(false);
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full flex flex-wrap"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="ml-3">Table Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    {...field}
                                    placeholder="Commander night!"
                                    disabled={creatingTable}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maxPlayers"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="ml-3">Max Players</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-wrap gap-4 ml-3"
                                    disabled={creatingTable}
                                >
                                    <FormItem className="flex items-center gap-3">
                                        <FormControl>
                                            <RadioGroupItem value="2" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            2
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center gap-3">
                                        <FormControl>
                                            <RadioGroupItem value="3" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            3
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center gap-3">
                                        <FormControl>
                                            <RadioGroupItem value="4" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            4
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center gap-3">
                                        <FormControl>
                                            <RadioGroupItem value="5" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            5
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center gap-3">
                                        <FormControl>
                                            <RadioGroupItem value="6" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            6
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full justify-end">
                    <Button type="submit">
                        {creatingTable ? (
                            <Loader className="animate-spin" />
                        ) : (
                            "Create Table"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
