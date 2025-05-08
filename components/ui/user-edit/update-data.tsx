"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { setUser, UserWithoutPassword } from "@/store/features/user/userSlice";
import { useAppDispatch } from "@/store/hooks";
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
export function UserUpdate({ user }: { user: UserWithoutPassword }) {
    const dispatch = useAppDispatch();
    const { firstName, lastName, username, email } = user;
    const router = useRouter();
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
            const res = await axios.post<{
                message: string;
                user: UserWithoutPassword;
            }>("/api/user/update", values);
            const { data } = res;
            dispatch(setUser(data.user));
            router.refresh();
            toast.success("User information updated successfully");
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="gap-8 flex flex-col h-full p-8 justify-between"
            >
                <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="flex justify-center">
                                    Username
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
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
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
                            <FormItem className="w-full">
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
                            <FormItem className="w-full">
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
                <div className="w-full flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center justify-end">
                        Enable Edit{" "}
                        <Switch
                            onCheckedChange={toggleEnable}
                            checked={!enableForm}
                        />
                    </div>
                    <div className="flex justify-end-safe ">
                        <Button
                            type="submit"
                            disabled={enableForm}
                            className="cursor-pointer"
                        >
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
