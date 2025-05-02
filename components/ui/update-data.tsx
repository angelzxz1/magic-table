"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader, Save } from "lucide-react";
import { User } from "@/lib/generated/prisma";
const formSchema = z.object({
    firstName: z.string().min(1, {
        message: "Email must be at least 1 characters.",
    }),
    lastName: z.string().min(1, {
        message: "Last name must be at least 1 characters.",
    }),
    username: z.string().min(5, {
        message: "username must be at least 5 characters.",
    }),
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }),
});
export function UserUpdate({ user }: { user: User }) {
    // const { user } = useAppSelector((state) => state.user);
    // console.log(user);
    const { firstName, lastName, username, email } = user;
    // const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [enableForm, setEnableForm] = useState(true);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName,
            lastName,
            username,
            email,
        },
        disabled: enableForm,
    });
    const toggleEnable = () => {
        setEnableForm(!enableForm);
    };
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await axios.post("/api/user/update", values);
            if (res.status !== 200) return console.log("There was an error");
            const data = await res.data;
            if (data.error) {
                console.log(data.error);
                return;
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="gap-8 flex flex-col h-full p-8"
            >
                <div className="h-1/3 w-full flex flex-wrap gap-4 items-center justify-end">
                    Enable Edit{" "}
                    <Switch
                        onCheckedChange={toggleEnable}
                        checked={!enableForm}
                    />
                </div>
                <div className="h-1/3 w-full flex flex-wrap gap-4 items-center justify-between">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => {
                            console.log("Field: ", field);
                            return (
                                <FormItem>
                                    <FormLabel className="flex justify-center">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex justify-center">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex justify-center">
                                    First Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex justify-center">
                                    Last Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="w-full h-1/3 flex flex-wrap items-center justify-between ">
                    <div className="w-full flex justify-end-safe">
                        <Button type="submit" disabled={enableForm}>
                            {loading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                <Save />
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
